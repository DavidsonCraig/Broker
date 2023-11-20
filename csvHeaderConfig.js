// Regex matching including synonyms for each header for input CSV (case insensistive, ignores underscores, regex check)
// [headerInSQLDatabase, regexPaternForMatching]
const csvHeaderConfig = [
  ["policy_ref", "((?=.*pol))((?=.*ref)|(?=.*id))"],

  ["coverage_amount", "((?=.*cover)|(?=.*insur))((?=.*amount)|(?=.*quant)|(?=.*qnt)|(?=.*amnt)|(?=.*sum))"],

  ["initiation_date", "((?=.*init)|(?=.*start)|(?=.*strt))((?=.*date)|(?=.*dte)|(?=.*time))"],

  ["expiration_date", "((?=.*exp)|(?=.*end)|(?=.*close)|(?=.*termination))((?=.*date)|(?=.*dte)|(?=.*time))"],

  ["admin_charges", "((?=.*admin)|(?=.*admn))((?=.*charge)|(?=.*chrge)|(?=.*cost)|(?=.*fee))"],

  ["consumer_id", "((?=.*consumer)|(?=.*client))((?=.*id)|(?=.*ref))"],

  ["broker_fee", "((?=.*broker))((?=.*fee)|(?=.*chrge)|(?=.*cost)|(?=.*pay))|(?=.*commission)"],

  ["tax_amount", "((?=.*IPT)|(?=.*tax))((?=.*amount)|(?=.*quant)|(?=.*qnt)|(?=.*amnt)|(?=.*sum))"],

  ["coverage_cost", "((?=.*cover)|(?=.*insure))((?=.*fee)|(?=.*chrge)|(?=.*cost)|(?=.*pay))|(?=.*premium)"],

  ["contract_fee", "((?=.*contract)|(?=.*policy))((?=.*fee)|(?=.*chrge)|(?=.*cost)|(?=.*pay))"],

  ["company", "((?=.*company)|(?=.*business))((?=.*info)|(?=.*description))"],

  ["contract_event", "((?=.*contract)|(?=.*business))((?=.*event)|(?=.*chrge)|(?=.*cost)|(?=.*pay))"],

  ["contract_category", "((?=.*contract)|(?=.*policy))((?=.*type)|(?=.*category))"],

  ["insurance_plan_type", "((?=.*insurance))((?=.*plan))|(?=.*product)"],

  ["consumer_category", "((?=.*consumer)|(?=.*client))((?=.*category)|(?=.*type))"],

  ["underwriter", "((?=.*underwriter)|(?=.*insurer))(?!.*policy)"],
];

module.exports = {
  csvHeaderConfig,
};
