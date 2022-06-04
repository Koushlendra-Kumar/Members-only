const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: {type: String, required: true},
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date},
        messageText: {type: String}
    }
);

MessageSchema.virtual('url')
    .get(function() {
        return this._id;
    })

module.exports = mongoose.model('Message', MessageSchema);