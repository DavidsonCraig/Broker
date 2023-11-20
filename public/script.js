fetch("http://localhost:3000/api/basicInfo")
  .then((response) => {
    if (!response.ok) {
      console.error("Failed network response");
    }
    return response.json();
  })
  .then((data) => {
    updateBasicInfoText(data);
  })
  .catch((err) => {
    console.error(err);
  });

document.getElementById("brokerNameForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const input = document.querySelector("#brokerName").value;
  const brokerName = { brokerName: input };

  fetch("http://localhost:3000/api/getBrokerPolicies", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brokerName),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("HTTP error");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const table = new Tabulator("#table", {
        data: data,
        autoColumns: true,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

function updateBasicInfoText(data) {
  let customers = document.querySelector(".customers");
  let policies = document.querySelector(".policies");
  let sumCoverage = document.querySelector(".sumCoverage");
  let averageActivePolicyLength = document.querySelector(".averageActivePolicyLength");

  customers.textContent = `Number of Customers: ${data.customers}`;
  policies.textContent = `Number of policies: ${data.policies}`;
  sumCoverage.textContent = `Sum of coverage: £${data.sumCoverage}`;
  averageActivePolicyLength.textContent = `Average length of active policy: ${Math.floor(data.averageActivePolicyLength)} days`;
}
