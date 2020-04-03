import express from 'express';


import AppointmentController from '../controllers/appointment';


const router = express.Router();



router.route('/')
    .get(AppointmentController.home)

router.route('/login')
    .get(AppointmentController.login)
    
router.route('/calendar')
    .get(AppointmentController.calendar)

router.route('/logout')
    .get(AppointmentController.logout)

router.route('/cancel_appointment/:id')
    .get(AppointmentController.cancel_appointment)

router.route('/create_category')
    .post(AppointmentController.create_category)

router.route('/add_participant_appointment/:id')
    .post(AppointmentController.add_participant_appointment)

router.route('/generate_appointment')
    .get(AppointmentController.generate_appointment)
    .post(AppointmentController.generate_appointment_post)

router.route('/view_single_appointment/:id')
    .get(AppointmentController.view_single_appointment)

router.route('/remove_participant/:id/:app_id')
    .get(AppointmentController.remove_participant)

router.route('/single_appointment/:id')
    .get(AppointmentController.single_appointment)

router.route('/create_participant')
    .post(AppointmentController.create_participant)

router.route('/all_appointments')
    .get(AppointmentController.all_appointments)

router.route('/all_participants')
    .get(AppointmentController.all_participants)

router.route('/edit_appointment/:id')
    .post(AppointmentController.edit_appointment)

router.route('/drag_to_create_event')
    .post(AppointmentController.drag_to_create_event)    

router.route('/register_super')
    .get(AppointmentController.register_super)
    // .post(AppointmentController.register_super_post)
router.route('/create_appointment')
    .get(AppointmentController.create_appointment)
    .post(AppointmentController.create_appointment_post)

export default router;