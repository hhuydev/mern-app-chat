const req = require("supertest");
const app = require("../src/app");
const Conversation = require("../src/models/Conversation");
const {
  userOne,
  userTwo,
  setupDBTest,
  conversation,
} = require("./fixtures/dbTest");

test("Should update valid user fields", async () => {
  await req(app)
    .patch("/api/conversations/get-conversations")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  //   const user = await User.findById(userOne._id);
  //   const conversations = await Conversation.find({});
  //   const findIndexUser = conversations.findIndex(
  //     (conver, i) => conver.members[i] === user._id
  //   );
  //   if (findIndexUser !== -1) expect();
  //   expect(findIndexUser).not(-1);
});
