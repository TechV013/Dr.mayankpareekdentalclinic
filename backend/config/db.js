import pg from "pg";
import "dotenv/config";

const { Pool, types } = pg;

// ---------------------------------------------------------
// Postgres type parsers — keep the string shapes the app expects
// ---------------------------------------------------------
// int8 → number
types.setTypeParser(20, (value) => (value === null ? null : Number(value)));
// DATE → "YYYY-MM-DD" string (frontend formatDate relies on this)
types.setTypeParser(1082, (value) => value);
// TIMESTAMP → "YYYY-MM-DD HH:MM:SS" string
types.setTypeParser(1114, (value) =>
  value instanceof Date
    ? value.toISOString().slice(0, 19).replace("T", " ")
    : value
);
// TIMESTAMPTZ → ISO string
types.setTypeParser(1184, (value) =>
  value instanceof Date ? value.toISOString() : value
);

// ---------------------------------------------------------
// Schema
// ---------------------------------------------------------
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    dental_concern VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL
  );
`;

// ---------------------------------------------------------
// Neon / Postgres pool (singleton)
// ---------------------------------------------------------
const pgUrl = (
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  ""
).trim();

// Controllers use `?` placeholders; Postgres needs $1..$n — convert on the fly.
const toPgPlaceholders = (sql, params) => {
  if (!params || params.length === 0 || !sql.includes("?")) return sql;
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

const runQuery = async (executor, sql, params = []) => {
  const result = await executor.query(toPgPlaceholders(sql, params), params);

  if (/^\s*insert into/i.test(sql) && result.rows.length > 0 && "id" in result.rows[0]) {
    return [{ insertId: result.rows[0].id, affectedRows: result.rowCount }];
  }

  if (/^\s*(update|delete)/i.test(sql)) {
    return [{ affectedRows: result.rowCount }];
  }

  return [result.rows];
};

const PG_RETRY_MS = 60_000;
let pgPool = null;
let pgInitPromise = null;
let lastPgAttempt = 0;

const ensurePg = async () => {
  if (pgPool) return pgPool;

  if (!pgUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const now = Date.now();
  if (pgInitPromise) return pgInitPromise;
  if (lastPgAttempt && now - lastPgAttempt < PG_RETRY_MS) {
    throw new Error("Postgres retry backoff in effect");
  }

  lastPgAttempt = now;
  pgInitPromise = (async () => {
    try {
      const sslMode = (pgUrl.match(/sslmode=([^&]+)/) || [])[1];
      const ssl = sslMode === "disable" ? false : { rejectUnauthorized: false };

      const connectionString = pgUrl.includes("uselibpqcompat=")
        ? pgUrl
        : `${pgUrl}${pgUrl.includes("?") ? "&" : "?"}uselibpqcompat=true`;

      const pool = new Pool({
        connectionString,
        ssl,
        max: 5,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 10000,
      });

      await pool.query("SELECT 1");
      await pool.query(SCHEMA_SQL);
      pgPool = pool;
      console.log("Connected to Neon/Postgres database.");
      return pgPool;
    } catch (error) {
      console.error("Postgres connection failed:", error.message);
      pgPool = null;
      throw error;
    } finally {
      pgInitPromise = null;
    }
  })();

  return pgInitPromise;
};

// ---------------------------------------------------------
// Unified pool interface (used by all controllers)
// ---------------------------------------------------------
const proxyPool = {
  async query(sql, params) {
    const pool = await ensurePg();
    return runQuery(pool, sql, params);
  },
  async getConnection() {
    const pool = await ensurePg();
    const client = await pool.connect();
    return {
      async beginTransaction() {
        await client.query("BEGIN");
      },
      async commit() {
        await client.query("COMMIT");
      },
      async rollback() {
        await client.query("ROLLBACK");
      },
      release() {
        client.release();
      },
      async query(sql, params) {
        return runQuery(client, sql, params);
      },
    };
  },
};

export default proxyPool;
