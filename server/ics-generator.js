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

const formatShortDate = (date) => {
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const splitDate = date.indexOf('T') === -1 ? date.split('-') : date.split('T')[0].split('-')
  const day = splitDate[2]
  const month = monthNames[parseInt(splitDate[1], 10) - 1]
  const year = splitDate[0]

  return `${month} ${day}, ${year}`
}


exports.generateICS = (attributes) => {
  const start_time = formatTime(attributes.pick_up_time.split(' to ')[0])
  const end_time = formatTime(attributes.pick_up_time.split(' to ')[1])
  console.log('attributes data', attributes.ICSDate)
  const date = attributes.ICSDate.split('-').join('').split('T')[0]

  const icsData =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Adam Gibbons//agibbons.com//ICS: iCalendar Generator
BEGIN:VEVENT
UID:${uuid.v1()}
DTSTAMP:${moment().format('YYYYMMDDTHHmmss')}
DTSTART:${date}T${start_time}00
DTEND:${date}T${end_time}00
SUMMARY:Meal reserved for ${formatShortDate(attributes.date)}
DESCRIPTION:Your meal, ${attributes.meal.name}, is reserved at ${attributes.restaurant.name} at ${attributes.restaurant.street_address}
LOCATION:${attributes.restaurant.name}, ${attributes.restaurant.street_address}, ${attributes.restaurant.city}, ${attributes.restaurant.postal_code}
STATUS:confirmed
GEO:${attributes.restaurant.latitude};${attributes.restaurant.longitude}
ATTENDEE;CN=${attributes.name}:mailto:${attributes.email}
ORGANIZER;CN=Lunch Society:mailto:admin@lunchsociety.ca
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
END:VCALENDAR`


  fs.writeFileSync('./Users/event.ics', icsData)

}