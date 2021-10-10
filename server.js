require("dotenv").config({ path: ".env" });

const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./config/db");
const customErrorHandler = require("./middlewares/customErrorHandler");

app.use(express.json());

// connect db
connectDB();

// routes
app.get("/", (req, res, next) => {
  res.send("home");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// error handler
app.use(customErrorHandler);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// server setup
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`connected at ${PORT}`);
});

// handle unhandled error close process
process.on("unhandledRejection", (err, promise) => {
  console.log(`Erro: ${err}`);
  server.close(() => process.exit(1));
});
