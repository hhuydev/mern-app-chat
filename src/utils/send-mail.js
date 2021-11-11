// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// const sendWelcomeEmail = (email, name) => {
//   sgMail
//     .send({
//       to: email,
//       from: {
//         name: "Admin AloALo App Chat",
//         email: "aloaloappchat@gmail.com",
//       },
//       subject: `<h1>Chào mừng ${name} đến với AloAlo App Chat</h1>`,
//       text: `<h3>Xin chào ${name}, cảm ơn bạn đã đăng ký tài khoản chúc bạn có những trải nghiệm tuyệt vời tại AloAlo App Chat</h3>`,
//     })
//     .then(
//       () => console.log("Send mail success"),
//       (error) => {
//         console.error(error);

//         if (error.response) {
//           console.error(error.response.body);
//         }
//       }
//     );
// };

// const sendCancleEmail = (email, name) => {
//   sgMail
//     .send({
//       to: email,
//       from: {
//         name: "Admin AloALo App Chat",
//         email: "aloaloappchat@gmail.com",
//       },
//       subject: `<h1>Cảm ơn ${name} đã dùng ứng dụng AloAlo App Chat</h1>`,
//       text: `<h3>Rất tiếc khi ${name} không sử dụng ứng dụng nữa :(</h3>`,
//     })
//     .then(
//       () => console.log("Send mail success"),
//       (error) => {
//         console.error(error);

//         if (error.response) {
//           console.error(error.response.body);
//         }
//       }
//     );
// };
// module.exports = { sendWelcomeEmail, sendCancleEmail };

const AWS = require('aws-sdk');

const sesConfig = {
    accessKeyId: process.env.SES_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_AWS_SECRET_ACCESS_KEY,
    region: process.env.SES_REGION,
};
const sesAws = new AWS.SES(sesConfig);

const sendWelcomeEmail = (email, name) => {
    var params = {
        Destination: {
            ToAddresses: [
                email,
                /* more items */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: 'UTF-8',
                    Data: 'Chào mừng bạn tham gia AloAlo, chúc bạn có những trải nghiệm tuyệt vời trên ứng dụng chat của chúng tôi',
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'Chào mừng bạn tham gia AloAlo, chúc bạn có những trải nghiệm tuyệt vời trên ứng dụng chat của chúng tôi',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Đăng ký tài khoản thành công',
            },
        },
        Source: 'aloaloappchat@gmail.com' /* required */,
    };
    const sendPromise = sesAws.sendEmail(params).promise();
    sendPromise
        .then((data) => {
            console.log('Send mail success');
        })
        .catch((error) => {
            console.log(error);
        });
};

const sendCancleEmail = (email, name) => {
    var params = {
        Destination: {
            ToAddresses: [
                email,
                /* more items */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: 'UTF-8',
                    Data: 'Thật tiếc khi bạn không dùng ứng dụng AloAlo nữa, bất kỳ góp ý nào đến ứng dụng cũng đều quý giá đối với chúng tôi',
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'Thật tiếc khi bạn không dùng ứng dụng AloAlo nữa, bất kỳ góp ý nào dến ứng dụng cũng đều quý giá đối với chúng tôi',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Hủy tài khoản',
            },
        },
        Source: 'aloaloappchat@gmail.com' /* required */,
    };
    const sendPromise = sesAws.sendEmail(params).promise();
    sendPromise
        .then((data) => {
            console.log('Send mail success');
        })
        .catch((error) => {
            console.log(error);
        });
};

const sendVerifyEmail = (email, token) => {
    var params = {
        Destination: {
            ToAddresses: [
                email,
                /* more items */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Text: {
                    Charset: 'UTF-8',
                    Data: `Mã xác thực của bạn: ${token}`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Xác thực tài khoản',
            },
        },
        Source: 'aloaloappchat@gmail.com' /* required */,
    };
    const sendPromise = sesAws.sendEmail(params).promise();
    sendPromise
        .then((data) => {
            console.log('Send mail success');
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = { sendWelcomeEmail, sendCancleEmail, sendVerifyEmail };
