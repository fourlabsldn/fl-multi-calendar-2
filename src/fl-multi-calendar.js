/* globals xController */

import MultiCalendar from './MultiCalendar';

xController((xDivEl) => {
  const multiCalendar = new MultiCalendar({
    targetElement: xDivEl,
    loadUrl: 'http://localhost:8000/demo/demoData.json',
    calendars: [{
      name: 'Karl Marx',
      id: '12345',
      description: 'Software Developer', // optional
      // titleClick: titleClick, //optional
      // dayHeaderClick: dayHeaderClick,
      // eventClick: eventClick,
    }, {
      name: 'Friedrich Hegel',
      id: '7899',
      description: 'HR Manager', // optional
      // titleClick: titleClick, //optional
      // dayHeaderClick: dayHeaderClick,
      // eventClick: eventClick,
    }, {
      name: 'Immanuel Kant',
      id: '23456',
      description: 'Research and Revelopement', // optional
      // titleClick: titleClick, //optional
      // dayHeaderClick: dayHeaderClick,
      // eventClick: eventClick,
    },
  ],
  });

  for (let i = 0; i < 5; i++) {
    multiCalendar.addDay();
  }

  console.log(multiCalendar);
});
