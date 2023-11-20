function initialiseDatabaseSchema(db) {
  db.serialize(() => {
    db.run(
      "CREATE TABLE policy (policy_id INTEGER PRIMARY KEY AUTOINCREMENT, policy_ref TEXT, coverage_amount INTEGER, initiation_date DATE, expiration_date DATE, admin_charges INTEGER, consumer_id TEXT, broker_fee DECIMAL, tax_amount DECIMAL, coverage_cost INTEGER, contract_fee INTEGER, company TEXT, contract_event TEXT, contract_category TEXT, insurance_plan_type TEXT, consumer_category TEXT, underwriter TEXT, broker TEXT)"
    );
  });
}

module.exports = {
  initialiseDatabaseSchema,
};
