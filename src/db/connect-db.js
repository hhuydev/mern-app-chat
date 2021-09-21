const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.CONNECT_DB);
        console.log('Connect DB successfully!!!');
    } catch (error) {
        console.log('Connect DB failure!!!');
    }
}
module.exports = { connect };
