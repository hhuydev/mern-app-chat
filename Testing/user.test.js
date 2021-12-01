const req = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { userOne, userTwo, setupDBTest } = require("./fixtures/dbTest");

beforeEach(setupDBTest);

test("Should create user and return status 201", async () => {
  const res = await req(app)
    .post("/api/users/signup")
    .send({
      username: "huy",
      email: "huylatao211199@gmail.com",
      password: "999999999",
    })
    .expect(201);
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();
  /**Đảm bảo password dc mã hóa khi dc lưu trong db*/
  expect(user.password).not.toBe("999999999");
});

test("Should login existing user and return status 200", async () => {
  const res = await req(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findOne({ email: userOne.email });
  expect(user).not.toBeNull();
});

test("Should not login unexisting user and return status 404", async () => {
  await req(app)
    .post("/api/users/login")
    .send({
      email: "abc@gmail.com",
      password: "123456aa",
    })
    .expect(404);
});

test("Should get profile by authenticated user", async () => {
  await req(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await req(app).get("/api/users/me").send().expect(401);
});

test("Should delete user by authenticated user", async () => {
  const res = await req(app)
    .delete("/api/users/me/delete")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should update valid user fields", async () => {
  await req(app)
    .patch("/api/users/me/update")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ username: "ghuy" })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user.username).toEqual("ghuy");
});

// test("Should delete user avatar", async () => {
//   await req(app)
//     .delete("/api/users/me/delete-avatar")
//     .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
//     .send()
//     .expect(200);
// });

test("Should upload user avatar", async () => {
  await req(app)
    .post("/api/users/me/upload-avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "Testing/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOne._id);
  /**So sánh reference type trong jest */
  // expect({}).toEqual({});

  expect(user.avatar).toEqual(expect.any(String));
});
