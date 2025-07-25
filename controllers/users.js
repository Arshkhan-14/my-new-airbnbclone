const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");

 };

module.exports.signup = async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){

            return next(err);
        }

        req.flash("success","user was registered");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
    }
 };

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
 }

module.exports.login =  async (req,res)=>{


     req.flash("success","welcometo wanderLust! you are logged in");
     let redirectUrl=res.locals.redirectUrl|| "/listings";
     res.redirect(redirectUrl);
    
 }

module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}