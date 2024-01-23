const mongoose = require('mongoose')

//schema design 

const userShema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']

    },

    email:{
        type: String,
        required :[true, 'email is required and should be unique'],
        unique : true
    },

    password:{
        type:String,
        required: [true,'password is required']
    }

}, 

{timestamps:true}
);

//export

const userModel = mongoose.model('user', userShema)
module.exports = userModel