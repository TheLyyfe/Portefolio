const express = require("express");
const LoginModel = require('../models/login.js')
const crypto = require('../customDependances/crypto')
const loginRouter = express.Router()

loginRouter.get('/users', async (req, res) => {
    try {
        let users = await LoginModel.find();
        res.render('inutile.twig', {
            users: users
        })
    } catch (err) {
        res.send(err);
    }
})

loginRouter.get('/deleteUser/:id', async (req, res) => {
    try {
        await LoginModel.deleteOne({ _id: req.params.id });
        res.redirect('/users')
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

loginRouter.get('/addUser', async (req, res) => {
    try {
        res.render('useless.twig')
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

loginRouter.post('/addUser', async (req, res) => {
    console.log(req.body);
    try {
        req.body.password = await crypto.cryptPassword(req.body.password)
        let user = new LoginModel(req.body)
        user.save()
        res.redirect('/users')
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

loginRouter.get('/updateUser/:id', async (req, res) => {
    try {
        res.render('updateuserform.twig', {
            userid: req.params.id
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

loginRouter.post('/updateUser/:id', async (req, res) => {
    console.log(req.body);
    try {
        await LoginModel.updateOne({ _id: req.params.id }, req.body)
        res.redirect('/users')
    } catch (err) {
        console.log(err);
        res.send(err);
    }
})




module.exports = loginRouter