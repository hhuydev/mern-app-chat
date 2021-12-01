const generateMessage = (user, message) => {
    return {
        user,
        text: message,
        createdAt: new Date().getTime(),
    };
};

const generateFileMessage = (user, message) => {
    return {
        user,
        file: message,
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
    generateFileMessage,
};
