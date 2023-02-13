const express = require("express");
const ProjectModel = require('../models/project.js')
const LoginModel = require('../models/login.js')
const upload = require('../services/multer')
const routeGuard = require('../customDependances/authGuard')
const crypto = require('../customDependances/crypto')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "fonsat.nodemailer@gmail.com",
      pass: "dlclhbrybfcawlgi@",
   },
});


const projectRouter = express.Router()

projectRouter.get('/projects', async (req, res) => {
   try {
      let mailerror = req.session.mailerror;
      req.session.mailerror = ''
      let projects = await ProjectModel.find();
      res.render('cv.twig', {
         projects: projects,
         mailerror: mailerror,
         user: req.session.userId,
      })
   } catch (err) {
      res.send(err);
   }
})

projectRouter.get('/deleteProject/:id', async (req, res) => {
   try {
      await ProjectModel.deleteOne({ _id: req.params.id });
      res.redirect('/projects')
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})

projectRouter.get('/addProject', routeGuard, async (req, res) => {
   try {
      res.render('addproject.twig')
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})

projectRouter.post('/addProject', upload.single("img"), async (req, res) => {
   console.log(req.body);
   try {
      req.body.img = req.file.filename
      let project = new ProjectModel(req.body)
      await project.save()
      res.redirect('/projects')
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})

projectRouter.get('/updateProject/:id', async (req, res) => {
   try {
      res.render('updateproject.twig', {
         projectid: req.params.id
      })
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})

projectRouter.post('/updateProject/:id', async (req, res) => {
   console.log(req.body);
   try {
      await ProjectModel.updateOne({ _id: req.params.id }, req.body)
      res.redirect('/projects')
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})

projectRouter.get('/login', async (req, res) => {
   try {
      res.render('login.twig')
   } catch (err) {
      console.log(err);
      res.send(err);
   }
})


// projectRouter.post('/login', async (req, res) =>{
//    try{
//    let user = await LoginModel.findOne({name: req.body.name, password: req.body.password})
//    if (user) {
//       req.session.userId = user._id
//       res.redirect('/addProject')
//    }else{

//       res.send('bonsoir non')
//    }
//    } catch (err) {
//       res.send(err);
//    }

// })

projectRouter.post('/connected', async (req, res) => {
   try {
      let user = await LoginModel.findOne({ login: req.body.login })
      if (user) {
         if (await crypto.comparePassword(req.body.password, user.password)) {
            req.session.userId = user._id
            res.redirect('/addProject')
         } else {
            throw "Bonsoir non"
         }
      } else {
         throw "Id not found"
      }
   } catch (err) {

      req.session.error = err
      console.log(err);
      res.redirect("/projects")


   }
})

projectRouter.post("/sendmail", async (req, res) => {
   try {


      let info = await transporter.sendMail({
         from: req.body.mail, // sender address
         to: "nicolas.jobinzogo@gmail.com", // list of receivers
         subject: "Contact Professionnel", // Subject line
         html: `<p>${req.body.name}</p><p>${req.body.firstname}</p><p>${req.body.mail}</p><p>${req.body.message}</p>` // html body
   });
res.redirect("/projects")
} catch (error) {
   console.log(error);
   req.session.mailerror = "Mail not sent"
   res.redirect("/projects")
}
})

projectRouter.get('/logout', async (req, res) => {
   req.session.destroy();
   res.redirect('/projects')
})

module.exports = projectRouter
