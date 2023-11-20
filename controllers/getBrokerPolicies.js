async function getBrokerPolicies(db, clientBrokerName) {
  return new Promise(async (resolve, reject) => {
    const exp = `%${clientBrokerName}%`;

    db.all("SELECT * FROM policy WHERE broker LIKE ?", [exp], (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
}

module.exports = {
  getBrokerPolicies,
};
