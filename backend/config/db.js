import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, "../data/appointments.json");

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2), "utf8");
}

const readData = () => {
  try {
    const content = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
};

const executeJsonQuery = (sql, params = []) => {
  let appointments = readData();
  const upperSql = sql.trim().toUpperCase();

  if (upperSql.startsWith("SELECT")) {
    let results = [...appointments];

    if (upperSql.includes("WHERE")) {
      results = results.filter(item => {
        if (upperSql.includes("ID = ?")) {
          return item.id === Number(params[0]);
        }
        if (upperSql.includes("APPOINTMENT_DATE = ?") && upperSql.includes("APPOINTMENT_TIME = ?")) {
          const dateMatch = item.appointment_date === params[0];
          const timeMatch = item.appointment_time === params[1];
          if (upperSql.includes("STATUS = 'CONFIRMED'")) {
            return dateMatch && timeMatch && item.status === "CONFIRMED";
          }
          if (upperSql.includes("ID != ?")) {
            return dateMatch && timeMatch && item.status === "CONFIRMED" && item.id !== Number(params[2]);
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
      id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
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
    writeData(appointments);
    return [{ insertId: newAppointment.id, affectedRows: 1 }];
  }

  if (upperSql.startsWith("UPDATE APPOINTMENTS")) {
    const id = Number(params[params.length - 1]);
    appointments = appointments.map(item => {
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
    writeData(appointments);
    return [{ affectedRows: 1 }];
  }

  if (upperSql.includes("SELECT 1")) {
    return [[{ database_test: 1 }]];
  }

  return [[]];
};

let activePool = null;
let useJsonFallback = false;

const initDb = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
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
    console.warn("MySQL connection not available. Using local JSON database storage fallback.");
    useJsonFallback = true;
  }
};

initDb();

const proxyPool = {
  async query(sql, params) {
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
