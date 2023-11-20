const supertest = require("supertest");
const app = require("../app");

describe("Express app endpoints", () => {
  test("Return index page", async () => {
    const response = await supertest(app).get("/");
    expect(response.status).toBe(200);
  });

  test("Return 404 page", async () => {
    const response = await supertest(app).get("/invalidAdress");
    expect(response.status).toBe(404);
  });

  test("Return basicInfo", async () => {
    const response = await supertest(app).get("/api/basicInfo");
    expect(response.status).toBe(200);
  });

  test("Return broker policies", async () => {
    const response = await supertest(app).post("/api/getBrokerPolicies");
    expect(response.status).toBe(200);
  });
});
