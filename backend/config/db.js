import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const { Pool, types } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   Tiered storage:
   1. Neon/Postgres — when DATABASE_URL is configured
   2. Upstash KV    — when Vercel KV env vars are present
   3. JSON + memory — always works (never crashes)
========================================================= */

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
// JSON file + in-memory store
// ---------------------------------------------------------

let appointments = [];

// Writable location: /tmp on Vercel serverless, backend/data locally.
const dataDir = process.env.VERCEL
  ? "/tmp"
  : path.join(__dirname, "../data");

const dataFile = path.join(dataDir, "appointments.json");

const loadFromFile = () => {
  try {
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        appointments = parsed;
      }
    }
  } catch {
    // Never crash on read failures — start with empty store.
  }
};

const saveToFile = () => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(appointments, null, 2), "utf8");
  } catch {
    // Read-only filesystem (e.g. Vercel bundle) — ignore; KV/memory still work.
  }
};

// ---------------------------------------------------------
// Upstash Redis (Vercel KV) persistence — plain REST, no deps
// ---------------------------------------------------------

const kvUrl = (
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  ""
).replace(/\/+$/, "");

const kvToken =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  "";

const kvEnabled = Boolean(kvUrl && kvToken);

const kvHeaders = {
  Authorization: `Bearer ${kvToken}`,
  "Content-Type": "application/json",
};

const kvGet = async () => {
  if (!kvEnabled) return null;
  try {
    const res = await fetch(`${kvUrl}/get/appointments`, {
      headers: kvHeaders,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.result === "string") {
      return JSON.parse(data.result);
    }
    return null;
  } catch {
    return null;
  }
};

const kvSet = async () => {
  if (!kvEnabled) return;
  try {
    await fetch(`${kvUrl}/set`, {
      method: "POST",
      headers: kvHeaders,
      body: JSON.stringify({
        key: "appointments",
        value: JSON.stringify(appointments),
      }),
    });
  } catch {
    // Persistence is best-effort; in-memory state remains correct.
  }
};

const persist = async () => {
  saveToFile();
  await kvSet();
};

// Load initial data once: file first, then KV (KV wins if it has data).
const fallbackReady = (async () => {
  loadFromFile();
  if (kvEnabled) {
    const rows = await kvGet();
    if (Array.isArray(rows)) {
      appointments = rows;
    }
  }
})();

// ---------------------------------------------------------
// JSON engine — understands the exact queries this app runs
// ---------------------------------------------------------

const executeJsonQuery = async (sql, params = []) => {
  await fallbackReady;

  const upperSql = sql.trim().toUpperCase();

  if (upperSql.includes("SELECT 1")) {
    return [[{ database_test: 1 }]];
  }

  if (upperSql.startsWith("SELECT")) {
    let results = [...appointments];

    if (upperSql.includes("WHERE")) {
      results = results.filter((item) => {
        if (upperSql.includes("ID = ?")) {
          return item.id === Number(params[0]);
        }
        if (
          upperSql.includes("APPOINTMENT_DATE = ?") &&
          upperSql.includes("APPOINTMENT_TIME = ?")
        ) {
          const dateMatch = item.appointment_date === params[0];
          const timeMatch = item.appointment_time === params[1];
          if (upperSql.includes("STATUS = 'CONFIRMED'")) {
            return dateMatch && timeMatch && item.status === "CONFIRMED";
          }
          if (upperSql.includes("ID != ?")) {
            return (
              dateMatch &&
              timeMatch &&
              item.status === "CONFIRMED" &&
              item.id !== Number(params[2])
            );
          }
          return dateMatch && timeMatch;
        }
        if (upperSql.includes("STATUS = ?")) {
          return item.status === params[0];
        }
        return true;
      });
    }

    if (upperSql.includes("ORDER BY CREATED_AT DESC")) {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return [results];
  }

  if (upperSql.startsWith("INSERT INTO APPOINTMENTS")) {
    const newAppointment = {
      id:
        appointments.length > 0
          ? Math.max(...appointments.map((a) => a.id)) + 1
          : 1,
      full_name: params[0],
      phone: params[1],
      email: params[2],
      appointment_date: params[3],
      appointment_time: params[4],
      dental_concern: params[5],
      message: params[6] || null,
      status: params[7] || "PENDING",
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      confirmed_at: null,
    };
    appointments.push(newAppointment);
    await persist();
    return [{ insertId: newAppointment.id, affectedRows: 1 }];
  }

  if (upperSql.startsWith("UPDATE APPOINTMENTS")) {
    const id = Number(params[params.length - 1]);
    appointments = appointments.map((item) => {
      if (item.id === id) {
        if (upperSql.includes("STATUS = 'CONFIRMED'")) {
          return {
            ...item,
            status: "CONFIRMED",
            confirmed_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          };
        }
        if (upperSql.includes("STATUS = 'REJECTED'")) {
          return {
            ...item,
            status: "REJECTED",
          };
        }
      }
      return item;
    });
    await persist();
    return [{ affectedRows: 1 }];
  }

  return [[]];
};

// ---------------------------------------------------------
// Neon / Postgres pool (tier 1)
// ---------------------------------------------------------

let pgPool = null;
let useFallback = false;

// mysql2-compatible result shaping so controllers stay unchanged.
// Controllers use `?` placeholders; Postgres needs $1..$n — convert on the fly.
const toPgPlaceholders = (sql, params) => {
  if (!params || params.length === 0 || !sql.includes("?")) return sql;
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

const runQuery = async (executor, sql, params = []) => {
  const result = await executor.query(toPgPlaceholders(sql, params), params);

  if (/^\s*insert into/i.test(sql) && result.rows.length > 0 && "id" in result.rows[0]) {
    return [[{ insertId: result.rows[0].id, affectedRows: result.rowCount }]];
  }

  if (/^\s*(update|delete)/i.test(sql)) {
    return [[{ affectedRows: result.rowCount }]];
  }

  return [result.rows];
};

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

const PG_RETRY_MS = 60_000;
let lastPgAttempt = 0;
let pgInitPromise = null;

const pgUrl = (
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  ""
).trim();

// Lazy + retryable: Neon free-tier computes suspend, so the first connect may
// time out. Retry on later requests instead of falling back forever.
const ensurePg = async () => {
  if (pgPool) return pgPool;
  if (!pgUrl) return null;

  const now = Date.now();
  if (pgInitPromise) return pgInitPromise;
  if (lastPgAttempt && now - lastPgAttempt < PG_RETRY_MS) return null;

  lastPgAttempt = now;
  pgInitPromise = (async () => {
    try {
      const sslMode = (pgUrl.match(/sslmode=([^&]+)/) || [])[1];
      const ssl = sslMode === "disable" ? false : { rejectUnauthorized: false };

      const pool = new Pool({
        connectionString: pgUrl,
        ssl,
        max: 5,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 10000,
      });

      await pool.query("SELECT 1");
      await pool.query(SCHEMA_SQL);
      pgPool = pool;
      useFallback = false;
      console.log("Connected to Neon/Postgres database.");
      return pgPool;
    } catch (error) {
      console.warn(
        "Postgres connection not available. Using fallback storage (KV/JSON).",
        error.message
      );
      return null;
    } finally {
      pgInitPromise = null;
    }
  })();

  return pgInitPromise;
};

// ---------------------------------------------------------
// Unified pool interface (used by all controllers)
// ---------------------------------------------------------

const fallbackConnection = () => ({
  async beginTransaction() {},
  async commit() {},
  async rollback() {},
  release() {},
  async query(sql, params) {
    return executeJsonQuery(sql, params);
  },
});

const proxyPool = {
  async query(sql, params) {
    const pool = await ensurePg();
    if (!pool) {
      useFallback = true;
      return executeJsonQuery(sql, params);
    }
    try {
      return await runQuery(pool, sql, params);
    } catch (error) {
      // Transient DB failure: drop the pool and retry init next request.
      console.warn("Postgres query failed, using fallback for now.", error.message);
      try {
        await pool.end();
      } catch {}
      pgPool = null;
      useFallback = true;
      return executeJsonQuery(sql, params);
    }
  },
  async getConnection() {
    const pool = await ensurePg();
    if (!pool) {
      useFallback = true;
      return fallbackConnection();
    }
    try {
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
    } catch (error) {
      console.warn("Postgres client checkout failed, using fallback for now.", error.message);
      pgPool = null;
      useFallback = true;
      return fallbackConnection();
    }
  },
};

export default proxyPool;
