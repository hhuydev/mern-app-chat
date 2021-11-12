const req = require("supertest");
const app = require("../src/app");
const Friend = require("../src/models/Friends");
const {
  userOne,
  userTwo,
  setupDBTest,
  conversation,
} = require("./fixtures/dbTest");

beforeEach(setupDBTest);

test("Should get list friend request", async () => {
  const res = await req(app)
    .get("/api/friends/get-list-friend-request")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should get list friend", async () => {
  const res = await req(app)
    .get("/api/friends/get-my-list-friend")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should send send friend request success", async () => {
  const res = await req(app)
    .post("/api/friends/friend-request")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ email: "trang@gmail.com" })
    .expect(201);
});

test("Should send send friend request success", async () => {
  const res = await req(app)
    .post("/api/friends/friend-request")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ email: "trang@gmail.com" })
    .expect(201);
});

test("Should accept friend request", async () => {
  const res = await req(app)
    .post("/api/friends/accept-friend-request")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({ email: "phu@gmail.com" })
    .expect(200);
});
