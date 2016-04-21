import assert from './utils/assert.js';
import DateHandler from './DateHandler';
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

    assert(parentClass, 'No parent class provided.');
    this.class = parentClass + DAY_CLASS;

    // The order of this array doesn't matter.
    this.events = [];

    this.updateHeader();

    Object.freeze(this);
  }

  updateHeader() {
    this.html.header.innerHTML = DateHandler.format(this.date);
  }

  addEvent(eventInfo) {
    const newEvent = new Event(eventInfo, DAY_CLASS);
    assert(newEvent && newEvent.html && newEvent.html.container,
      'New Event instance initialised without an HTML container.');

    // Insert new event in the right place in the HTML.
    let insertedBeforeEvent = false;
    for (const event of this.events) {
      const eventStartsAfter = DateHandler.isGreater(
        event.getStartTime(),
        newEvent.getStartTime()
      );
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
}
