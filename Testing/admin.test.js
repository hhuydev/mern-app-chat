const req = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { userThree, setupDBTest } = require("./fixtures/dbTest");

beforeEach(setupDBTest);

test("Should get list users", async () => {
  const res = await req(app)
    .get("/api/admin/getAllUser")
    .set("Authorization", `Bearer ${userThree.tokens[0].token}`)
    .send()
    .expect(200);
});
