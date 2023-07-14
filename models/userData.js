const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

}, { timeseries: true, });

const UserData = mongoose.model('UserData', userSchema);
module.exports = UserData;
