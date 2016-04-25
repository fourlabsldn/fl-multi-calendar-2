import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import Event from './Event';

const DAY_CLASS = '-day';
export default class Day extends ModelView {
  constructor(date, parentClass, callbacks = {}) {
    // Create HTML part with SuperClass
    const html = [
      { name: 'header', tag: 'header' },
      { name: 'events' },
    ];
    super(html, DAY_CLASS, parentClass);

    this.date = null;
    this.start = null;
    this.end = null;

    this.callbacks = callbacks;

    // The order of this array doesn't matter.
    this.events = [];

    Object.preventExtensions(this);
    // -------- end of attribute creation ---------

    if (typeof callbacks.dayHeaderClick === 'function') {
      this.html.header.addEventListener('click', () => {
        const eventConfigs = [];
        this.events.forEach((ev) => { eventConfigs.push(ev.getConfig()); });
        this.callbacks.dayHeaderClick(this.date, eventConfigs);
      });
    }

    this.setDate(date);
  }

  updateHeader() {
    this.html.header.textContent = DateHandler.format(this.date);
  }

  addEvent(eventInfo) {
    const newEvent = new Event(eventInfo, this.class, this.callbacks);
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

  setEvents(newEventsConfig) {
    assert.warn(Array.isArray(newEventsConfig),
      `Invalid array of configuration events,
      clearing all events from day ${this.date.toString()}.`);

    const diff = arrayDifference(this.events, newEventsConfig, Event.areSame);

    // Events that we have and newEventsConfig doesn't.
    const missingEvents = diff.missingFromArr2;

    // If all events must be removed.
    if (missingEvents.length === this.events.length) {
      // Use the crearEvents method as it performs better than removeEvent
      this.clearEvents();
    } else {
      for (const eventConfig of missingEvents) {
        this.removeEvent(eventConfig);
      }
    }

    // Events that newEventsConfig has and we don't.
    const newEvents = diff.missingFromArr1;
    for (const eventConfig of newEvents) {
      this.addEvent(eventConfig);
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

  removeEvent(event) {
    const idx = this.events.indexOf(event);
    if (idx >= 0) {
      this.events.splice(idx, 1);
    } else {
      assert.warn(`Trying to remove an event that was not in day.
                  Event starting ${event.start} for id ${event.id}.`);
      return;
    }
    event.html.container.remove(); // Remove DOM reference
    event = null; // Make object available to be garbage collected
  }

  // Assigns a different color to the container if
  // this instance represents today's date
  todayColor(date = this.date) {
    if (DateHandler.sameDay(date, DateHandler.newDate())) {
      this.html.container.classList.add(`${this.class}-today`);
    } else {
      this.html.container.classList.remove(`${this.class}-today`);
    }
  }

  hasEvent(eventConfig) {
    return this.events.some((x) => {
      return Event.isSame(x.config(), eventConfig);
    });
  }
}


function arrayDifference(arr1, arr2, compare) {
  // We will use a surrogate array because we will
  // modify the values that are found so they are not compared again.
  const sArr2 = Array.from(arr2);

  const missingFromArr2 = [];
  for (const el1 of arr1) {
    const el2Idx = sArr2.findIndex((el2) => {
      return compare(el1, el2);
    });

    if (el2Idx >= 0) {
      sArr2[el2Idx] = null;
    } else {
      missingFromArr2.push(el1);
    }
  }

  const missingFromArr1 = [];
  for (const el2 of sArr2) {
    // if it is one of the elements we set to null, then just skip it.
    if (!el2) { continue; }

    const match = arr1.find((el1) => {
      return compare(el1, el2);
    });

    if (!match) { missingFromArr1.push(el2); }
  }

  return {
    missingFromArr2,
    missingFromArr1,
  };
}
