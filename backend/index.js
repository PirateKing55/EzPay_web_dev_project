const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", rootRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the EzPay API");
});

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    message: "Page Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    message: "Internal Server Error",
  });
});

app.listen(port, function (err) {
  if (err) console.log(err);
  console.log(`Server listening on Port ${port}`);
});
