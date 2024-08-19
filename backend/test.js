const { Client } = require("pg");

const connectionString = "postgresql://admin:admin@localhost:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database");
    client.end();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });
