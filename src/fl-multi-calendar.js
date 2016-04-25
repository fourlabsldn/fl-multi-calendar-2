/* globals xController */

import MultiCalendar from './MultiCalendar';

xController((xDivEl) => {

  // //Callbacks
  function dayHeaderClick(date, events) {
    console.log('Day header click.');
    console.dir(arguments);
  }

  function eventClick(eventConfig) {
    console.log('Event click.');
    console.dir(arguments);
  }

  function titleClick(calendarConfig) {
    console.log('Title click.');
    console.dir(arguments);
  }


  const multiCalendar = new MultiCalendar({
    targetElement: xDivEl,
    loadUrl: 'http://localhost:8000/demo/demoData.json',
    calendars: [{
      name: 'Karl Marx',
      id: '12345',
      description: 'Software Developer', // optional
      titleClick,
      dayHeaderClick,
      eventClick,
    }, {
      name: 'Friedrich Hegel',
      id: '7899',
      description: 'HR Manager', // optional
      titleClick,
      dayHeaderClick,
      eventClick,
    }, {
      name: 'Immanuel Kant',
      id: '23456',
      description: 'Research and Revelopement', // optional
      titleClick,
      dayHeaderClick,
      eventClick,
    }, {
      name: 'Soren Kierkegaard',
      id: '3456',
      description: 'Research and Revelopement', // optional
      titleClick,
      dayHeaderClick,
      eventClick,
    }, {
      name: 'Jacques Derrida',
      id: '4567',
      description: 'Research and Revelopement', // optional
      titleClick,
      dayHeaderClick,
      eventClick,
    },
  ],
  });

  function setViewModeBasedOnWindowSize() {
    const currViewMode = multiCalendar.getViewMode();
    if (window.innerWidth < 850 && currViewMode !== 'oneDay') {
      multiCalendar.setViewMode('oneDay');
    } else if (window.innerWidth > 850 && currViewMode === 'oneDay' || !currViewMode) {
      multiCalendar.setViewMode('weekdays');
    }
  }

  setViewModeBasedOnWindowSize();
  window.addEventListener('resize', setViewModeBasedOnWindowSize);
});
