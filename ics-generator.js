var ICS = require('ics');
var fs = require('fs')
var path = require('path')
var ics = new ICS();

let test = ics.buildEvent({
  // uid: 'abc123', // (optional)
  start: '2016-05-30 06:50',
  end: '2016-05-30 15:00',
  title: 'Bolder Boulder',
  fileName: 'example.ics',
  description: 'Annual 10-kilometer run in Boulder, Colorado',
  location: 'Folsom Field, University of Colorado (finish line)',
  url: 'http://www.bolderboulder.com/',
  status: 'tentative',
  geo: { lat: 40.0095, lon: 105.2669 },
  attendees: [
    { name: 'Adam Gibbons', email: 'adam@example.com' },
    { name: 'Brittany Seaton', email: 'brittany@example2.org' }
  ],
  organizer: {
    name: 'Jeffrey Chang',
    email: 'jeffreycj.chang@gmail.com'
  },
  categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
  alarms:[
    { action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' },
    { action: 'AUDIO', trigger: '-PT30M' }
  ]
});

fs.writeFile('./users/event.ics', test, err => {})