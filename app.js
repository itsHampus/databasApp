// const { request } = require('express');
const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');
const session = require('express-session')
let bodyParser = require('body-parser');
const { request } = require('express');


app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', './views');

app.use(
    session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: true
    })
)

// Database connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',   //Porten i Mamp
    user: 'admin',
    password: 'password',
    database: 'express_demo'
});

app.get('/', (req, res) => {
    const data ={
        title: 'Welcome',
        style: 'color: red'
    }
    res.render('index', data);
    // res.sendFile(__dirname + '/views/html/index.html');
})
app.get('/api/getuser', (req, res) => {
    res.json('{"name": "Gustav"}');
})

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// När man loggat in
app.get('/logged-in', (req, res) => {
    if(req.session.authenticated){
        const data = {
            name: "Hampus",
            style: 'color: red'
        }
        res.render('logged-in', data)
    }else{
        res.redirect('/login');
    }
})

app.get('/login', (req, res) => {
    console.log(req.body);
    res.render('login');
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    connection.query(`SELECT * FROM users WHERE email='${email}' AND password='${password}'`, function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0){
            // res.send('found ' + results.length + ' users')
            req.session.authenticated = true;
            res.redirect('/logged-in');
        }else{
            res.send('found no users')
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})