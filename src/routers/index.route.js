const user = require("./user.route");
const conversation = require("./conversation.route");
const message = require("./message.route");
const friends = require("./friends.route");
const admin = require("./admin.route");

const route = (app) => {
  app.use("/api/users", user);
  app.use("/api/conversations", conversation);
  app.use("/api/messages", message);
  app.use("/api/friends", friends);
  app.use("/api/admin", admin);
};
module.exports = route;
