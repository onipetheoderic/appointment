var mongoose = require('mongoose');
var CategorySchema = new mongoose.Schema({
    name: String,
    color: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Category', CategorySchema);
