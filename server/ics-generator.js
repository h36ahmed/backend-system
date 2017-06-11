const ICS = require('ics');
const fs = require('fs')

const ics = new ICS();

const formatTime = (time) => {
  console.log(time)
}

exports.generateICS = (attributes) => {
  // console.log(attributes.name)
  // console.log(attributes.last_name)
  const customerName = `${attributes.name} ${attributes.last_name}`
  const icsData = ics.buildEvent({
    // uid: 'abc123', // (optional)
    start: `${attributes.ICSDate} 06:50`,
    end: `${attributes.ICSDate} 15:00`,
    title: `Meal Reserved for ${attributes.date}`,
    description: `Your meal, ${attributes.meal.name}, is reserved at ${attributes.restaurant.name} at ${attributes.restaurant.street_address}`,
    location: `${attributes.restaurant.street_address}, ${attributes.restaurant.city}, ${attributes.restaurant.postal_code}`,
    url: '',
    status: 'tentative',
    geo: { lat: attributes.restaurant.latitude, lon: attributes.restaurant.longitude },
    attendees: [
      { name: 'test', email: 'test@test.com'},
      { name: attributes.name, email: attributes.email }
    ],
    organizer: {
      name: attributes.restaurant.name,
      email: ''
    },
    categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
    alarms:[
      { action: 'DISPLAY', trigger: '-PT24H', description: 'Reminder', repeat: true, duration: 'PT15M' },
      { action: 'AUDIO', trigger: '-PT30M' }
    ]
  });
  console.log(icsData)
  fs.writeFile('./Users/event.ics', icsData, err => { console.log(err) })
}
