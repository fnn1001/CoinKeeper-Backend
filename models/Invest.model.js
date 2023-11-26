const mongoose = require('mongoose');

const investSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true,
    },
    Coin: {
        type: String,
        default: '',
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: ''
    },
    });

const Invest = mongoose.model('Invest', investSchema);

module.exports = Invest;