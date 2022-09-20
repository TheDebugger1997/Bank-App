//import express
const express = require('express')

//import data service
const dataService = require('./services/data.sevice')

//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import cors
const cors = require('cors')

//using express create server app
const app = express()

//use cors to specify origin
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())



// http request
//get - to read data or fetch data from server
app.get('/', (req, res) => {
    res.send('GET METHOD')
})

//post - server create
app.post('/', (req, res) => {
    res.send('POST METHOD')
})

//put - modify
app.put('/', (req, res) => {
    res.put('PUT METHOD')
})

//patch - partially modify
app.patch('/', (req, res) => {
    res.path('PATCH METHOD')
})

//delete - delete
app.delete('/', (req, res) => {
    res.delete('DELETE METHOD')
})

//bank app

//router specific middleware
const jwtMiddleware = (req, res, next) => {
    console.log('Inside jwtMiddleware');
    //to fetch token
    const token = req.headers['x-access-token']
    //verify token - verify()
    try {
        const data = jwt.verify(token, 'super12345')
        console.log(data);
        next()
    }
    catch {
        res.status(404).json({
            statusCode: 404,
            status: true,
            message: 'Please Log In'
        })
    }
}

//http response status
//1xx - information
//2xx - success
//3xx - redirection
//4xx - client error
//5xx - server error

//register API
app.post('/register', (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.register(req.body.username, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
//login API
app.post('/login', (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})
//deposit API
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.withdraw(req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.getTransaction(req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//deleteAcc API
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAccount(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

//set port number inorder to run the applicaion
app.listen(3000, () => {
    console.log('Server started at 3000');
})