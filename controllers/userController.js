const User = require('../models/user');
const async = require('async');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {body, validationResult} = require('express-validator');

exports.user_sign_up_get = function( req, res, next) {
    res.render('sign-up-form', {user: req.user});
};

exports.user_sign_up_post = [
    body('first_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('First name required')
        .isAlphanumeric(),
    body('last_name')
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage('Last name required')
        .isAlphanumeric(),
    body('username')
        .optional({checkFalsy: true})
        .trim()
        .escape()
        .isLength({min: 1}),
    body('password')
        .exists(),
    body('confirm-password')
        .exists()
        .custom((value, {req}) => {
            if(req.body.password=== value){
                return true;
            }
            
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err) throw err;
            let user = new User(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword,
                membership_status: false,
                isAdmin: false
            }
            );
            if(!errors.isEmpty()) {
                res.render('sign-up-form', {user: req.user, errors: errors.array()})
            } else {
                user.save(function (err) {
                    if(err) throw err;
                    res.redirect('/users/login')
                })
            }
        });
    }       
];

exports.join_get = function(req, res, next) {
    if(req.user.membership_status){
        res.redirect('/');
    }
    res.render('join', {user: req.user});
};

exports.join_post = function(req, res, next) {
    if(req.body.passcode == 'topclub'){
        let user = new User(
                {
                    membership_status: true,
                    _id: req.user.url,
                }
            );
        User.findByIdAndUpdate(req.user.url, user, {}, (err, theuser)=> {
            if(err ) throw err;
        });
        res.redirect('/');
    }else {
        res.redirect('/users/join');
    }
    
};

exports.admin_get = function(req, res,next) {
    if(req.user.isAdmin){
        res.redirect('/')
    } else {
        res.render('admin', {user: req.user});
    }
    
};

exports.admin_post = function(req, res, next) {
    if(req.body['admin-passcode'] == 'topadmin'){
        let user = new User(
            {
                _id: req.user.url,
                isAdmin: true
            }
        )
        User.findByIdAndUpdate(req.user.url, user, {}, (err, theuser) => {
            if(err) throw err;
        });
        res.redirect('/');
    } else {
        res.render('admin', {user: req.user, errmsg: 'Give it another shot!'});
    }
}

exports.login_get = function( req, res, next) {
    res.render('login-form', {user: req.user});
};

exports.login_post = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    });

exports.logout = function(req, res, next) {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        
        res.redirect("/");
        console.log('logged out')
      });
};

