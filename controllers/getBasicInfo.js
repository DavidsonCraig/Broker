async function getBasicInfo(db) {
  const policiesPromise = getNumberOfPolicies(db);
  const customersPromise = getNumberOfCustomers(db);
  const sumCoveragePromise = getSumOfCoverage(db);
  const averageActivePolicyLengthPromise = getAverageActivePolicyLength(db);

  const policies = await policiesPromise;
  const customers = await customersPromise;
  const sumCoverage = await sumCoveragePromise;
  const averageActivePolicyLength = await averageActivePolicyLengthPromise;

  const result = {
    policies,
    customers,
    sumCoverage,
    averageActivePolicyLength,
  };

  return result;
}

async function getNumberOfPolicies(db) {
  return new Promise(async (resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM policy", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

async function getNumberOfCustomers(db) {
  return new Promise(async (resolve, reject) => {
    db.get("SELECT COUNT(DISTINCT consumer_id) as count FROM policy", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

async function getSumOfCoverage(db) {
  return new Promise(async (resolve, reject) => {
    db.get("SELECT SUM(coverage_amount) as sum FROM policy", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.sum);
      }
    });
  });
}

async function getAverageActivePolicyLength(db) {
  return new Promise(async (resolve, reject) => {
    db.get("SELECT AVG(julianday(expiration_date) - julianday(initiation_date)) AS average FROM policy WHERE expiration_date IS NOT NULL AND initiation_date IS NOT NULL", [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.average);
      }
    });
  });
}

module.exports = {
  getBasicInfo,
};
