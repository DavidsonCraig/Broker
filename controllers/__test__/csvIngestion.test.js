const { csvIngestion } = require("../csvIngestion");
const sqlite3 = require("sqlite3");
const testCsvPath = "./controllers/__test__/CSV/testBroker.csv";
let db;

describe("CSV ingestion mechanism", () => {
  beforeEach(async () => {
    try {
      await setUpTestDatabase();
    } catch (err) {
      console.error(err);
    }
  });

  afterEach(() => {
    db.close();
  });

  test("Ingest test CSV", async () => {
    await csvIngestion(testCsvPath, db).catch((err) => {
      console.error(err);
    });
  });

  test("Check rows of ingested CSV ", async () => {
    await csvIngestion(testCsvPath, db);
    const promise = await getSQL("SELECT COUNT(*) as value FROM policy");
    expect(promise).toBe(40);
  });

  describe("Check values of individual columns", () => {
    test.each([
      ["policy_ref", "'001'", 1],
      ["coverage_amount", "123456", 1],
      ["initiation_date", "'2023-01-15'", 1],
      ["expiration_date", "'2024-01-15'", 1],
      ["admin_charges", "100", 1],
      ["consumer_id", "'001'", 1],
      ["broker_fee", "0.07", 1],
      ["tax_amount", "180", 1],
      ["coverage_cost", "13000", 1],
      ["contract_fee", "100", 1],
      ["company", "'Business ABC'", 10],
      ["contract_event", "'New Business'", 14],
      ["contract_category", "'Health'", 12],
      ["insurance_plan_type", "'Auto Coverage'", 14],
      ["consumer_category", "'Individual'", 20],
      ["underwriter", "'ABC Insurance'", 10],
    ])(`Check`, async (column, val, expected) => {
      await csvIngestion(testCsvPath, db);
      const promise = await getSQL(`SELECT COUNT(*) AS value FROM policy WHERE ${column} = ${val}`);
      expect(promise).toBe(expected);
    });
  });
});

//Database Setup
async function initTestDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(":memory:", sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function inputHeadersTestDatabase() {
  return new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE policy (policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_ref TEXT, coverage_amount INTEGER, initiation_date DATE, expiration_date DATE, admin_charges INTEGER, consumer_id TEXT, broker_fee DECIMAL, tax_amount DECIMAL, coverage_cost INTEGER, contract_fee INTEGER, company TEXT, contract_event TEXT, contract_category TEXT, insurance_plan_type TEXT, consumer_category TEXT, underwriter TEXT, broker TEXT)",
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function setUpTestDatabase() {
  await initTestDatabase();
  await inputHeadersTestDatabase();
}

async function getSQL(sql) {
  return new Promise(async (resolve, reject) => {
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.value);
      }
    });
  });
}
