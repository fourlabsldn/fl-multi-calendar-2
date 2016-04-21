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

## Calendar markup

Example calendar markup:
``` html
<!-- Main  -->
<main class="fl-mc">
  <!-- Calendar  -->
  <section class="fl-mc-cal">
    <header class="fl-mc-cal-title">

    </header>
    <section class="fl-mc-cal-days">

      <!-- Day  -->
      <div class="fl-mc-cal-days-day">
        <header class="fl-mc-cal-days-day-header">
          5th, Feb 2015
        </header>
        <div class="fl-mc-cal-days-day-events">

          <!-- Event  -->
          <div class="fl-mc-cal-days-day-events-event">
            <h1 class="fl-mc-cal-days-day-events-event-time">12:09 - 12:30</h1>
            <h2 class="fl-mc-cal-days-day-events-event-title">My event</h2>
            <p class="fl-mc-cal-days-day-events-event-description">This is a nice event description</p>
            <p class="fl-mc-cal-days-day-events-event-tooltip">Tooltip info</p>
          </div>

        </div>
      </div>
    </section>

  </section>

</main>
```
