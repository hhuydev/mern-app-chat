const mongoose = require('mongoose');

mongoose
    .connect(process.env.CONNECT_DB)
    .then(() => console.log('Connect DB success'))
    .catch((err) => console.log(err));
