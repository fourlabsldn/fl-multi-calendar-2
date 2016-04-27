import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import Day from './Day';

const CALENDAR_CLASS = '-cal';

/**
 * 	@class Calendar
 * @api private
 */
export default class Calendar extends ModelView {
  constructor(config, startDate, parentClass, callbacks = {}) {
    assert(config, 'No calendar configuration object provided.');

    // Create HTML part with SuperClass
    const html = [
      { name: 'header', tag: 'header' },
      { name: 'days' },
    ];
    super(html, CALENDAR_CLASS, parentClass, 'section');

    // Inside the header we need some stuff.
    assert(config.name, 'No calendar name provided for one of the calendars.');
    this.title = config.name;
    this.html.title = document.createElement('h2');
    this.html.title.textContent = this.title;
    this.html.title.classList.add(`${this.class}-title`);
    this.html.header.appendChild(this.html.title);

    if (typeof config.description === 'string') {
      this.description = config.description;
      this.html.description = document.createElement('p');
      this.html.description.classList.add(`${this.class}-description`);
      this.html.description.textContent = this.description;
      this.html.header.appendChild(this.html.description);
    }

    assert(config.id, `No ID provided for calendar "${config.name}"`);
    this.id = config.id;

    assert(startDate, 'No start date provided.');
    this.startDate = startDate;

    this.callbacks = callbacks;

    // The days array is ordered chronologically.
    this.days = [];

    Object.preventExtensions(this);

    // Prepare title click callback
    if (typeof this.callbacks.titleClick === 'function') {
      this.html.header.addEventListener('click', () => {
        callbacks.titleClick(config);
      });
    }
  }

  getId() {
    return this.id;
  }

  // Always adds to the end
  // The Object will decide what is the date of the day to be added.
  addDay() {
    const newDate = DateHandler.addDays(this.startDate, this.days.length);
    const newDay = new Day(newDate, this.class, this.callbacks);
    assert(newDay && newDay.html && newDay.html.container,
        'New Day instance initialised without an HTML container.');
    this.days.push(newDay);
    this.html.days.appendChild(newDay.html.container);
  }

  // Always removes from the end
  removeDay() {
    let dayToBeRemoved = this.days.pop();

    // Remove from DOM
    dayToBeRemoved.html.container.remove();

    // Remove last reference to the element
    dayToBeRemoved = null;
  }

  getDayCount(days = this.days) {
    return days.length;
  }

  setEvents(eventsArray) {
    assert(Array.isArray(eventsArray), 'The parameter provided is not an array.');

    // Create a map indexed by day
    const daysMap = new Map();
    this.days.forEach((d) => { return daysMap.set(d, []); });


    for (const newEvent of eventsArray) {
      const eventDays = this.findDaysInRange(newEvent.start, newEvent.end);

      for (const day of eventDays) {
        daysMap.get(day).push(newEvent);
      }
    }

    for (const keyVal of daysMap) {
      keyVal[0].setEvents(keyVal[1]);
    }
  }

  clearEvents(days = this.days) {
    for (const day of days) {
      day.clearEvents();
    }
  }

  /**
   * @method findDays
   * @api private
   * @param {String | Date} end
   * @param {String | Date} start
   * @param {Array<Day>} days
   * @returns {Array}
   */
  findDaysInRange(start, end, days = this.days) {
    const foundDays = [];

    if (DateHandler.sameDay(start, end)) {
      // If the range comprises just one day, we can run the find
      // function as it will just return one result
      const dayFound = days.find((day) => {
        const sameDay = DateHandler.sameDay(start, day.getDate());
        return sameDay;
      });

      if (dayFound) { foundDays.push(dayFound); }
    } else {
      for (const day of days) {
        if (DateHandler.rangesOverlap(
          start,
          end,
          day.getStart(),
          day.getEnd())) {
          foundDays.push(day);
        }
      }
    }

    return foundDays;
  }

  setStartDate(date, days = this.days) {
    let counter = 0;
    for (const day of days) {
      day.setDate(DateHandler.addDays(date, counter));
      counter++;
    }
  }
}
