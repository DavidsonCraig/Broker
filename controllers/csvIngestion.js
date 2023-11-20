const fs = require("fs");
const readline = require("readline");
const { csvHeaderConfig } = require("../csvHeaderConfig");
const moment = require("moment");

async function csvIngestion(path, db) {
  return new Promise(async (resolve, reject) => {
    const header = await getHeaders(path);
    const headerOrder = getHeaderOrder(header);
    let broker = getBroker(path);
    csvToDatabase(path, headerOrder, db, broker).then(() => {
      resolve();
    });
  });
}

function getHeaderOrder(header) {
  let headerOrder = Array(csvHeaderConfig.length).fill(null);
  for (let i = 0; i < csvHeaderConfig.length; i++) {
    SQLheader = csvHeaderConfig[i][0];
    for (let j = 0; j < header.length; j++) {
      let reg = new RegExp(csvHeaderConfig[i][1], "gi");
      if (reg.test(header[j]) && !headerOrder.includes(j)) {
        headerOrder[i] = j;
        break;
      }
    }
  }
  return headerOrder;
}

async function getHeaders(path) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path);
    let headerArr = [];
    readline
      .createInterface({ input: stream, crlfDelay: Infinity })
      .once("line", (header) => {
        headerArr = header.split(",");
      })
      .on("close", () => {
        resolve(headerArr);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function csvToDatabase(path, headerOrder, db, broker) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path);
    let isHeader = true;
    readline
      .createInterface({ input: stream, crlfDelay: Infinity })
      .on("line", (line) => {
        if (!isHeader) {
          lineArr = line.split(",");
          db.run(
            "INSERT INTO policy (policy_ref, coverage_amount, initiation_date, expiration_date, admin_charges, consumer_id, broker_fee, tax_amount, coverage_cost, contract_fee, company, contract_event, contract_category, insurance_plan_type, consumer_category, underwriter, broker) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              extractNumbers(lineArr[headerOrder[0]]),
              lineArr[headerOrder[1]],
              moment(lineArr[headerOrder[2]].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"),
              moment(lineArr[headerOrder[3]].replace(/\//g, "-"), "DD-MM-YYYY").format("YYYY-MM-DD"),
              lineArr[headerOrder[4]],
              extractNumbers(lineArr[headerOrder[5]]),
              lineArr[headerOrder[6]],
              lineArr[headerOrder[7]],
              lineArr[headerOrder[8]],
              lineArr[headerOrder[9]],
              lineArr[headerOrder[10]],
              lineArr[headerOrder[11]],
              lineArr[headerOrder[12]],
              lineArr[headerOrder[13]],
              lineArr[headerOrder[14]],
              lineArr[headerOrder[15]],
              broker,
            ],
            function (err) {
              if (err) {
                console.error(err);
              }
            }
          );
        }
        isHeader = false;
      })
      .on("close", () => {
        console.log(`Ingested CSV: ${path}`);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function extractNumbers(string) {
  const matches = string.match(/\d/g);
  return matches ? matches.join("") : null;
}

function getBroker(path) {
  const split = path.split("\\");
  return split[split.length - 1].substring(0, split[split.length - 1].length - 4);
}

module.exports = {
  csvIngestion,
};
