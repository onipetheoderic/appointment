import {encrypt, decrypt, BASEURL} from '../../utility/encryptor'
import Appointment from '../../models/Appointment/appointment';
import Participant from '../../models/Participant/participant';
import AppointmentParticipant from '../../models/AppointmentParticipant/appointmentParticipant';
import Category from '../../models/Category/category';
import { start } from 'pretty-error';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'onipetheoderic@gmail.com',
    pass: 't1t2t3t4'
  }
}));



var rn = require('random-number');
var options = {
  min:  1000
, integer: true
}

//sub_category

const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name;
    
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

exports.home = function(req, res){

  Appointment.find({}).exec(function(err, appointment){
    res.render('appointment/home', {layout: false, appointment:appointment});
  })
}


exports.logout = function(req, res){
  req.session.destroy();  
  res.redirect('/login')     
}


exports.login = function(req, res){
  res.render('appointment/login', {layout: false })    
}

exports.generate_appointment = function(req, res){
  res.render('appointment/generate_appointment', {layout: false})
}

exports.generate_appointment_post = function(req, res){
  // console.log(req.body)
  Appointment.find({ start: { $gte: req.body.start_date, $lte: req.body.end_date} }).
      sort({ createdAt: 1 }).exec(function(err, cards){
        AppointmentParticipant.find({}).populate('participant').exec(function(err, apps){
          var all_appointment = []
          for(var k in cards){
            let needed_data = {
              name: cards[k].title,
              date: cards[k].start.split(" ")[0],
              subject_matter: cards[k].subject_matter,
              time: cards[k].start.split(" ")[1],
              venue: cards[k].venue,
              participant: []
            }
            for(var i in apps){
              if(apps[i].appointment[0].toString() == cards[k].id){
                // console.log("its workings", cards[k], apps[i])
                needed_data.participant.push(apps[i].participant[0].name)             
              }
              else{
                // console.log("its not worrking")
              }
            }
            all_appointment.push(needed_data)
          }
          console.log(all_appointment)
          res.render('appointment/generate_appointment_page', {layout: false, all_appointment:all_appointment})
        })
  })  
  
}

exports.create_appointment = function(req, res){
  res.render('appointment/create_appointment', {layout: false })    
}

exports.create_category = function(req, res){
  console.log("XXXXXXXXXXXXXXXXX", req.body)
  let category = new Category();
  category.name = req.body.name;
  category.color = req.body.color;
  category.save(function(err, savedcategory){
    if(err){
      res.status(500).json({
        data:err
      });
    }
    res.status(201).json({
      data:savedcategory
    });
  })
  
}

function timeFormatter(date, time){
  return `${date} ${time}:00 GMT-0000`
}

exports.remove_participant = function(req, res){
  AppointmentParticipant.remove({_id:req.params.id}, function(err, success){
    if(err){
      console.log(err)
    }
    else{
      res.redirect(`/view_single_appointment/${req.params.app_id}`)
    }
});
}

exports.cancel_appointment = function(req, res){
  Appointment.remove({_id:req.params.id}, function(err, success){
    if(err){
      console.log(err)
    }
    else{
      res.redirect('/')
    }
});
}

//
exports.get_participant_by_appointment_time = function(req, res){
  Appointment.findOne({_id:req.params.id}, function(err, appointment){
    //lets select only users that are not already present in this appointment
    // lets select users that are not also present in other appoinment at a specific time

    //firstly lets get the appointment start time and end time
    let start_time = appointment.start;
    let end_time = appointment.end;
  })
}

function time_comparator(app_s_time, app_e_time, p_s_time, p_e_time){
 let app_s_time_date = app_s_time.split(" ")[0]
 let app_e_time_date = app_e_time.split(" ")[0]
 let app_s_time_time = app_s_time.split(" ").splice(0,2).join(",").replace(/,/g, " ");
 let app_e_time_time = app_e_time.split(" ").splice(0,2).join(",").replace(/,/g, " ");
 let p_s_time_date = p_s_time ==undefined?undefined:p_s_time.split(" ")[0]
 let p_e_time_date = p_s_time==undefined?undefined:p_e_time.split(" ")[0]
 if(p_s_time_date!=undefined && p_e_time!=undefined){
  let p_s_time_time = p_s_time.split(" ").splice(0,2).join(",").replace(/,/g, " ");
  
  
  // if(new Date(p_s_time_date).getTime() >= new Date(app_s_time_date).getTime()){

  // }
  // // console.log(app_s_time_time, app_e_time_time)
  // console.log(new Date(app_s_time_time).getTime() < new Date(app_e_time_time).getTime())
  // console.log("PPP",new Date(p_s_time_time).getTime() < new Date(p_e_time_time).getTime())
const firstCondition = new Date(p_s_time_time).getTime()>=new Date(app_s_time_time).getTime() ? true:false
  // if(new Date(p_s_time_time).getTime()>=new Date(app_s_time_time).getTime())  
  //   console.log("first Condition", true)
  // }
  const p_e_time_time = p_e_time.split(" ").splice(0,2).join(",").replace(/,/g, " ");
  // if(new Date(p_e_time_time).getTime()<=new Date(app_e_time_time).getTime()){
  //   console.log("second Condition", true)
  // }
const secondCondition = new Date(p_e_time_time).getTime()<=new Date(app_e_time_time).getTime()? true: false

 if(firstCondition==true && secondCondition==true){
   return true;
 }
 else {
   return false;
 }
}
}

exports.view_single_appointment = function(req, res){
  Appointment.findOne({_id:req.params.id}, function(err, appointment){
    let start_time = appointment.start.split(" ")[1];
    let end_time = appointment.end.split(" ")[1];
    let date = appointment.date
    // console.log(start_time, end_time, date)
    AppointmentParticipant.find({appointment:appointment._id})
    .populate("participant")
    .populate("appointment")    
    .exec(function(err, participants){
      //lets get all participants that have booked
      let negative_comparison = []
      let all_booked_hooked = []
      AppointmentParticipant.find({}, function(err, all_booked_participants){
      //lets get all participants     
      Participant.find({}, function(err, all_participants){
        // for(var i in all_participants){
          for(var k in all_booked_participants){
            // console.log(all_participants[i]._id)
            // console.log(all_booked_participants[k].start, all_booked_participants[k].end)
            if(time_comparator(appointment.start, appointment.end, all_booked_participants[k].start, all_booked_participants[k].end) == true){
              all_booked_hooked.push(all_booked_participants[k].participant_id)
            }
          }
          for(var i in all_participants){
            if(all_booked_hooked.includes(all_participants[i]._id.toString()) == false){
              console.log(all_participants[i])
              negative_comparison.push(all_participants[i])
            }
          }
          console.log("all booked",all_booked_hooked)
          //we extract a participant that is not booked
          //since we have the appointment start time and end time we only need to 
          //extract all booked users that fall within that time range
          //we now do a negative comparison to select those that are not present

        // }
        res.render('appointment/view_single_appointment', {layout: false, negative_comparison:negative_comparison, appointment:appointment, participants:participants})
      })      
    })
    })
  })
}


exports.add_participant_appointment = function(req, res){
  console.log(req.params.id)
  console.log(req.body)
  Appointment.findOne({_id:req.params.id}, function(err, apps){
    let participants = req.body.participant;
    console.log("this is it", apps)
    console.log(typeof participants, participants)
    if(typeof participants=="string"){
      let appointmentParticipant = new AppointmentParticipant();
        appointmentParticipant.appointment = apps._id;
        appointmentParticipant.participant = participants;
        appointmentParticipant.participant_id = participants//for faster queries
        appointmentParticipant.start = apps.start;
        appointmentParticipant.end = apps.end;
        appointmentParticipant.date = apps.date;
        appointmentParticipant.save(function(err, savedAppointment){
          if(err){
            console.log(err)
          }
          else {
            return;
          }
        })
        res.redirect(`/view_single_appointment/${req.params.id}`)
      }
      else {
          for(var i in participants){
                let appointmentParticipant = new AppointmentParticipant();
                appointmentParticipant.appointment = apps._id;
                appointmentParticipant.participant = participants[i];
                appointmentParticipant.participant_id = participants[i]//for faster queries
                appointmentParticipant.start = apps.start;
                appointmentParticipant.end = apps.end;
                appointmentParticipant.date = apps.date;
                appointmentParticipant.save(function(err, savedAppointment){
                  if(err){
                    console.log(err)
                  }
                  else {
                    return;
                  }
                })
          }
        res.redirect(`/view_single_appointment/${req.params.id}`)
      }
  })
}


exports.create_appointment_post = function(req, res){
  console.log("from the creator",req.body)
  let start_time = timeFormatter(req.body.date, req.body.startTime)
  let end_time = timeFormatter(req.body.date, req.body.endTime)
  //var datew = new Date('01-04-2020 17:12:00 GMT-0100')
  
  let appointment = new Appointment();
  appointment.title = req.body.name;
  appointment.subject_matter = req.body.subject_matter;
  appointment.start = start_time;
  appointment.end = end_time;
  appointment.date = req.body.date;
  appointment.venue = req.body.venue;
  appointment.className2 = req.body.className
  appointment.className = `bg-${req.body.className}`
  appointment.save(function(err, appointment_saved){
    if(err){
      console.log(err)
    }
    else {
      let participants = req.body.participant
      for(var i in participants){
        let appointmentParticipant = new AppointmentParticipant();
        appointmentParticipant.appointment = appointment_saved._id;
        appointmentParticipant.participant = participants[i];
        appointmentParticipant.participant_id = participants[i]//for faster queries
        appointmentParticipant.start = start_time
        appointmentParticipant.end = end_time;
        appointmentParticipant.date = req.body.date;
        appointmentParticipant.save(function(err, savedAppointment){
          if(err){
            console.log(err)
          }
          else {
            return;
          }
        })
      }
      res.status(201).json({
        data:appointment_saved
      });
    }
  })

}

function time_extractor(start, end, new_date){
 
  let start_init_vals = start.split(" ");
  let start_time = start_init_vals[1];
  
  let end_init_vals = end.split(" ");
  let end_time = end_init_vals[1];
 

  let new_date_array = new_date.split(" ")
  new_date_array[4] = start_time;
  let end_date_array = new_date.split(" ")
  end_date_array[4] = end_time
  let start_value = new_date_array.join(",").replace(/,/g, ' ');
  let end_value = end_date_array.join(",").replace(/,/g, ' ');
  let data=undefined;
  return data = {
    start: start_value,
    end: end_value
  }
}

exports.drag_to_create_event = function(req, res){
  console.log("from the dragger",req.body)
  let data = req.body.data.split("|")
  let title = data[0];
  let date = req.body.date
  let _id = data[1]
  console.log("current_date", date)
  let tableId = data[1].toString().trim();
  Appointment.findOne({isTable:false, _id:_id.toString()}).sort({ field: 'asc', _id: 1 }).select('-_id').exec(function(err, single_appointment){
    const start_date = single_appointment.start;
    const end_date = single_appointment.end;
    let remix_single_appointment = single_appointment
    remix_single_appointment['isTable'] = true;
    
    console.log(time_extractor(remix_single_appointment.start, remix_single_appointment.end, date))
    console.log("FFFFFFF",remix_single_appointment)
    remix_single_appointment['start'] = time_extractor(start_date, end_date, date).start;
    remix_single_appointment['end'] = time_extractor(start_date, end_date, date).end;
    console.log(remix_single_appointment)
    Appointment.insertMany(remix_single_appointment, function (err, docs) {
        if (err){
            console.error(err);
            res.status(400).json(err);
        } else {       
            res.status(200).json(docs);
        }
    });
  })
}

exports.single_appointment = function(req, res){
  console.log(req.params.id)
  Appointment.findOne({_id:req.params.id}, function(err, single_appointment){
    res.status(201).json({
      data:single_appointment
    });
  })
}

exports.edit_appointment = function(req, res){
  // console.log(req.body)
  console.log(req.params.id)
let start_time = timeFormatter(req.body.date, req.body.startTime)
let end_time = timeFormatter(req.body.date, req.body.endTime)

  Appointment.findByIdAndUpdate(req.params.id, 
    {
      title:req.body.name,
      subject_matter: req.body.subject_matter,
      date: req.body.date,
      end: end_time,
      start: start_time,
      venue: req.body.venue
    }
    )
  .exec(function(err, updated_appointment){
      if(err){
          console.log(err)
      }else {
      console.log(updated_appointment)
        res.status(201).json({
          data:updated_appointment
        });
      }
  })
  
}


exports.create_participant = function(req, res){
  console.log(req.body)
  let participant = new Participant();
  participant.name = req.body.name;
  participant.position = req.body.position;
  participant.save(function(err, participant){
    if(err){
      console.log(err)
    }
    else {
      res.status(201).json({
        data:participant
      });
    }
  })
}

exports.register_super = function(req, res){
  res.render('appointment/register', {layout: false})
}

exports.calendar = function(req, res){
  Appointment.find({isTable:false}).exec(function(err, appointment){
    Appointment.find({isTable:true}).exec(function(err, all_apps){
    Participant.find({}).exec(function(err, participant){
      res.render('appointment/calendar', {layout: false, appointment:appointment,all_apps:JSON.stringify(all_apps), stringified_app:JSON.stringify(appointment), participant:participant})
    })
  })
})
}

exports.all_appointments = function(req, res){
  Appointment.find({isTable:true}).exec(function(err, appointment){
    res.status(200).json({
      stringified_app:(appointment)
    })
  })
}

exports.all_participants = function(req, res){
  Participant.find({}).exec(function(err, participants){
    res.status(200).json({
      participants:participants
    })
  })
}