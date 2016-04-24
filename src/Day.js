import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import Event from './Event';

// Checks whether obj1 and obj2 have the same property values.
function shallowIsSame(obj1, obj2) {
  const keys = Object.keys(obj1).concat(Object.keys(obj2));
  for (const key of keys) {
    if (obj1[key].toString() !== obj2[key].toString()) {
      return false;
    }
  }
  return true;
}

const DAY_CLASS = '-day';
export default class Day extends ModelView {
  constructor(date, parentClass) {
    // Create HTML part with SuperClass
    const html = [
      { name: 'header', tag: 'header' },
      { name: 'events' },
    ];
    super(html, DAY_CLASS, parentClass);

    this.date = null;
    this.start = null;
    this.end = null;

    // The order of this array doesn't matter.
    this.events = [];

    // This is where the events config object will be stored.
    this.eventsObj = {};

    Object.preventExtensions(this);
    // -------- end of attribute creation ---------

    this.setDate(date);
  }

  updateHeader() {
    this.html.header.textContent = DateHandler.format(this.date);
  }

  addEvent(eventInfo) {
    const newEvent = new Event(eventInfo, this.class);
    assert(newEvent && newEvent.html && newEvent.html.container,
      'New Event instance initialised without an HTML container.');

    // Insert new event in the right place in the HTML.
    let insertedBeforeEvent = false;
    for (const event of this.events) {
      const timeDiff = DateHandler.diff(
        event.getStartTime(),
        newEvent.getStartTime(),
        'minutes'
      );
      const eventStartsAfter = timeDiff < 0;
      if (eventStartsAfter) {
        const oldEventIndex = this.events.indexOf(event);
        assert(typeof oldEventIndex === 'number',
          'Weird bug in time comparison.');
        insertedBeforeEvent = true;

        // insert before event that starts later.
        this.html.events.insertBefore(
          newEvent.html.container,
          event.html.container
        );
      }
    }

    if (!insertedBeforeEvent) {
      // Either there are no events in this.events or all
      // of them begin before newEvent.
      this.html.events.appendChild(newEvent.html.container);
    }

    // Now add it to the events array.
    this.events.push(newEvent);
  }

  setEvents(newEventsObj) {
    assert.warn(typeof newEventsObj === 'object',
      `Invalid events object, clearing all events from day ${this.date.toString()}.`);
    // TODO: Implement this instead of addEvent and clearEvents
    // and make sure that it doesn't reload the HTML for the same set
    // of events.

    // The day is being updated to have the same events, so we don't
    // have to change anything.
    if (shallowIsSame(this.eventsObj, newEventsObj)) { return; }
    this.clearEvents();
    for (const event of newEventsObj) {
      this.addEvent(event);
    }
  }

  getDate() {
    return this.date;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  // Expects a date object
  setDate(newDate) {
    assert(typeof newDate === 'object', 'No date object provided.');
    this.date = newDate;
    this.start = DateHandler.startOf(this.date, 'day');
    this.end = DateHandler.endOf(this.date, 'day');
    this.updateHeader();
    this.todayColor();
  }

  clearEvents(events = this.events) {
    const eventsNo = events.length;
    for (let i = 0; i < eventsNo; i++) {
      let event = events.pop(); // Remove JS reference
      event.html.container.remove(); // Remove DOM reference
      event = null; // Make object available to be garbage collected
    }
  }

  // Assigns a different color to the container if
  // this instance represents today's date
  todayColor(date = this.date) {
    if (DateHandler.sameDay(date, new Date())) {
      this.html.container.classList.add(`${this.class}-today`);
    } else {
      this.html.container.classList.remove(`${this.class}-today`);
    }
  }
}
