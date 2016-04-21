import assert from './utils/assert.js';
import DateHandler from './DateHandler';
import ModelView from './ModelView';
import Day from './Day';

const CALENDAR_CLASS = '-cal';

export default class Calendar extends ModelView {
  constructor(config, parentClass, startDate = DateHandler.newDate()) {
    assert(config, 'No calendar configuration object provided.');

    // Create HTML part with SuperClass
    const html = [
      { name: 'title', tag: 'header' },
      { name: 'days' },
    ];
    super(html, CALENDAR_CLASS, null, 'section');

    assert(config.name, 'No calendar name provided for one of the calendars.');
    this.calName = config.name;
    this.html.title.textContent = this.calName;

    assert(config.id, `No ID provided for calendar "${config.name}"`);
    this.id = config.id;

    assert(parentClass, 'No parent class provided.');
    this.class = parentClass + CALENDAR_CLASS;

    this.startDate = startDate;
    this.days = [];

    Object.freeze(this);
  }

  // Always adds to the end
  // The Object will decide what is the date of the day to be added.
  addDay() {
    const newDate = DateHandler.addDays(this.date, this.days.length);
    const newDay = new Day(newDate, CALENDAR_CLASS);
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
}
