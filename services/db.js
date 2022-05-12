// import mongoose
const mongoose=require('mongoose')

// connect db
mongoose.connect('mongodb://localhost:27017/bankServer',{
    useNewUrlParser:true
})

// create model
const User=mongoose.model('User',{
    acno: Number, 
    uname: String, 
    password: String, 
    balance: Number,
    transaction:[] 
})

module.exports={
    User
}