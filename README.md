# fl-multi-calendar
[![Build Status](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2)

## Configuration object

Example valid configuration object:

``` javascript
{
  loadUrl: 'http://localhost:5000',
  calendars: [{
    name: 'Karl Marx',
    id: '12345',
    description: 'Software Developer', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, {
    name: 'Friedrich Hegel',
    id: '7899',
    description: 'HR Manager', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, {
    name: 'Immanuel Kant',
    id: '23456',
    description: 'Research and Revelopement', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, ],
}
```

## Classes

Classes that represent an HTML element have a property called `html`, within which all of its HTML elements reside. The main wrapper is `html.container` and all classes that represent HTML elements have it.
