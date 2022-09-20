

//jsonwebtoken import
const jwt = require('jsonwebtoken')

// import db.js
const db = require('./db')

//database
database = {
  1000: { acno: 1000, username: "Arjun", password: 1000, balance: 5000, transaction: [] },
  1002: { acno: 1002, username: "Anand", password: 1002, balance: 6000, transaction: [] },
  1003: { acno: 1003, username: "Pranav", password: 1003, balance: 7000, transaction: [] }
}



//register

const register = (username, acno, password) => {
  //asynchronous
  return db.User.findOne({
    acno
  }).then(result => {
    if (result) {
      return {
        statusCode: 404,
        status: false,
        message: 'User already exist !!! Please log in'
      }
    }
    else {
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        statusCode: 200,
        status: true,
        message: 'Registered Successfully'
      }
    }
  })
}

///login
const login = (acno, pswd) => {
  //search acno,pswd in mongodb
  return db.User.findOne({
    acno,
    password: pswd
  }).then(result => {
    if (result) {
      currentUser = result.username
      currentAcno = acno

      //token generation - sign()  :-its a method
      const token = jwt.sign({
        currentAcno: acno
      }, 'super12345')

      return {
        statusCode: 200,
        status: true,
        message: 'Login Successfully',
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        statusCode: 404,
        status: false,
        message: 'Incorrect account number or password'
      }
    }
  })
}

// deposit 
const deposit = (acno, pswd, amt) => {
  const amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(result => {
    if (result) {
      result.balance += amount
      result.transaction.push({
        type: 'CREDIT',
        amount
      })
      result.save()
      return {
        statusCode: 200,
        status: true,
        message: `${amount} deposited successfully and new balance is ${result.balance}`
      }
    }
    else {
      return {
        statusCode: 404,
        status: false,
        message: 'Incorrect account number or password'
      }
    }
  })
}

/// withdraw
const withdraw = (acno, pswd, amt) => {
  const amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(result => {
    if (result) {
      if (result.balance > amount) {
        result.balance -= amount
        result.transaction.push({
          type: 'DEBIT',
          amount
        })

        result.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amount} debitted successfully and new balance is ${result.balance}`
        }
      }
      else {
        return {
          statusCode: 404,
          status: false,
          message: 'Insufficient Balance'
        }
      }
    }

    else {
      return {
        statusCode: 404,
        status: false,
        message: 'Incorrect account number or password'
      }
    }
  })
}
//transaction
const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(result => {
    if (result) {
      return {
        statusCode: 200,
        status: true,
        transaction: result.transaction
      }
    }
    else {
      return {
        statusCode: 404,
        status: false,
        message: 'User does not exist'
      }
    }
  })
}

//delete
const deleteAccount = (acno)=>{
  return db.User.deleteOne({
    acno
  }).then(result=>{
    if(result){
      return{
        statusCode: 200,
        status:true,
        message:"Account Deleted Successfully"
      }
    }
    else{
      return{
        statusCode: 404,
        status:false,
        message:"Account Does Not Exist"
      }
    }
  })
}

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAccount
}
