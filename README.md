# fl-multi-calendar-2
[![Build Status](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2)

Visualise multiple calendars at once

To use it you will need three elements:
- [x-div](https://github.com/fourlabsldn/x-div) with MultiCalendar as the controller
- The CSS for the calendar (which is in the build folder)
- A configuration object

## Configuration object

In the HTML, add your `x-div` element with `fl-multi-calendar-2.js` as the `data-controller`
and make sure to add the name of your configuration object name to `data-config`.
 The configuration object must be in the global scope and must be defined before the `x-div`.

Like this:

``` html
<x-div data-controller="/build/fl-multi-calendar" data-config="myConfigObject"></x-div>
```

Your configuration object must specify a URL where the events will be fetched and an
array of objects where each represent the configuration for one calendar in
MultiCalendar.

Example valid configuration object:

``` javascript
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

myConfigObject = {
  loadUrl: 'http://localhost:5000',
  calendars: [{
    name: 'Karl Marx',
    id: '12345',
    description: 'Software Developer', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick, //optional
    eventClick: eventClick, //optional
  }, {
    name: 'Friedrich Hegel',
    id: '7899',
    description: 'HR Manager', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick, //optional
    eventClick: eventClick, //optional
  }, {
    name: 'Immanuel Kant',
    id: '23456',
    description: 'Research and Revelopement', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick, //optional
    eventClick: eventClick, //optional
  }, ],
}
```

## Classes

Classes that represent an HTML element have a property called `html`, within which all of its HTML elements reside. The main wrapper is `html.container` and all classes that represent HTML elements have it.

## Calendar markup

Example calendar markup:
``` html
<!-- MultiCalendar -->
<main class="fl-mc fl-mc-view-weekdays">

    <!-- ControlBar -->
    <nav class="fl-mc-ctrl">
        <input class="fl-mc-ctrl-datePicker" type="week">
        <button class="fl-mc-ctrl-back"><i class="icon-chevron-left"></i></button>
        <button class="fl-mc-ctrl-forward"><i class="icon-chevron-right"></i></button>
        <button class="fl-mc-ctrl-today">Today</button>
        <button class="fl-mc-ctrl-refresh"><i class="icon-refresh"></i><i class="icon-check"></i></button>
        <p class="fl-mc-ctrl-titleBar">2016</p>
        <button class="fl-mc-ctrl-show-weekend">Show weekends</button>
    </nav>

    <!-- Calendar -->
    <section class="fl-mc-cal">
        <header class="fl-mc-cal-header">
            <h2 class="fl-mc-cal-title">Karl Marx</h2>
            <p class="fl-mc-cal-description">Software Developer</p>
        </header>
        <div class="fl-mc-cal-days">

          <!-- Day -->
            <div class="fl-mc-cal-day">
                <header class="fl-mc-cal-day-header">Wednesday, Apr 27</header>
                <div class="fl-mc-cal-day-events">

                    <!-- Event -->
                    <div class="fl-mc-cal-day-event fl-mc-event-color-red">
                        <p class="fl-mc-cal-day-event-time">09:00 - 18:00</p>
                        <p class="fl-mc-cal-day-event-title">Simple title</p>
                        <p class="fl-mc-cal-day-event-tooltip">LOL</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
```

# Install

## Bower
```
bower install fl-multi-calendar-2 --save
```

## NPM
```
npm install fl-multi-calendar-2 --save
```

## Dependencies

It only depends on the [x-div](https://github.com/fourlabsldn/x-div) web component.

## Tasks

### Demo
Will run a server and open the demo page in the browser
```
npm run demo
```

### Build
```
npm run build
```
### Dev
Runs build, demo and watches changes to build again.
```
npm run dev
```

### Test
```
npm run test
```
