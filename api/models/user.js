const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    surname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(13), null);
}
UserSchema.methods.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports = mongoose.model('User', UserSchema);
