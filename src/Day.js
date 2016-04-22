import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import Event from './Event';

const DAY_CLASS = '-day';
export default class Day extends ModelView {
  constructor(date, parentClass) {
    // Create HTML part with SuperClass
    const html = [
      { name: 'header', tag: 'header' },
      { name: 'events' },
    ];
    super(html, DAY_CLASS, parentClass);

    assert(date && typeof date === 'object',
      'No date provided for Day instantiation.');
    this.date = date;
    this.start = DateHandler.startOf(date, 'day');
    this.end = DateHandler.endOf(date, 'day');

    // The order of this array doesn't matter.
    this.events = [];

    this.updateHeader();

    this.todayColor();

    Object.freeze(this);
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

  getDate() {
    return this.date;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
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
    }
  }
}
