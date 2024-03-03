import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Amnil",
  password: "Nike$h12345",
  port: 5432,
});

export default pool;
