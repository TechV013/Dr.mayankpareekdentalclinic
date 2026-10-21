import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   Tiered storage:
   1. MySQL        — when DB_HOST is configured and reachable
   2. Upstash KV   — when Vercel KV env vars are present
   3. JSON + memory — always works (never crashes)
========================================================= */

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
// MySQL pool (tier 1)
// ---------------------------------------------------------

let activePool = null;
let useJsonFallback = false;

const mysqlReady = (async () => {
  if (!process.env.DB_HOST) {
    useJsonFallback = true;
    return;
  }
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "shree_shyam_dental",
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 3000,
    });

    await pool.query("SELECT 1");
    activePool = pool;
    console.log("Connected to MySQL database.");
  } catch {
    console.warn(
      "MySQL connection not available. Using fallback storage (KV/JSON)."
    );
    useJsonFallback = true;
  }
})();

// ---------------------------------------------------------
// Unified pool interface (used by all controllers)
// ---------------------------------------------------------

const proxyPool = {
  async query(sql, params) {
    await mysqlReady;
    if (useJsonFallback || !activePool) {
      return executeJsonQuery(sql, params);
    }
    try {
      return await activePool.query(sql, params);
    } catch {
      useJsonFallback = true;
      return executeJsonQuery(sql, params);
    }
  },
  async getConnection() {
    await mysqlReady;
    if (useJsonFallback || !activePool) {
      return {
        async beginTransaction() {},
        async commit() {},
        async rollback() {},
        release() {},
        async query(sql, params) {
          return executeJsonQuery(sql, params);
        },
      };
    }
    try {
      return await activePool.getConnection();
    } catch {
      useJsonFallback = true;
      return {
        async beginTransaction() {},
        async commit() {},
        async rollback() {},
        release() {},
        async query(sql, params) {
          return executeJsonQuery(sql, params);
        },
      };
    }
  },
};

export default proxyPool;
