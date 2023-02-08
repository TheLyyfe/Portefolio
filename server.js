const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const projectRouter = require('./routes/projectRouter.js')
const userRouter = require('./routes/loginRouter.js')
require('dotenv').config()


const db = process.env.BDD_URL
const app = express()

app.use(express.static('./assets'));
app.use(session({secret: "TONMDP",saveUninitialized: true,resave: true}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(projectRouter)
app.use(userRouter)

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Je suis connecté');
    }
})

mongoose.set('strictQuery', true);
mongoose.connect(db, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connecter a la bdd");
    }
})













