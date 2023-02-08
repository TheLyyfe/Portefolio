const LoginModel = require("../models/login")


let routeGuard = async (req,res,next)=> {
    let user = await LoginModel.findOne({_id:req.session.userId})
    if (user) {
        next()
    } else{
        res.redirect('/projects')
    }
}

module.exports = routeGuard  