const express = require('express');
const router = express.Router();
const wrapAsync = require('../utlils/wrapAsync');
const passport = require('passport');
const User = require('../models/user');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/users.js');


// Sign Up Page Route and Create Route using router.route ↓
// router
//  .get("/signup",userController.renderSignupForm);


//  router.post("/signup",wrapAsync(userController.signup));


 router
 .route("/signup")
 .get( userController.renderSignupForm)
 .post( wrapAsync( userController.signup ));



 //login

//  router.get("/login", userController.renderLoginForm);
//  router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//         {failureRedirect:"/login",
//             failureFlash:true}),userController.login
// );



// Log In Page Route and Post Route using router.route ↓
router
 .route("/login")
 .get( userController.renderLoginForm )
 .post( saveRedirectUrl, passport.authenticate('local',
      { failureRedirect: '/login', failureFlash : true} ),  // Authenticate Middleware
        userController.login
    );


//Log Out Get Route ↓
//router.get("/logout", userController.logout);

router.get("/logout",userController.logout);

module.exports = router;