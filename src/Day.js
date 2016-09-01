import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import Event from './Event';

const DAY_CLASS = '-day';
const DEFAULT_HEADER_FORMAT = 'dddd, MMM DD';

/**
 * @class Day
 * @api private
 */
export default class Day extends ModelView {
  constructor(date, parentClass, config = {}, callbacks = {}) {
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

    this.headerFormat = (typeof config.dayHeaderFormat === 'string') ?
      config.dayHeaderFormat : DEFAULT_HEADER_FORMAT;

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
    this.html.header.textContent =
      DateHandler.format(this.date, this.headerFormat);
  }

  addEvent(eventInfo) {
    const newEvent = new Event(eventInfo, this.class, this.date, this.callbacks);
    assert(newEvent && newEvent.html && newEvent.html.container,
      'New Event instance initialised without an HTML container.');

    // TODO: Check on adding new events when other events are
    // already there. This is what the commented out code is for.
    this.html.events.appendChild(newEvent.html.container);
    // Now add it to the events array.
    this.events.push(newEvent);
  }

  /**
   * @method setEvents
   * @api private
   * @param  {Array<Object>}  newEventsConfig   array of event configuration objects
   */
  setEvents(newEventsConfig = []) {
    assert.warn(Array.isArray(newEventsConfig),
      `Invalid array of configuration events,
      clearing all events from day ${this.date.toString()}.`);

    // const sameAmountOfEvents = newEventsConfig.length === this.events.length;
    // const allEventsAreSame = newEventsConfig.reduce((outcome, newEvent, newEventIdx) => {
    //   const areSameEvents = Event.areSame(newEvent, this.events[newEventIdx]);
    //   return outcome && areSameEvents;
    // }, true);
    //
    // if (sameAmountOfEvents && allEventsAreSame) { return; }

    this.clearEvents();
    newEventsConfig.forEach(newEvent => {
      this.addEvent(newEvent);
    });
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
    this._todayColor();
    this.clearEvents();
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


  /**
   *  Assigns a different class to the container if
   *  this instance represents today's date
   * @private
   * @method _todayColor
   * @param  {DateHandler}    date [optional]
   * @return {void}
   */
  _todayColor(date = this.date) {
    if (DateHandler.sameDay(date, DateHandler.newDate())) {
      this.html.container.classList.add(`${this.class}-today`);
    } else {
      this.html.container.classList.remove(`${this.class}-today`);
    }
  }
}
