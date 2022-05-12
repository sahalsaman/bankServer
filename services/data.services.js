// import jwt
const jwt = require("jsonwebtoken")

const db = require('./db')

dataBase = {
  1001: { acno: 1001, uname: "sahal", password: 1001, balance: 10000, transaction: [] },
  1002: { acno: 1002, uname: "mubi", password: 1002, balance: 5000, transaction: [] },
  1003: { acno: 1003, uname: "siyad", password: 1003, balance: 7000, transaction: [] }
}

const register = (uname, acno, password) => {

  return db.User.findOne({ acno }).then(
    user => {
      if (user) {
        //  existing user
        return {
          statusCode: 401,
          status: false,
          messege: "already created!!"
        }
      } else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          messege: "successfully created.."
        }
      }
    }
  )

}

const login = (acno, pswd) => {
  return db.User.findOne({ acno, password: pswd }).then(user => {
    if (user) {
      currentUser = user.uname
      currentacno = acno
      const token = jwt.sign({
        currentacno: acno,
      }, "topsecret369258147key")
      return {
        statusCode: 200,
        status: true,
        messege: "login Successfully",
        token,
        currentacno,
        currentUser
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        messege: "invalid credentiol"
      }
    }
  })
}

const deposit = (req, acno, pswd, amt) => {
  let amount = parseInt(amt)

  return db.User.findOne({ acno, password: pswd }).then(
    user => {
      if (req.currentacno != acno) {
        return {
          statusCode: 401,
          status: false,
          messege: "operation denied"
        }
      }
      if (user) {
        user.balance += amount
        user.transaction.push({
          type: "CREDIT",
          amount: amount
        })
        user.save()
        // database[acno]["balance"]
        return {
          statusCode: 200,
          status: true,
          messege: amount + " successfully deposited, current balance " + user.balance
        }
      } else {
        return {
          statusCode: 401,
          stats: false,
          messege: "invalid credentiol"
        }
      }
    })
}

const withdraw = (req, acno, pswd, amt) => {
  let amount = parseInt(amt)
  return db.User.findOne({ acno, password: pswd }).then(user => {
    if (req.currentacno != acno) {
      return {
        statusCode: 401,
        status: false,
        messege: "operation denied"
      }
    }
    if (user) {
      if (amount < user.balance) {
        user.balance -= amount
        user.transaction.push({
          type: "DEBIT",
          amount: amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          messege: amount + " rupee withdrawed, current balance " + user.balance
        }
      } else {
        return {
          statusCode: 422,
          status: false,
          messege: "insuffisient balance"
        }
      }

    } else {
      return {
        statusCode: 401,
        status: false,
        messege: "invalid credentiol"
      }
    }
  })

}

const transaction = (req,acno) => {
  return db.User.findOne({ acno }).then
    (user => {
      if (req.currentacno != acno) {
        return {
          statusCode: 401,
          status: false,
          messege: "operation denied"
        }
      }
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user.transaction
        }
      } else {
        return {
          statusCode: 401,
          status: false,
          messege: "invalid credentiol"
        }
      }
    })
}

const onDelete=(acno)=>{
  return db.User.deleteOne({acno}).then(
    result=>{
      if(!acno){
        return{
          statusCode: 401,
          status: false,
          messege: "invalid credentiol"
        }
      }else{
        return {
          statusCode: 200,
          status: true,
          messege: "account number "+acno+" successfully deleted"
        }
      }
    }
  )
}



module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  onDelete
}