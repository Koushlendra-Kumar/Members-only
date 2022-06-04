const Message = require('../models/messages');

exports.messages = function(req, res, next) {
    Message.find({})
        .sort([['timestamp', 'descending']])
        .populate('author','username')
        .exec(function(err, msgs) {
            if(err) throw err;
            res.render('index', {user: req.user, msgs: msgs})
        });
};