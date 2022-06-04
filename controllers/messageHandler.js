const {body, validationResult, check} = require('express-validator');
const Message = require('../models/messages');

exports.new_message_get = function( req, res, next) {
    res.render('new-message-form', {user: req.user})
};

exports.new_message_post = [
    body('title')
        .isLength({min: 1, max: 100})
        .trim()
        .escape(),
    body('message-text')
        .isLength({min: 1}),
    
    (req, res, next) => {
        const errors = validationResult(req);
        
        let message = new Message(
            {
                title: req.body.title,
                author: req.user.url,
                timestamp: new Date(),
                messageText: req.body['message-text']
            }
        )
            
        if(!errors.isEmpty()) {
            res.render('new-message-form', {user: req.user, errors: errors.array()})
        } else {
            message.save(function (err) {
                if(err ) throw err;
                res.redirect('/');
            })
        }
    }

];


exports.delete_post = function(req, res, next) {
    Message.findByIdAndDelete(req.params.id)
        .exec((err, results) => {
            if(err) throw err;
            res.redirect('/')
        })
};