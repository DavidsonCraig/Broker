const sqlite3 = require("sqlite3");
const { getBasicInfo } = require("../getBasicInfo");
const { csvIngestion } = require("../csvIngestion");
const testCsvPath = "./controllers/__test__/CSV/testBroker.csv";
let db;

describe("Should return correct basic info from test database", () => {
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

  test("Return correct number of policies", async () => {
    const result = await getBasicInfo(db);
    expect(result.policies).toBe(40);
  });

  test("Return correct number of customers", async () => {
    const result = await getBasicInfo(db);
    expect(result.customers).toBe(37);
  });

  test("Return correct sum of coverage", async () => {
    const result = await getBasicInfo(db);
    expect(result.sumCoverage).toBe(30033456);
  });

  test("Return correct average active policy length", async () => {
    const result = await getBasicInfo(db);
    result.averageActivePolicyLength = Math.floor(result.averageActivePolicyLength);
    expect(result.averageActivePolicyLength).toBe(365);
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
  await csvIngestion(testCsvPath, db);
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
