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
    {
      name: 'Soren Kierkegaard',
      id: '3456',
      description: 'Research and Revelopement', // optional
      // titleClick: titleClick, //optional
      // dayHeaderClick: dayHeaderClick,
      // eventClick: eventClick,
    },
    {
      name: 'Jacques Derrida',
      id: '4567',
      description: 'Research and Revelopement', // optional
      // titleClick: titleClick, //optional
      // dayHeaderClick: dayHeaderClick,
      // eventClick: eventClick,
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
