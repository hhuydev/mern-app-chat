const generateMessage = (username, message) => {
  return {
    username,
    text: message,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username, url) => {
  return {
    username,
    location: url,
    createdAt: new Date().getTime(),
  };
};

const welcomeMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage,
  welcomeMessage,
};
