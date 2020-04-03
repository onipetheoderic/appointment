var mongoose = require('mongoose');
var ParticipantSchema = new mongoose.Schema({
    name: String,
    position: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Participant', ParticipantSchema);
