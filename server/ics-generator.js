const fs = require('fs')
const uuid = require('uuid')
const moment = require('moment')

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

const formatDate = (date) => {
  console.log('date', date)
  console.log('split date', date.split('T'))
  console.log('split date[0]', date.split('T')[0])
  console.log('split date[0].split', date.split('T')[0].split('-'))
  console.log('split date[0].split.join', date.split('T')[0].split('-').join(''))

  let splitDate = date.split('T')

  return `${splitDate[0]}${splitDate[2]}${splitDate[1]}`
}

exports.generateICS = (attributes) => {
  const start_time = formatTime(attributes.pick_up_time.split(' to ')[0])
  const end_time = formatTime(attributes.pick_up_time.split(' to ')[1])
  const date = formatDate(attributes.date)

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
SUMMARY:Meal reserved for ${moment(attributes.date).format('MMMM DD, YYYY')}
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

  fs.writeFileSync('./server/routes/icsData/event.ics', icsData)
}