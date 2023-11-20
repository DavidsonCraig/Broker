const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const csvWatch = require("./controllers/csvWatch");
const { csvIngestion } = require("./controllers/csvIngestion");
const { initialiseDatabaseSchema } = require("./models/initialiseDatabaseSchema");
const { getBasicInfo } = require("./controllers/getBasicInfo");
const { getBrokerPolicies } = require("./controllers/getBrokerPolicies");

//Init express app
const app = express();

//Constants
const csvDirectory = "CSV";
let basicInfo = {};

//Set view engine
app.set("view engine", "ejs");

//Setup Database
const db = new sqlite3.Database(":memory:", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Conectected to database");
  }
});
initialiseDatabaseSchema(db);

//Start server
if (process.env.NODE_ENV !== "test") {
  const port = 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

//middleware
app.use(express.static("public"));
app.use(express.json());

//CSV watching
async function handleCsvAdded(path) {
  console.log(`Ingesting CSV: ${path}`);
  await csvIngestion(path, db).then(() => {
    getBasicInfo(db)
      .then((result) => {
        basicInfo = result;
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

if (process.env.NODE_ENV !== "test") {
  csvWatch.startCsvWatch(csvDirectory, handleCsvAdded);
}

//Routing
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/basicInfo", async (req, res) => {
  res.json(basicInfo);
});

app.post("/api/getBrokerPolicies", async (req, res) => {
  const clientBrokerName = req.body.brokerName;
  const resultPromise = getBrokerPolicies(db, clientBrokerName);
  const result = await resultPromise;
  res.json(result);
});

app.use((req, res) => {
  res.status(404).render("404");
});

module.exports = app;
