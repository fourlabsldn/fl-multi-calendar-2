import assert from './utils/assert.js';
import DateHandler from './Day';
import Day from './Day';

const CALENDAR_CLASS = '-cal';

export default class Calendar {
  constructor(config, parentClass, startDate = DateHandler.newDate()) {
    assert(config, 'No calendar configuration object provided.');

    assert(config.name, 'No calendar name provided for one of the calendars.');
    this.name = config.name;

    assert(config.id, `No ID provided for calendar "${config.name}"`);
    this.id = config.id;

    assert(parentClass, 'No parent class provided.');
    this.class = parentClass + CALENDAR_CLASS;

    this.startDate = startDate;
    this.days = [];

    // Create HTML
    this.html = {}; // Where we will keep references to html sections.

    this.html.container = document.createElement('section');
    this.html.container.classList.add(this.class);

    this.html.title = document.createElement('header');
    this.html.title.classList.add(`${this.class}-title`);
    this.html.container.appendChild(this.html.title);

    this.html.days = document.createElement('div');
    this.html.days.clasList.add(`${this.class}-days`);
    this.html.container.appendChild(this.html.days);

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
