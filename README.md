# fl-multi-calendar-2
[![Build Status](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2.svg?branch=master)](https://travis-ci.org/fourlabsldn/fl-multi-calendar-2)

Visualise multiple calendars at once

To use it you will need three elements:
- [x-div](https://github.com/fourlabsldn/x-div) with MultiCalendar as the controller
- The CSS for the calendar (which is in the build folder)
- A configuration object

**Read the [Docs](http://fourlabsldn.github.io/fl-multi-calendar-2/)**
## Configuration object

In the HTML, add your `x-div` element with `fl-multi-calendar-2.js` as the `data-controller`
and make sure to add the name of your configuration object name to `data-config`.
 The configuration object must be in the global scope and must be defined before the `x-div`.

Like this:

``` HTML
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
  titleBarFormat: 'YYYY', // optional - A valid moment.js format
  dayHeaderFormat: 'dddd, MMM DD', // optional - A valid moment.js format
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
  }
 ],
}
```

## Event data

Events sent from the server should follow this structure:

``` javascript
{
   "title": "46 Hanover House,  London E14 8RH ",
   "description": "Mum's birthday",
   "start":"2016-04-25T09:00:00",
   "end":"2016-04-25T10:00:00",
   "classes": [                 // Optional. CSS classes to be attatched to the event object
     "fl-mc-event-color-black"
   ]
}
```

## DOM Events

The main wrapper emmits the following events:

- `fl-mc-loading-start` - Dispatched when an event request is sent to the server.
- `fl-mc-loading-complete` - Dispatched after events from the server finished rendering.

## Setting filters

You can add filters by calling the `setFilters` method on the global `multiCalendar` object.
It accepts an object as a parameter. The attributes and values of this object will be
sent with each request as GET parameters.

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
                        <span class="fl-mc-cal-day-event-time">09:00 - 18:00</span>
                        <span class="fl-mc-cal-day-event-title">Simple title</span>
                        <span class="fl-mc-cal-day-event-tooltip">LOL</span>
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

## Deploy docs
```
npm run deploy-gh-pages
```
