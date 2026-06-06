const fs = require("fs");
const { Client } = require("pg");

const envText = fs.readFileSync(".env", "utf8");
const directUrl = envText.match(/^DATABASE_URL="(.+)"$/m)?.[1];
const normalizedUrl = new URL(directUrl);
normalizedUrl.searchParams.delete("sslmode");

if (!directUrl) {
  console.error("DATABASE_URL no encontrado en .env");
  process.exit(1);
}

const client = new Client({
  connectionString: normalizedUrl.toString(),
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const result = await client.query("select current_database(), current_user, now()");
  console.log(result.rows);
  await client.end();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await client.end();
  } catch {}
  process.exit(1);
});
