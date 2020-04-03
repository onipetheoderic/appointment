
!function($) {
    "use strict";
    var all_appointments = $('#all_appointments').val();

    const all_appointments_parsed = JSON.parse(all_appointments);
    //all_participants
    // console.log(all_appointments_parsed)
   
   function all_params(params){
       console.log("XXXXXXXXXX", params)
       return params
       $('#calendar').hide();
       setTimeout(function() {
        $('#calendar').show();
    }, 0);
    $('#calendar').redraw();
   }
   
   function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "",
      i = 0,
      min = an == "a" ? 10 : 0,
      max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
      var r = Math.random() * (max - min) + min << 0;
      str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
  }
    var CalendarApp = function() {
        this.$body = $("body")
        this.$calendar = $('#calendar'),
        this.$event = ('#calendar-events div.calendar-events'),
        this.$categoryForm = $('#add_new_event form'),
        this.$categoryForm2 = $('#add_new_event2 form'),
        this.$extEvents = $('#calendar-events'),
        this.$modal = $('#my_event'),
        this.$saveCategoryBtn = $('.save-category'),
        this.$saveEventBtn = $('.save-event')
        this.$saveParticipantBtn = $('.save-participant'),
        this.$calendarObj = null
    };


    /* on drop */
    CalendarApp.prototype.onDrop = function (eventObj, date) { 
        var $this = this;
        console.log("thissss", $this, eventObj) 
            // retrieve the dropped element's stored Event Object
            var originalEventObject = eventObj.data('eventObject');
            var $categoryClass = eventObj.attr('data-class');
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            
            // assign it the date that was reported
            copiedEventObject.start = date;
            if ($categoryClass)
                copiedEventObject['className'] = [$categoryClass];
            // render the event on the calendar
            console.log("coppied", copiedEventObject, date._d)
            $this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
            // is the "remove after drop" checkbox checked?
            $.post("/drag_to_create_event",
                {
                    data:copiedEventObject.title,
                    date:date._d
                },
                function(data, status){
                    console.log(data, status)
                    window.location.reload()
                });
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                eventObj.remove();
            }
    },
    /* on click on event */
    CalendarApp.prototype.onEventClick =  function (calEvent, jsEvent, view) {
        
        
        const _id = calEvent._id;
       
      
        console.log("on Event Click", _id)
        // console.log(single_data.title)        
        var $this = this;
       
        var form = $("<form></form>");
        $.get(`/single_appointment/${_id}`, function(data, status){
            let all_datas = JSON.parse(JSON.stringify(data));
            var single_data = all_datas.data;
            // console.log(single_data)   
            
            let title = single_data.title.replace(/\s/g, "|")
            console.log("this is the title", title)  
            form.find(".event-participant")      
            .prepend(`<div class='form-group'><label class='control-label'>Venue</label><input class='form-control' value=${single_data.venue.toString()} placeholder='Venue' type='text' name='venue'/></div>`)
            .prepend(`<div class='form-group'><label class='control-label'>Date</label><input class='form-control' value=${single_data.date} placeholder='Date' type='date' name='date'/></div>`) 
            .prepend(`<div class='form-group'><label class='control-label'>Subject Matter</label><input class='form-control' value=${single_data.subject_matter} placeholder='Insert Subject Matter' type='text' name='subject_matter'/></div>`)  
            .prepend(`<div class='form-group'><label class='control-label'>Title</label><input class='form-control' value=${title.replace("|", ".")} type='text' name='event_name'/></div>`)    
          });
        form.append("<div class='event-participant'></div>");
        form.find(".event-participant")
       
            // .append(`<div class='form-group'><label class='control-label'>Title</label><input class='form-control'  type='text' name='event_name'/></div>`)
            // .append("<div class='form-group'><label class='control-label'>Subject Matter</label><input class='form-control' placeholder='Insert Subject Matter' type='text' name='subject_matter'/></div>")
            // .append("<div class='form-group'><label class='control-label'>Venue</label><input class='form-control' placeholder='Venue' type='text' name='venue'/></div>")
            // .append("<div class='form-group'><label class='control-label'>Date</label><input class='form-control' placeholder='Date' type='date' name='date'/></div>")
            .append("<div class='form-group'><label class='control-label'>Start Time</label><input class='form-control' placeholder='Start Time' type='time' name='start_time'/></div>")
            .append("<div class='form-group'><label class='control-label'>End Time</label><input class='form-control' placeholder='End Time' type='time' name='end_time'/></div>")
            
            //   form.append("<div class='form-group mb-0'><button class='btn btn-success edit_appointment'>Submit</button></div>")
            $this.$modal.modal({
                backdrop: 'static'
            });
            $this.$modal.find('.delete-event').show().end().find('.save-event').end().find('.modal-body').empty().prepend(form).end().find('.delete-event').unbind('click').click(function () {
                $this.$calendarObj.fullCalendar('removeEvents', function (ev) {
                    return (ev._id == calEvent._id);
                });
                $this.$modal.modal('hide');
            });
            this.$saveEventBtn.on('click', function(){
                console.log("event bttn has bene clicked")
            
            var eventName = form.find("input[name='event_name']").val();
            var subjectMatter = form.find("input[name='subject_matter']").val();
            var date = form.find("input[name='date']").val();
            var startTime = form.find("input[name='start_time']").val();
            var endTime = form.find("input[name='end_time']").val();
            var venue = form.find("input[name='venue']").val();
            var participant = form.find("select[name='participants']").val();
            $.post(`/edit_appointment/${_id}`,
            {
                name: eventName,
                subject_matter: subjectMatter,
                date: date,
                startTime: startTime,
                endTime:endTime,
                venue: venue,
                participant: participant,
                _id: _id
            },
            function(data, status){
                console.log(data, status)
                $this.$modal.modal('hide');
                window.location.reload()
            });
            // alert(eventName, subjectMatter, date, startTime, endTime, venue, participant)
            //     calEvent.title = form.find("input[name='event_name']").val();
            //     $this.$calendarObj.fullCalendar('updateEvent', calEvent);
            //     $this.$modal.modal('hide');
              
                // return false;
            });
    },
    /* on select */
    CalendarApp.prototype.onSelect = function (start, end, allDay) {
        var $this = this;
            $this.$modal.modal({
                backdrop: 'static'
            });
            var form = $("<form></form>");
            form.append("<div class='event-inputs'></div>");
            form.find(".event-inputs")
                .append("<div class='form-group'><label class='control-label'>Event Name</label><input class='form-control' placeholder='Insert Event Name' type='text' name='title'/></div>")
                .append("<div class='form-group'><label class='control-label'>Event Name</label><input class='form-control' placeholder='Date' type='date' name='date'/></div>")
                .append("<div class='form-group'><label class='control-label'>Start Time</label><input class='form-control' placeholder='Start Time' type='time' name='start_time'/></div>")
                .append("<div class='form-group'><label class='control-label'>Start Time</label><input class='form-control' placeholder='End Time' type='time' name='end_time'/></div>")
                .append("<div class='form-group mb-0'><label class='control-label'>Category</label><select class='form-control' name='category'></select></div>")
                .find("select[name='category']")
                .append("<option value='bg-info'>Info</option>")
                .append("<option value='bg-success'>Success</option>")
                .append("<option value='bg-purple'>Purple</option>")
                .append("<option value='bg-primary'>Primary</option>")
                .append("<option value='bg-danger'>Red</option>")
                .append("<option value='bg-warning'>Warning</option></div></div>");
            $this.$modal.find('.delete-event').hide().end().find('.save-event').show().end().find('.modal-body').empty().prepend(form).end().find('.save-event').unbind('click').click(function () {
                form.submit();
            });
            $this.$modal.find('form').on('submit', function () {
               
                var title = form.find("input[name='title']").val();
             
                var beginning = form.find("input[name='beginning']").val();
                var ending = form.find("input[name='ending']").val();
                var categoryClass = form.find("select[name='category'] option:checked").val();
                console.log("this is the submitten instance", start, end, title)
                if (title !== null && title.length != 0) {
                    $this.$calendarObj.fullCalendar('renderEvent', {
                        title: title,
                        start:start,
                        end: end,
                        allDay: false,
                        className: categoryClass
                    }, true);  
                    $this.$modal.modal('hide');
                }
                else{
                    alert('You have to give a title to your event');
                }
                return false;
                
            });
            $this.$calendarObj.fullCalendar('unselect');
    },
    CalendarApp.prototype.enableDrag = function() {
        //init events
        $(this.$event).each(function () {
            // it doesn't need to have a start or end
            console.log("dragging", this)
            console.log(randomString(6));   
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };
            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);
            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }

    /* Initializing */
    CalendarApp.prototype.init = function() {
        this.enableDrag();
        /*  Initialize the calendar  */
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var form = '';
        var today = new Date($.now());
        var datew = new Date('2020-03-31 17:12:00 GMT-0100')
        var datee = new Date('2020-03-31 20:12:00 GMT-0100')
        var newDate = datew // "Wed Jun 29 2011 09:52:48 GMT-0700 (PDT)"
        var defaultEvents = all_params(all_appointments_parsed)

        var $this = this;
        // console.log(defaultEvents)
        $this.$calendarObj = $this.$calendar.fullCalendar({
            slotDuration: '00:15:00', /* If we want to split day time each 15minutes */
            minTime: '08:00:00',
            maxTime: '19:00:00',  
            defaultView: 'month',  
            handleWindowResize: true,   
             
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: defaultEvents,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true, // allow "more" link when too many events
            selectable: false,
            drop: function(date) { $this.onDrop($(this), date); },
            select: function (start, end, allDay) { $this.onSelect(start, end, allDay); },
            eventClick: function(calEvent, jsEvent, view) { $this.onEventClick(calEvent, jsEvent, view); }

        });

        //on new event
        this.$saveCategoryBtn.on('click', function(){
            console.log("the button has been clicked")
            

            var eventName = $this.$categoryForm.find("input[name='event_name']").val();
            var subjectMatter = $this.$categoryForm.find("input[name='subject_matter']").val();
            var date = $this.$categoryForm.find("input[name='date']").val();
            var startTime = $this.$categoryForm.find("input[name='start_time']").val();
            var endTime = $this.$categoryForm.find("input[name='end_time']").val();
            var venue = $this.$categoryForm.find("input[name='venue']").val();
            var className = $this.$categoryForm.find("select[name='className']").val();
            var participant = $this.$categoryForm.find("select[name='participant']").val();
            if (eventName !== null && eventName.length != 0) {
                $this.$extEvents.append('<div class="calendar-events" data-class="bg-' + subjectMatter + '" style="position: relative;"><i class="fa fa-circle text-' + subjectMatter + '"></i>' + eventName + '</div>')
                $this.enableDrag();
            }
            $.post("/create_appointment",
                {
                    name: eventName,
                    subject_matter: subjectMatter,
                    date: date,
                    startTime: startTime,
                    endTime:endTime,
                    venue: venue,
                    participant: participant,
                    className: className
                },
                function(data, status){
                    // console.log(data, status)
                    $.get("/all_appointments", function(data, status){
                        let all_datas = JSON.parse(JSON.stringify(data));
                        console.log(all_datas.stringified_app)
                        all_params(all_datas.stringified_app)
                        window.location.reload()
                      });
                });

        });


        //on new event
        this.$saveParticipantBtn.on('click', function(){
            // console.log("the participant has been clicked")
            var name = $this.$categoryForm2.find("input[name='name']").val();
            var position = $this.$categoryForm2.find("input[name='position']").val();
          
            // if (name !== null && position.length != 0) {
            //     $this.$extEvents.append('<div class="calendar-events" data-class="bg-' + name + '" style="position: relative;"><i class="fa fa-circle text-' + name + '"></i>' + name + '</div>')
            //     $this.enableDrag();
            // }
            $.post("/create_participant",
                {
                    name: name,
                    position: position
                },
                function(data, status){
                    console.log(data, status)
                  
                });

        });
    },



   //init CalendarApp
    $.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp
    
}(window.jQuery),

//initializing CalendarApp
function($) {
    "use strict";
    $.CalendarApp.init()
}(window.jQuery);