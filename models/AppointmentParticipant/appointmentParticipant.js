var mongoose = require('mongoose');
var AppointmentParticipantSchema = new mongoose.Schema({
    participant:[{//this is the user that created the Subcategory
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
    }],
    appointment:[{//this is the user that created the Subcategory
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    participant_id:String,//for faster queries
    start:String,
    end:String,
    date:Date,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('AppointmentParticipant', AppointmentParticipantSchema);
