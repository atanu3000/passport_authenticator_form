const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isLocalUser: {
            type: Boolean,
            default: true, // Set to true for local users by default
        },
    },
    { timestamps: true, }
);

const UserData = mongoose.model('UserInfo', userSchema);
module.exports = UserData;