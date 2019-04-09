'use strict';

const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  Carousel,
  Image,
  List,
  Table,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID and service account JSON below.
const calendarId = 'ohc3opjia1026sbt2atemopf84@group.calendar.google.com'; // Example: 6ujc6j6rgfk02cp02vg6h38cs0@group.calendar.google.com
const serviceAccount = {
  "type": "service_account",
  "project_id": "intenttest-1837c",
  "private_key_id": "a9bd2901c8b616bfadba7249e1e5fef84cd79338",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC55K7eDh4RU7Eg\nnj5vWH1xmu68x8FyBm2moggSuZuqp4UP45p7LaCizL6it9gEL7xQVdzsAbpAf6rX\naFZ/5bRG8ASImMHIUyb5YqkVaLEZJ7H9pLCxp0/5rtSZpmBKQzmZvXnNVXskzXkY\nls6V3cWrCZagL7f1k8TyzpdD0USE85KYPM4q5e7BRa2WKM1iFPfgdnBudqKlzyKm\nXKgea3ONs/9TNA/EThluLtai4TheWm69bJ0Ay+ZFD842c8EyM+aBx03EsQZDtOIV\nWUzGEW693sya8vxZwewhN6EyuPTMAC+u63lnCBoSuCY439wkkv7tccZ16FMTvSf+\nhU4NNERhAgMBAAECggEAA4YKa4KcfssVky70s4Mbo5zidBkcOVdWWj99hC9Y/Eff\nHZE8oyOXBSb44Rg3g8LM4L/z51RUDbdty1X6t8NooqSXjWhJ2gx7c2QznMiGfNnU\nBaEKyV9IxIyUEpKFBjtWeuvMxH/fjO/JIRZwtYYF4mtU29XzuHez1r9kPiCYGiYE\nerGMF1VN07SHrSb1P4eX4cDEIHKQGvZGWAi9IBmxJNoOhI+LTbp2Lej2hQJy1IzB\nU7NTjDe3PsDwKzZdFVuoLl0gXH8wImAt/rL6yUVFtOxG0oKMwvikrj3bzpWz+z9A\n3+Avl5BfT3RRsBD7wZIqrdA2F3URYnZBBDzgxp1orQKBgQDy6RbDYtg6XXCcCt39\no+crHnHqE1ap6Jgh/+QMpndJWYh4176GWDJoKXYANGkfGYbn0a7OYfgxNUzCATNG\nltScYTzZihSezDM+oV1dJL5pg2fOwjGVHohaVp5LEb7dVdHUwkWe8rS61Zjiljz+\nEpY+/bzNGNAU3JmWULiwasXYfQKBgQDD6Q0MTNc3MiVB1O/zp4sERqZSEjzClkp3\nIf9ml13iRg6ziZ08FkYPeO7ykRjE7pCuIuMbh6P02VHS8F0dQnOhtLLm4sKaxFw1\n5W9k42licDP3PqK+p8vAFF3ffcLmlHpFDbX8TXzEnPkcTE5PJOksIZmwOQy8OcoV\nkgAh4uVEtQKBgBvapJSVEgxnSJFsIZaDI+/q1s8rloV3OXK0oBbfQ9ByZtbMjnlj\nRaxyDKjrWZ6KU9DjV3MtAsPJw9p/Prz6cLjZ4ZtkXQb0jW/CGy2iF/+LZOztkbfy\nv1n0ksQy7br9q0kFWexnElhWQ+i/p5DO2tGwUOUH0lyCC06URQldxQAVAoGASNfu\nshQgMbXDhKbYUZCKcByU2w9M6E1ZgtJxVIQTtH64GKmifSULB9W/gxHQU+kggp8W\nMrZMkE39zqDw/mAm/olhu9e05Db+0kttD+Y+2Qs/Rz9S4/EgIVtxTBhGz9WFYQeo\nExf8vF5hgdQdie//gxk7O/r6cUJLkZmn0vG6rcECgYBM07OTeBAIPjOzpFJlR3fY\nzfAJjv+2bDhWg53+TJdJrDCMPT7vyM/+25O8E7Ke4FphV70RTPjhLXpkOA71RUbM\nZSjWGDDdTcrhzaWm3ooE7fJf2O/V9FzppO0wZ9PJz8hBB1i3VCh9Rg5FtNWhOQUp\nPKVVnqyDknzCjGNLm0WabQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "owner-307@intenttest-1837c.iam.gserviceaccount.com",
  "client_id": "104428328534217453428",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/owner-307%40intenttest-1837c.iam.gserviceaccount.com"
};


// Set up Google Calendar service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // It enables lib debugging statements

const timeZone = 'Australia/Sydney';  // Change it to your time zone
const timeZoneOffset = '+11:00';         // Change it to your time zone offset

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function makeAppointment (agent) {
    // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    const dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    const dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    const appointmentTimeString = getLocaleTimeString(dateTimeStart);
    const appointmentDateString = getLocaleDateString(dateTimeStart);
    // Check the availability of the time slot and set up an appointment if the time slot is available on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd).then(() => {
      agent.add(`Got it. I have your appointment scheduled on ${appointmentDateString} at ${appointmentTimeString}. See you soon. Good-bye.`);
    }).catch(() => {
      agent.add(`Sorry, we're booked on ${appointmentDateString} at ${appointmentTimeString}. Is there anything else I can do for you?`);
    });
  }
  let intentMap = new Map();
  intentMap.set('Make Appointment', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
  agent.handleRequest(intentMap);
});

function createCalendarEvent (dateTimeStart, dateTimeEnd) {
  return new Promise((resolve, reject) => {
    calendar.events.list({  // List all events in the specified time period
      auth: serviceAccountAuth,
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there exists any event on the calendar given the specified the time period
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create an event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: 'Bike Appointment',
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('+')[0] + timeZoneOffset));
}

// A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
function addHours(dateObj, hoursToAdd){
  return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this time in English.
function getLocaleTimeString(dateObj){
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timeZone });
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this date in English. 
function getLocaleDateString(dateObj){
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timeZone });
}

app.intent('term.information', (conv) => {
  var sessionContext = conv.contexts.get('session-vars');
  sayTermInformation(conv);
});

app.intent('course.timetable', (conv) => {
  var sessionContext = conv.contexts.get('session-vars');
  sayTimeTableInformation(conv);
});


function sayTermInformation(conv) {
  var sessionContext = conv.contexts.get('session-vars');
  var term = sessionContext.parameters.term;
  switch (term) {
    case "Term 1":
        conv.ask('Hey! Here are the key academic dates for Term 1');
        conv.ask(term1list());
        break;
      case "Term 2": 
        conv.ask('Hey! Here are the key academic dates for Term 2');
        conv.ask(term2list());
        break;
      case "Term 3":
        conv.ask('Hey! Here are the key academic dates for Term 3');
        conv.ask(term3list());
        break;
    }
}

function sayTimeTableInformation(conv) {
  var sessionContext = conv.contexts.get('session-vars');
  var course = sessionContext.parameters.course;
  switch (course) {
    case "INFS1603":
        conv.ask('Hey! Here are the class timetables for INFS1603');
        conv.ask(new Table({
    	dividers:true,
    	columns:['Course', 'Lecture/Tutorial', 'Day & Time'],
    	rows: [
          ['INFS1603', 'Lecture', 'Mon 12:00 - 14:00 (Weeks:1-9,11)'],
          ['INFS1603', 'Tutorial', 'W09A  Wed 09:00 - 11:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W11A  Wed 11:00 - 13:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W11B  Wed 11:00 - 13:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W13A  Wed 13:00 - 15:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W13B  Wed 13:00 - 15:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W15A  Wed 15:00 - 17:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W17A  Wed 17:00 - 19:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W17B  Wed 17:00 - 19:00 (Weeks:1-10)'],
          ['INFS1603', 'Tutorial', 'W19A  Wed 19:00 - 21:00 (Weeks:1-10)'],
    	],
  	}));
        break;
    case "INFS1609": 
        conv.ask('Hey! Here are the class timetables for INFS1609');
        conv.ask(new Table({
   	dividers:true,
    	columns:['Course', 'Lecture/Tutorial', 'Day & Time'],
    	rows: [
          ['INFS1609', 'Lecture', 'Tue 11:00 - 13:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'ue 17:00 - 19:00 (Weeks:11), Thu 17:00 - 19:00 (Weeks:1-9)'],
          ['INFS1609', 'Tutorial', 'Tue 17:00 - 19:00 (Weeks:11), Thu 17:00 - 19:00 (Weeks:1-9)'],
          ['INFS1609', 'Tutorial', 'Tue 19:00 - 21:00 (Weeks:11), Thu 19:00 - 21:00 (Weeks:1-9)'],
          ['INFS1609', 'Tutorial', 'Tue 14:00 - 16:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Tue 16:00 - 18:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Tue 16:00 - 18:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Tue 18:00 - 20:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Tue 18:00 - 20:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Wed 09:00 - 11:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Wed 18:00 - 20:00 (Weeks:1-10)'],
          ['INFS1609', 'Tutorial', 'Wed 18:00 - 20:00 (Weeks:1-10)'],
    	],
  	}));
        break;
    case "INFS2605":
        conv.ask('Hey! Here are the class timetables for INFS2605');
        conv.ask(new Table({
   	dividers:true,
    	columns:['Course', 'Lecture/Tutorial', 'Day & Time'],
    	rows: [
          ['INFS2605', 'Lecture', 'Tue 16:00 - 17:00 (Weeks:1-10)'],
          ['INFS2605', 'Tutorial', 'Wed 11:00 - 13:00 (Weeks:11), Fri 11:00 - 13:00 (Weeks:1-8), Fri 11:00 - 13:00 (Weeks:10)'],
          ['INFS2605', 'Tutorial', 'Tue 09:00 - 11:00 (Weeks:11), Thu 09:00 - 11:00 (Weeks:1-9)'],
          ['INFS2605', 'Tutorial', 'Tue 11:00 - 13:00 (Weeks:11), Thu 11:00 - 13:00 (Weeks:1-9)'],
          ['INFS2605', 'Tutorial', 'Tue 18:00 - 20:00 (Weeks:1-10)'],
          ['INFS2605', 'Tutorial', 'Tue 18:00 - 20:00 (Weeks:1-10)'],
          ['INFS2605', 'Tutorial', 'Wed 09:00 - 11:00 (Weeks:1-10))'],
          ['INFS2605', 'Tutorial', 'Wed 11:00 - 13:00 (Weeks:1-10)'],
          ['INFS2605', 'Tutorial', 'Wed 13:00 - 15:00 (Weeks:1-10)'],
          ['INFS2605', 'Tutorial', 'Wed 18:00 - 20:00 (Weeks:1-10)'],
    	],
  	}));
        break;
    case "INFS3634":
        conv.ask('Hey! Here are the class timetables for INFS3634');
        conv.ask(new Table({
    	dividers:true,
   	columns:['Course', 'Lecture/Tutorial', 'Day & Time'],
    	rows: [
          ['INFS3634', 'Lecture',  'Mon 09:00 - 10:00 (Weeks:1-9,11)'],
          ['INFS3634', 'Tutorial', 'Mon 12:00 - 14:00 (Weeks:1-9), Mon 12:00 - 14:00 (Weeks:11)'],
          ['INFS3634', 'Tutorial', 'Tue 16:00 - 18:00 (Weeks:1-10)'],
          ['INFS3634', 'Tutorial', 'Tue 18:00 - 20:00 (Weeks:1-10)'],
       
    	  ],
  	  }));
        break;
    case "INFS3605":
        conv.ask('Hey! Here are the class timetables for INFS3605');
        conv.ask(new Table({
    	dividers:true,
    	columns:['Course', 'Lecture/Tutorial', 'Day & Time'],
    	rows: [
          ['INFS3605', 'Lecture',  'Wed 16:00 - 18:00 (Weeks:1-10)'],
       
   	  ],
  	}));
        break;
    }
}

const term1list = () => {
  const list = new List({
  title: 'Term 1',
  items: {
    // Add the first item to the list
    'O Week': {
      title: 'O - Week',
      description: 'Date: 11/2/2019 - 15/2/2019',
      },
    // Add the second item to the list
    'Teaching Period': {
      title: 'Teaching Period',
      description: 'Date: 18/2/2019 - 1/5/2019',
    },
    // Add the third item to the list
    'Study Period': {
      title: 'Study Period',
      description: 'Date: 2/5/2019 - 4/5/2019',
      },

    'Exam Period': {
      title: 'Exam Period',
      description: 'Date: 6/5/2019 - 18/5/2019',
      },

    'Term Break': {
      title: 'Term Break',
      description: 'Date: 19/5/2019 - 2/6/2019',
      },

 }});
 return list;
};

const term2list = () => {
  const list = new List({
  title: 'Term 2',
  items: {
    
     // Add the first item to the list
    'Teaching Period': {
      title: 'Teaching Period',
      description: 'Date: 3/6/2019 - 12/8/2019',
    },
    // Add the second item to the list
    'Study Period': {
      title: 'Study Period',
      description: 'Date: 13/8/2019 - 17/8/2019',
      },

    'Exam Period': {
      title: 'Exam Period',
      description: 'Date: 16/8/2019 - 31/8/2019',
      },

    'Term Break': {
      title: 'Term Break',
      description: 'Date: 1/9/2019 - 15/9/2019',
      },

 }});
 return list;
};

const term3list = () => {
  const list = new List({
  title: 'Term 3',
  items: {
    
    'O Week': {
      title: 'O - Week',
      description: 'Date: 11/9/2019 - 13/9/2019',
      },
     
    'Teaching Period': {
      title: 'Teaching Period',
      description: 'Date: 16/9/2019 - 25/11/2019',
    },
 
    'Study Period': {
      title: 'Study Period',
      description: 'Date: 26/11/2019 - 30/11/2019',
      },

    'Exam Period': {
      title: 'Exam Period',
      description: 'Date: 29/11/2019 - 14/12/2019',
      },

 }});
 return list;
};

app.intent('assessment.timeline', (conv) => {
	conv.ask('Here are the assessments you have this semester. Good luck!');
	conv.ask(assessmentTimelineList());
 });

app.intent('assessment.card', (conv, params, option) => {
	conv.ask('Here are the details for your assessment. Would you like me to break down your assessment into subtasks?');
	conv.ask(new BasicCard(assessmentMap[option]));
	conv.ask(new Suggestions('Yes', 'No'));
});

app.intent('assessment.card - yes', (conv) => {
	conv.ask('Here is a plan for your assignment. Would you like me to add it to your calendar?')
	conv.ask(new Suggestions('Yes', 'No'));
	conv.ask(new Table({
	 title: 'INFS3605 Assignment 1 Plan',
  	 dividers: true,
 	 columns: ['Step', 'Time', 'Due Date'],
 	 rows: [
   		['Plan and prepare', '3 days', '19 Feb 2019'],
   		['Research and notes', '13 days', '22 Feb 2019'],
   		['Write first draft', '7 days', '7 Mar 2019'],
   		['Revise and re-draft', '4 days', '14 Mar 2019'],
   		['Final draft and submit', '2 days', '20 Mar 2019'],
  ],
}))
});

app.intent('terms', (conv) => {
	conv.ask('Sure. What would you like to know about the new terms system at UNSW?');
	conv.ask(new Suggestions('Will my fees increase?', 'How do exams work?', 'How do breaks work?', 'More information'));
});

app.intent('terms.fees', (conv) => {
	conv.ask('Course fees will not change due to UNSW3+.');
	conv.ask(new Suggestions('How do exams work?', 'How do breaks work?', 'More information'));
});

app.intent('terms.exams', (conv) => {
	conv.ask('There will be a two-week exam period per term. However, students will be sitting a maximum of three exams, compared to four under the current two semester calendar.');
	conv.ask(new Suggestions('Will my fees increase?', 'How do breaks work?', 'More information'));
});

app.intent('terms.breaks', (conv) => {
	conv.ask('The length of the summer holiday for students will be 9 weeks. Mid-year breaks will be two blocks of two weeks at the end of each term.');
	conv.ask(new Suggestions('Will my fees increase?', 'How do exams work?', 'More information'));
});

app.intent('terms.fallback', (conv) => {
	conv.ask('If you have further questions, perhaps a chat with the UNSW3+ team would help. You can find their contact details via www.unsw.to/contactus');
	conv.ask(new Suggestions('Will my fees increase?', 'How do exams work?', 'More information'));
});


app.intent('course.duoquiz.start', (conv) => {
	conv.ask('Lets begin! ' + getPlayerName(conv) + 's turn first.');
	sayQuestionDuo(conv);
});

app.intent(['course.duoquiz.q1correct.p1','course.duoquiz.q2correct.p1','course.duoquiz.q3correct.p1','course.duoquiz.q4correct.p1','course.duoquiz.q1correct.p2','course.duoquiz.q2correct.p2','course.duoquiz.q3correct.p2','course.duoquiz.q4correct.p2', 'course.duoquiz.q5correct.p1'], (conv) => {
	sayCorrectDuo(conv);
	sayQuestionDuo(conv);
});

app.intent(['course.duoquiz.q1incorrect.p1','course.duoquiz.q2incorrect.p1','course.duoquiz.q3incorrect.p1','course.duoquiz.q4incorrect.p1','course.duoquiz.q1incorrect.p2','course.duoquiz.q2incorrect.p2','course.duoquiz.q3incorrect.p2','course.duoquiz.q4incorrect.p2', 'course.duoquiz.q5incorrect.p1'], (conv) => {
	sayIncorrectDuo(conv);
	sayQuestionDuo(conv);
});

app.intent('course.duoquiz.q5correct.p2', (conv) => {
	sayCorrectDuo(conv);
	sayFinalScoreDuo(conv);
});

app.intent('course.duoquiz.q5incorrect.p2', (conv) => {
	sayIncorrectDuo(conv);
	sayFinalScoreDuo(conv);
});

app.intent('course', (conv) => {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	sayCourseInformation(conv);
	conv.ask(new BasicCard(courseInformationMap[course]));
});

app.intent('course.prerequisite', (conv) => {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	conv.ask('Here is the prerequisites information for ' + course + '.', new BasicCard(prerequisiteMap[course]));
	conv.ask('Is there anything else you would like to know for this course?', new Suggestions('Contact Details', 'Quiz', 'Weekly Reviews'));
});

app.intent('course.quiz.start', (conv) => {
	conv.ask('Lets begin.');
	sayQuestion(conv);
});

app.intent(['course.quiz.q1correct', 'course.quiz.q2correct', 'course.quiz.q3correct', 'course.quiz.q4correct'], (conv) => {
	sayCorrect(conv);
	sayQuestion(conv);
});

app.intent('course.quiz.q5correct', (conv) => {
	sayCorrect(conv);
	sayFinalScore(conv);
	conv.ask('Is there anything else you would like to know for this course?', new Suggestions('Contact Details', 'Quiz', 'Weekly Reviews'));
});

app.intent(['course.quiz.q1incorrect', 'course.quiz.q2incorrect', 'course.quiz.q3incorrect', 'course.quiz.q4incorrect'], (conv) => {
	sayIncorrect(conv);
	sayQuestion(conv);
});

app.intent('course.quiz.q5incorrect', (conv) => {
	sayIncorrect(conv);
	sayFinalScore(conv);
});

app.intent('course.contact', (conv) => {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	conv.ask('Here are the contact details for ' + course + '.', new BasicCard(contactMap[course]));
	conv.ask('Is there anything else you would like to know for this course?', new Suggestions('Prerequisites', 'Quiz', 'Weekly Reviews'));
});

app.intent('course.summary', (conv) => {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	var week = sessionContext.parameters.week;
	var review = course + ' ' + week;
	conv.ask('Here is a summary of ' + course + ' ' + week + '.', new BasicCard(courseSummaryMap[review]));
	if (week == 'week 1') {
		conv.ask(new Suggestions('Agile Definition', 'Deep work', 'Gamification'));
	}
	else {
		conv.ask(new Suggestions('Scrum Definition', 'Scrum Ceremonies', 'Responsibilities'));
	}
});

app.intent('infs3605week1', (conv, {reviewcontent1}) => {
  const reviewcontent = reviewcontent1;
  const content = infs3605week1reviewcontent[reviewcontent1].text;
  // Present user with the corresponding basic card and gives suggestions
  conv.ask('Here\'s the information on. ' + reviewcontent + content + 'Would you like information on other topics? ', new BasicCard(infs3605week1reviewcontent[reviewcontent1]));
  conv.ask(new Suggestions('Agile Definition', 'Deep work', 'Gamification'));
 });

app.intent('infs3605week2', (conv, {reviewcontent2}) => {
  const reviewcontent = reviewcontent2;
  const content = infs3605week2reviewcontent[reviewcontent2].text;
  // Present user with the corresponding basic card and gives suggestions
  conv.ask('Here\'s the information on. ' + reviewcontent + content + 'Would you like information on other topics? ', new BasicCard(infs3605week2reviewcontent[reviewcontent2]));
  conv.ask(new Suggestions('Scrum Definition', 'Scrum Ceremonies', 'Responsibilities'));
 });

//Function to return final score
function sayFinalScore(conv) {
	var sessionContext = conv.contexts.get('session-vars')
	var score1 = parseInt(sessionContext.parameters.score1);
	var score2 = parseInt(sessionContext.parameters.score2);
	var score3 = parseInt(sessionContext.parameters.score3);
	var score4 = parseInt(sessionContext.parameters.score4);
	var score5 = parseInt(sessionContext.parameters.score5);
	var finalScore = score1+score2+score3+score4+score5;
	conv.ask('Your final score is ' + finalScore + ' out of 5');
}

function sayQuestion(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	var week = sessionContext.parameters.week;
	var difficulty = sessionContext.parameters.difficulty;
	var questionNumber = parseInt(sessionContext.parameters.questionNumber);
	switch (course) {
		case "INFS3605":
			switch (week) {
				case "week 1":
					switch (difficulty) {
						case "easy":
							switch (questionNumber) {
								case 1:
									conv.ask('True or False: The Daily Scrum should be skipped if there is nothing interesting to talk about.');
						    		conv.ask(new Suggestions('True', 'False'));
						    		break;
						    	case 2:
									conv.ask('What should be created during the first half of the Sprint Planning Meeting?');
						    		conv.ask(new Suggestions('Sprint Goal', 'Sprint Backlog', 'Product Backlog'));
						    		break;
						    	case 3:
									conv.ask('Who is allowed to change the Sprint Backlog during the sprint?');
						    		conv.ask(new Suggestions('Development Team', 'Product Owner', 'Scrum Master'));
						    		break;
						    	case 4:
						    		conv.ask('True or False: The Product Owners responsibility is to work with stakeholders to determine product features.');
						    		conv.ask(new Suggestions('True', 'False'));
						    		break;
						    	case 5:
						    		conv.ask('True or False: A characteristic of a Scrum Master is to be supportive.');
						    		conv.ask(new Suggestions('True', 'False'));
						    		break;
							}
							break;
						case "medium":
							switch (questionNumber) {
								case 1:
									conv.ask('infs3605w1q1medium');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 2:
									conv.ask('infs3605w1q2medium');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 3:
									conv.ask('infs3605w1q3medium');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 4:
						    		conv.ask('infs3605w1q4medium');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 5:
						    		conv.ask('infs3605w1q5medium');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    }
						    break;
						case "hard":
							switch (questionNumber) {
								case 1:
									conv.ask('infs3605w1q1hard');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 2:
									conv.ask('infs3605w1q2hard');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 3:
									conv.ask('infs3605w1q3hard');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 4:
						    		conv.ask('infs3605w1q4hard');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    	case 5:
						    		conv.ask('infs3605w1q5hard');
						    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
						    		break;
						    }
						    break;
					}
					break;
				case "week 2":
					switch (questionNumber) {
						case 1:
							conv.ask('infs3605w2q1');
				    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    		break;
				    	case 2:
							conv.ask('infs3605w2q2');
				    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    		break;
				    	case 3:
							conv.ask('infs3605w2q3');
				    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    		break;
				    	case 4:
				    		conv.ask('infs3605w2q4');
				    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    		break;
				    	case 5:
				    		conv.ask('infs3605w2q5');
				    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    		break;
					}
					break;
			}
			break;
		case "INFS1603":
			switch (questionNumber) {
				case 1:
					conv.ask('infs1603 q1');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 2:
					conv.ask('infs1603 q2');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 3:
					conv.ask('infs1603 q3');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 4:
					conv.ask('infs1603 q4');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 5:
					conv.ask('infs1603 q5');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
			}
			break;
		case "INFS1609":
			switch (questionNumber) {
				case 1:
					conv.ask('INFS1609 q1');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 2:
					conv.ask('INFS1609 q2');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 3:
					conv.ask('INFS1609 q3');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 4:
					conv.ask('INFS1609 q4');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 5:
					conv.ask('INFS1609 q5');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
			}
			break;
		case "INFS2605":
			switch (questionNumber) {
				case 1:
					conv.ask('INFS2605 q1');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 2:
					conv.ask('INFS2605 q2');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 3:
					conv.ask('INFS2605 q3');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 4:
					conv.ask('INFS26053 q4');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 5:
					conv.ask('INFS2605 q5');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
			}
			break;
		case "INFS3634":
			switch (questionNumber) {
				case 1:
					conv.ask('INFS3634 q1');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 2:
					conv.ask('INFS3634 q2');
		    		conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
		    		break;
		    	case 3:
					conv.ask('INFS3634 q3');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 4:
					conv.ask('INFS3634 q4');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
				case 5:
					conv.ask('INFS3634 q5');
				    conv.ask(new Suggestions('suggestion 1', 'suggestion 2', 'suggestion 3'));
				    break;
			}
			break;
	}
}

function sayCorrect(conv) {
	const audioSound = 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg';
	conv.ask(`<speak><audio src="${audioSound}" clipEnd="2s"></audio>Correct!</speak>`);
}

function sayIncorrect(conv) {
	const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
	conv.ask(`<speak><audio src="${audioSound}"></audio>Incorrect.</speak>`);
}

function sayCorrectDuo(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var questionNumber = sessionContext.parameters.questionNumber;
	const audioSound = 'https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_stutter.ogg';

	if (questionNumber == "x" ) {
		conv.ask(`<speak><audio src="${audioSound}" clipEnd="2s"></audio>Correct!</speak>`);
	} else {
		conv.ask(`<speak><audio src="${audioSound}" clipEnd="2s"></audio>Correct! ` + getPlayerName(conv) + 's turn.</speak>');
	}
}

function sayIncorrectDuo(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var questionNumber = sessionContext.parameters.questionNumber;
	const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';

	if (questionNumber == "x" ) {
		conv.ask(`<speak><audio src="${audioSound}" clipEnd="2s"></audio>Incorrect.</speak>`);
	} else {
		conv.ask(`<speak><audio src="${audioSound}" clipEnd="2s"></audio>Incorrect. ` + getPlayerName(conv) + 's turn.</speak>');
	}
}

function getPlayerName(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var nameP1 = sessionContext.parameters.player1name;
	var nameP2 = sessionContext.parameters.player2name;
	var questionNumber = sessionContext.parameters.questionNumber;
	if (questionNumber.substring(1,3) == "p1") {
		return nameP1;
	} else {
		return nameP2;
	}
}

function sayQuestionDuo(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	var week = sessionContext.parameters.week;
	var questionNumber = sessionContext.parameters.questionNumber;
	switch (course) {
		case "INFS3605":
			switch (questionNumber) {
				case "1p1":
					conv.ask('True or False: The Daily Scrum should be skipped if there is nothing interesting to talk about.');
		    		conv.ask(new Suggestions('True', 'False'));
		    		break;
		    	case "1p2":
					conv.ask('What should be created during the first half of the Sprint Planning Meeting?');
		    		conv.ask(new Suggestions('Sprint Goal', 'Sprint Backlog', 'Product Backlog'));
		    		break;
		    	case "2p1":
					conv.ask('Who is allowed to change the Sprint Backlog during the sprint?');
		    		conv.ask(new Suggestions('Development Team', 'Product Owner', 'Scrum Master'));
		    		break;
		    	case "2p2":
		    		conv.ask('True or False: The Product Owners responsibility is to work with stakeholders to determine product features.');
		    		conv.ask(new Suggestions('True', 'False'));
		    		break;
		    	case "3p1":
		    		conv.ask('True or False: A characteristic of a Scrum Master is to be supportive.');
		    		conv.ask(new Suggestions('True', 'False'));
		    		break;
		    	case "3p2":
					conv.ask('What constitutes the Sprint Backlog and is often estimated in hours?');
		    		conv.ask(new Suggestions('User Stories', 'Features', 'Tasks'));
		    		break;
		    	case "4p1":
		    		conv.ask('True or False: Sprint retrospective is a Scrum cycle activity?');
		    		conv.ask(new Suggestions('True', 'False'));
		    		break;
		    	case "4p2":
		    		conv.ask('True or False: Scrum has a role called “project manager”.');
		    		conv.ask(new Suggestions('True', 'False'));
		    		break;
		    	case "5p1":
					conv.ask('What should be created during the first half of the Sprint Planning Meeting?');
		    		conv.ask(new Suggestions('Sprint Goal', 'Sprint Backlog', 'Product Backlog'));
		    		break;
		    	case "5p2":
					conv.ask('Who is allowed to change the Sprint Backlog during the sprint?');
		    		conv.ask(new Suggestions('Development Team', 'Product Owner', 'Scrum Master'));
		    		break;
			}
	}
}

function sayFinalScoreDuo(conv) {
	var sessionContext = conv.contexts.get('session-vars');

	var score1p1 = parseInt(sessionContext.parameters.score1p1);
	var score2p1 = parseInt(sessionContext.parameters.score2p1);
	var score3p1 = parseInt(sessionContext.parameters.score3p1);
	var score4p1 = parseInt(sessionContext.parameters.score4p1);
	var score5p1 = parseInt(sessionContext.parameters.score5p1);
	var finalScoreP1 = score1p1+score2p1+score3p1+score4p1+score5p1;

	var score1p2 = parseInt(sessionContext.parameters.score1p2);
	var score2p2 = parseInt(sessionContext.parameters.score2p2);
	var score3p2 = parseInt(sessionContext.parameters.score3p2);
	var score4p2 = parseInt(sessionContext.parameters.score4p2);
	var score5p2 = parseInt(sessionContext.parameters.score5p2);
	var finalScoreP2 = score1p2+score2p2+score3p2+score4p2+score5p2;

	var nameP1 = sessionContext.parameters.player1name;
	var nameP2 = sessionContext.parameters.player2name;
	var scoreString = nameP1 + ' scored ' + finalScoreP1 + ' out of 5 and ' + nameP2 + ' scored ' + finalScoreP2 + ' out of 5.';

	if (finalScoreP1 > finalScoreP2) {
		conv.ask('Thats game and ' + nameP1 + ' wins! ' + scoreString);
	} else if (finalScoreP1 < finalScoreP2) {
		conv.ask('Thats game and ' + nameP2 + ' wins! ' + scoreString);
	} else {
		conv.ask('Thats game and wow its a tie! You both scored ' + finalScoreP1 + ' out of 5!');
	}
}

function sayCourseInformation(conv) {
	var sessionContext = conv.contexts.get('session-vars');
	var course = sessionContext.parameters.course;
	switch (course) {
		case "INFS1603":
			conv.ask('INFS1603 is a foundational (Level 1) Information Systems (IS) course that introduces students to the concepts, techniques, and technologies relevant for creating and managing business databases.');
    		conv.ask('Would you like some more information on contact details and pre requisities for this course?');
    		conv.ask(new Suggestions('Contact Details', 'Prerequisites', 'Weekly Reviews'));
    		break;
    	case "INFS1609": 
    		conv.ask('INFS1609 is a foundational (Level 1) Information Systems (IS) course that introduces students to application programming.');
    		conv.ask('Would you like some more information on contact details and pre requisities for this course?');
    		conv.ask(new Suggestions('Contact Details', 'Prerequisites', 'Weekly Reviews'));
    		break;
    	case "INFS2605":
    		conv.ask('INFS2605 is a Level 2 Information Systems (IS) course that continues students’ study of IS by furthering their knowledge and skills in relation to business application development.');
		    conv.ask('Would you like some more information on contact details and pre requisities for this course?');
    		conv.ask(new Suggestions('Contact Details', 'Prerequisites', 'Weekly Reviews'));
		    break;
		case "INFS3605":
		    conv.ask('INFS3605 is a Level 3 Information Systems course that concludes the students’ study of I.S. through the application, integration and synthesis of students’ knowledge from previous IS courses.');
		    conv.ask('Would you like some more information on contact details and pre requisities for this course?');
    		conv.ask(new Suggestions('Contact Details', 'Prerequisites', 'Weekly Reviews'));
		    break;
		case "INFS3634":
			conv.ask('INFS3634 is a Level 3 Information Systems (IS) course that continues your study of IS by furthering your knowledge and skills in relation to mobile application development.');
		    conv.ask('Would you like some more information on contact details and pre requisities for this course?');
    		conv.ask(new Suggestions('Contact Details', 'Prerequisites', 'Weekly Reviews'));
		    break;
		}
}

const assessmentTimelineList = () => {
  const list = new List({
  title: 'Assessment Timeline',
  items: {
    // Add the first item to the list
    'FINS2643 Mid-Sem (20%)': {
      title: 'FINS2643 Mid-Sem (20%)',
      description: 'Date: 19 March 2019',
      image: new Image({
        url: 'https://i.imgur.com/kzSAODd.png',
        alt: 'Individual',
      }),
    },
    'INFS3605 Assignment 1 (25%)': {
      title: 'INFS3605 Assignment 1 (25%)',
      description: 'Date: 20 March 2019',
      image: new Image({
        url: 'https://i.imgur.com/kzSAODd.png',
        alt: 'Individual',
      }),
    },
    'INFS3617 Group Report (15%)': {
      title: 'INFS3617 Group Report (15%)',
      description: 'Date: 10 April 2019',
      image: new Image({
        url: 'https://i.imgur.com/R5JVX4S.png',
        alt: 'Group',
      }),
    },
    // Add the second item to the list
    'INFS3605 Assignment 2 (30%)': {
      title: 'INFS3605 Assignment 2 (30%)',
      description: 'Date: 17 April 2019',
      image: new Image({
        url: 'https://i.imgur.com/kzSAODd.png',
        alt: 'Individual',
      }),
    },
    // Add the third item to the list
    'INFS3605 Group Project (30%)': {
      title: 'INFS3605 Group Project (30%)',
      description: 'Date: 24 April 2019',
      image: new Image({
        url: 'https://i.imgur.com/R5JVX4S.png',
        alt: 'Group',
      }),
    },
    'FINS2643 Financial Plan (10%)': {
      title: 'FINS2643 Financial Plan (10%)',
      description: 'Date: 26 April 2019',
      image: new Image({
        url: 'https://i.imgur.com/kzSAODd.png',
        alt: 'Individual',
      }),
    },
 }});
 return list;
};

const assessmentMap = {
  'INFS3605 Assignment 1 (25%)' : {
    title: 'INFS3605 Assignment 1 (25%)', 
    subtitle: 'Date: 20 March 2019',
    text: 'For this assessment you are expected to provide a comprehensive report, detailing the skills development that you have engaged in during the discovery phase and also intend to complete during the rest of the course.',
  },
  'INFS3605 Assignment 2 (30%)' : {
    title: 'INFS3605 Assignment 2 (30%)',
    subtitle: 'Date: 17 April 2019',
    text: 'For this assessment you are expected to provide a comprehensive report, detailing the skills development that you have engaged in during the discovery phase and also intend to complete during the rest of the course.',
  },
   'INFS3605 Group Project (30%)' : {
    title: 'INFS3605 Group Project (30%)',
    subtitle: 'Date: 24 April 2019',
    text: 'For this assessment you are expected to provide a comprehensive report, detailing the skills development that you have engaged in during the discovery phase and also intend to complete during the rest of the course.',
  },
};

const courseInformationMap = {
  'INFS3605' : {
    title: 'INFS3605', 
      text: 'This is a Level 3 Information Systems (IS) course that concludes the students’ study of IS through the application, integration and synthesis of students’ knowledge from previous IS courses  \nCourse Outline: https://www.business.unsw.edu.au/degrees-courses/course-outlines/INFS3605',
  },
  'INFS3634' : {
    title: 'INFS3634',
    text: 'This is a Level 3 Information Systems (IS) course that continues your study of IS by furthering your knowledge and skills in relation to mobile application development  \n Course Outline: https://www.business.unsw.edu.au/degrees-courses/course-outlines/INFS3634',
  },
   'INFS2605' : {
    title: 'INFS2605',
    text: 'This is a Level 2 Information Systems (IS) course that continues students’ study of IS by furthering their knowledge and skills in relation to business application development.  \n Course Outline: https://www.business.unsw.edu.au/degrees-courses/course-outlines/INFS2605',
  },
  'INFS1609' : {
    title: 'INFS1609',
    text: 'This is a foundational (Level 1) Information Systems (IS) course that introduces students to application programming.  \n Course Outline: https://www.business.unsw.edu.au/degrees-courses/course-outlines/INFS1609',
  },
  'INFS1603' : {
    title: 'INFS1603',
    text: 'This is a foundational (Level 1) Information Systems (IS) course that introduces students to the concepts, techniques, and technologies relevant for creating and managing business databases..  \n Course Outline: https://www.business.unsw.edu.au/degrees-courses/course-outlines/INFS1603',
  },
};



const prerequisiteMap = {
  'INFS1603': {
  	title: 'INFS1603 Prerequisites',
    text: 'INFS1603 requires no pre-requisites  \nhttps://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS1603',
    //buttons:{
      //title: 'Handbook 2019',
     // url: 'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS1603',
    //},
  },
  'INFS1609': {
  	title: 'INFS1609 Prerequisites',
    text: 'INFS1609 requires no pre-requisites  \nhttps://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS1609',
    //buttons:{
      //title: 'Handbook 2019',
     // url: 'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS1609',
    //},
  },
  'INFS2605': {
  	title: 'INFS2605 Prerequisites',
    text: 'Prerequisite: (INFS1603 AND INFS1609) OR (INFS1603 AND INFS2609)  \nhttps://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS2605',
    //buttons:{
      //title: 'Handbook 2019',
     // url: 'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS2605',
    //},
  },
  'INFS3605': {
  	title: 'INFS3605 Prerequisites',
    text: 'Prerequisite: INFS3634 or INFS3611 AND completion of 72 UOC.  \nhttps://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS3605',
    //buttons:{
      //title: 'Handbook 2019',
     // url: 'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS3605',
    //},
  },
  'INFS3634': {
  	title: 'INFS3634 Prerequisites',
    text: 'INFS2605 AND completion of 72 UOC within that program.  \nhttps://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS3634',
    //buttons:{
      //title: 'Handbook 2019',
     // url: 'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/INFS3634',
    //},
  },
};



const contactMap = {
  'INFS1603': {
  	title: 'INFS1603 Contact Details',
    text: 'Dr. George Joukhadar  \nEmail: g.joukhadar@unsw.edu.au  \nLocation: Room 2115, Quad Building Level 2 (Ref E15)  \nConsultation Times: Monday 2-3PM',
    image: {
      url: 'https://i.imgur.com/gNGnUHi.jpg',
      accessibilityText: 'Dr. George Joukhadar',
    },
  },
  'INFS1609': {
  	title: 'INFS1609 Contact Details',
    text: 'Lecturer-in-Charge: Dr. Yenni Tim  \nEmail: yenni.tim@unsw.edu.au  \nLocation: Room 2085, Quad Building Level 2 (Ref E15)  \nConsultation Times: TBA',
    image: {
      url: 'https://i.imgur.com/23CWRTH.jpg',
      accessibilityText: 'Dr. Yenni Tim',
    },
  },
  'INFS2605': {
  	title: 'INFS2605 Contact Details',
    text: 'Lecturer-in-Charge: Dr. Michael C. Cahalane  \nEmail: m.cahalane@unsw.edu.au  \nLocation: Quad Building Level 2, Room 2113 (Building Ref E12)  \nConsultation Times: TBA',
    image: {
      url: 'https://i.imgur.com/m3P3iw4.png',
      accessibilityText: 'Dr. Michael C. Cahalane',
    },
  },
  'INFS3605': {
    title: 'INFS3605 Contact Details',
    text: 'Lecturer-in-Charge: Dr. Michael C. Cahalane  \nEmail: m.cahalane@unsw.edu.au  \nLocation: Quad Building Level 2, Room 2113 (Building Ref E12)  \nConsultation Times: Wednesday 6-7pm',
    image: {
      url: 'https://i.imgur.com/m3P3iw4.png',
      accessibilityText: 'Dr. Michael C. Cahalane',
  	},
  },
  'INFS3634': {
  	title: 'INFS3634 Contact Details',
    text: 'Lecturer-in-Charge: Mr. Julian Prester  \nEmail: j.prester@unsw.edu.au  \nLocation: Room 2092, Quad Building Level 2 (Ref E12)  \nConsultation Time: Monday 10-11AM',
    image: {
      url: 'https://i.imgur.com/YOnCNS5.png',
      accessibilityText: 'Mr. Julian Prester',
    },
  },
};

//mapping of 3605 weekly summary
const courseSummaryMap = {
  'INFS3605 week 1': {
    title: 'Week 1 Review',
    text: 'The main topics that were talked about in INFS3605 week 1 includes: definition of Agile, Deep work, and Gamification.',
    image : {
      url: 'https://i.imgur.com/Qyois1b.gif',
      accessibilityText: 'Agile Scrum',
	},
  //buttons:{
    //title: 'Agile Scrum',
    //url: 'https://www.youtube.com/watch?v=aQrsVfjbQZ4',
  //},
  },
  'INFS3605 week 2': {
    title: 'Week 2 Review',
    text: 'Topics covered in INFS3605 week 2 include the discovery phase. The discovery phase is the information-gathering time period which is meant to uncover details into what is important and required by the client and final user. Carrying out user research and mapping the customer journey will allow the team to better understand the requirements behind the project.',
	},    
};

//Mapping of review content week 1 INFS3605
const infs3605week1reviewcontent = {
  'Agile Definition' : {
    title: 'Agile Definition', 
      text: 'Agile is a framework of approaches and behaviours that encourage “just-in-time” production that enables customers to receive quality software sooner.',

      image : {
      url: 'https://i.imgur.com/Xemt6fo.jpg',
      accessibilityText: 'Agile Framework',

  },

  },
  'Deep Work' : {
    title: 'Deep work',
    text: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information and produce better results in less time.',

    image : {
      url: 'https://i.imgur.com/3B63kK8.png',
      accessibilityText: 'Deep Work',

  },

  },
  'Gamification' : {
    title: 'Gamification',
    text: 'Gamification refers to designing products, services and organisational practices to afford similar experiences to games, and consequently, to attempt to create value and affect people’s behaviour.',
    
    image : {
      url: 'https://i.imgur.com/ZyszUoR.png',
      accessibilityText: 'Deep Work',
  },
},
};
//Mapping of review content week 2 
const infs3605week2reviewcontent = {
  'Scrum Definition' : {
    title: 'Definition of Scrum', 
      text: 'The rules and practices for Scrum is a simple process for managing complex projects which are few, straightforward, and easy to learn.  \nBut Scrum’s simplicity itself lack of prescription and can be disarming. New practitioners often find themselves reverting to old project management habits and tools and yielding lesser results.',

      image : {
      url: 'https://i.imgur.com/iyVqm7k.gif',
      accessibilityText: 'Scrum Definition',

    },
  },
  'Scrum Ceremonies' : {
    title: 'Scrum Ceremonies',
    text: 'The 4 Scrum Ceremonies Includes Sprint Planning Meeting, Daily Scrum, Sprint Review and Retrospective Meeting.',

    image : {
      url: 'https://i.imgur.com/d4TH1JY.png',
      accessibilityText: '4 Scrum Ceremonies',

    },
  },
  'Responsibilities' : {
    title: 'Responsibilities',
    text: 'The Product Owner represents the voice of customers and will communicate with clients, customers and stakeholders to ensure the team is delivering value.  \nThe Scrum Master is the facilitator and helps the team to deliver the sprint goals.  \nThe Team is cross-functional and is responsible for delivering the product.',
    
    image : {
      url: 'https://i.imgur.com/SnsIl4h.png',
      accessibilityText: ' Member Responsibilities',

  },
  },
};

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
