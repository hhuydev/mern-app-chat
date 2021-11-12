const req = require("supertest");
const app = require("../src/app");
const Conversation = require("../src/models/Conversation");
const {
  userOne,
  userTwo,
  setupDBTest,
  conversation,
} = require("./fixtures/dbTest");

beforeEach(setupDBTest);

test("Should create a new conversation", async () => {
  const res = await req(app)
    .post("/api/conversations/create-conversation")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Test create a new conversation" })
    .expect(201);
  const conver = await Conversation.findById(res.body.newConversation._id);
  expect(conver).not.toBeNull();
});

test("Should get list conversations", async () => {
  const res = await req(app)
    .get("/api/conversations/get-conversations")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(res.body.length).not.toEqual(0);
});
