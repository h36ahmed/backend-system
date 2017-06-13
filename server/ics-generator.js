const ICS = require('ics');
const fs = require('fs')
const uuid = require('uuid')
const moment = require('moment')

const ics = new ICS();

const formatTime = (time) => {
  let hours = parseInt(time.split(' ')[0].split(':')[0])
  let minutes = parseInt(time.split(' ')[0].split(':')[1])
  const amOrPm = time.split(' ')[1]

  if (hours < 10) {
    hours = `0${hours}`
  }

  if (minutes < 10) {
    minutes = `0${minutes}`
  }

  if (amOrPm.toLowerCase() === 'pm') {
    hours = hours + 12
  }

  return `${hours}${minutes}`
}

exports.generateICS = (attributes) => {
  const start_time = formatTime(attributes.pick_up_time.split(' to ')[0])
  const end_time = formatTime(attributes.pick_up_time.split(' to ')[1])
  const customerName = `${attributes.name} ${attributes.last_name}`

  // utc = 'Tue, 13 Jun 2017 00:35:26 GMT'
  // datetime = yyyymmddThhmm
  // iso8601 = yyyymmdd

  // ics needs to be an array of strings

  // const icsData = ics.buildEvent({
  //   // uid: 'abc123', // (optional)
  //   start: `${attributes.ICSDate.split('-').join('')}T${start_time}`,
  //   end: `${attributes.ICSDate.split('-').join('')}T${end_time}`,
  //   title: `Meal Reserved for ${attributes.date}`,
  //   description: `Your meal, ${attributes.meal.name}, is reserved at ${attributes.restaurant.name} at ${attributes.restaurant.street_address}`,
  //   location: `${attributes.restaurant.street_address}, ${attributes.restaurant.city}, ${attributes.restaurant.postal_code}`,
  //   url: '',
  //   status: 'tentative',
  //   geo: { lat: attributes.restaurant.latitude, lon: attributes.restaurant.longitude },
  //   attendees: [
  //     { name: attributes.name, email: attributes.email }
  //   ],
  //   organizer: {
  //     name: attributes.restaurant.name,
  //     email: ''
  //   },
  //   categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
  //   alarms:[
  //     { action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' },
  //     { action: 'AUDIO', trigger: '-PT30M' }
  //   ]
  // });
console.log(`${moment().utc().format('YYYYMMDDTHHmmss')}Z`)
  const icsData =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Adam Gibbons//agibbons.com//ICS: iCalendar Generator
BEGIN:VEVENT
UID:${uuid.v1()}
DTSTAMP:
DTSTART:
DTEND:
SUMMARY:
DESCRIPTION:
LOCATION:
STATUS:TENTATIVE
GEO:${attributes.restaurant.latitude};${attributes.restaurant.longitude}
ATTENDEE;CN=
END:VEVENT
END:VCALENDAR`


  fs.writeFile('./Users/event.ics', icsData, err => { console.log('error', err) })
}

//  EXAMPLE
/*
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Adam Gibbons//agibbons.com//ICS: iCalendar Generator
BEGIN:VEVENT
UID:acff4b90-4fd5-11e7-8c3f-4bfada1adff8
DTSTAMP:20170613T011440Z
DTSTART:20170608T113000Z
DTEND:20170608T114500
SUMMARY:Meal Reserved for June 08, 2017
DESCRIPTION:Your meal, Malaysian Fried Sambal Udon, is reserved at Kaiju at 384 Yonge Street
LOCATION:384 Yonge Street, Toronto, M5B241
STATUS:tentative
GEO:56.130366;-106.346771
ATTENDEE;CN=Jeffrey:mailto:jeffreycj.chang@gmail.com
CATEGORIES:10k races,Memorial Day Weekend,Boulder CO
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT24H
DESCRIPTION:Reminder
REPEAT:1
DURATION:PT15M
END:VALARM
BEGIN:VALARM
ACTION:AUDIO
TRIGGER:-PT30M
END:VALARM
END:VEVENT
END:VCALENDAR
*/