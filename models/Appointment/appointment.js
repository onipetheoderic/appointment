var mongoose = require('mongoose');
var AppointmentSchema = new mongoose.Schema({
    title: String,
    subject_matter: String,
    date: Date,
    start: String,
    end: String,
    venue: String,
    className: String,
    cancelled: {type:Boolean, default:false},
    className2:String,
    isTable: {type:Boolean, default:false},
   
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
