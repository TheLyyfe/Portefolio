const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    password: {
        type: String,
        required: [true, 'Pas de prénom'],
    },
    // date:{
    //     type: Date
    // }

})

const LoginModel = mongoose.model('Login', loginSchema);

module.exports = LoginModel