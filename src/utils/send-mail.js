const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: {
        name: "Admin AloALo App Chat",
        email: "aloaloappchat@gmail.com",
      },
      subject: `<h1>Chào mừng ${name} đến với AloAlo App Chat</h1>`,
      text: `<h3>Xin chào ${name}, cảm ơn bạn đã đăng ký tài khoản chúc bạn có những trải nghiệm tuyệt vời tại AloAlo App Chat</h3>`,
    })
    .then(
      () => console.log("Send mail success"),
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
};

const sendCancleEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: {
        name: "Admin AloALo App Chat",
        email: "aloaloappchat@gmail.com",
      },
      subject: `<h1>Cảm ơn ${name} đã dùng ứng dụng AloAlo App Chat</h1>`,
      text: `<h3>Rất tiếc khi ${name} không sử dụng ứng dụng nữa :(</h3>`,
    })
    .then(
      () => console.log("Send mail success"),
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
};
module.exports = { sendWelcomeEmail, sendCancleEmail };
