import assert from './utils/assert';
import Calendar from './Calendar';

const MULTI_CALENDAR_CLASS = 'js-fl-mc';

export default class MultiCalendar {
  constructor(config) {
    assert(config, 'No Configuration object provided.');

    assert(typeof config.targetElement === 'object',
      'No valid targetElement provided.');
    this.targetElement = config.targetElement;

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    // Create HTML
    this.html = {}; // Where we will keep references to html sections.
    this.html.container = document.createElement('main');
    this.html.container.classList.add(MULTI_CALENDAR_CLASS);

    this.targetElement.appendChild(this.html.container);

    // Add Calendars
    assert(Array.isArray(config.calendars),
      'No valid calendars array provided.');
    this.calendars = [];
    for (const cal of config.calendars) {
      this.addCalendar(cal);
    }

    Object.freeze(this);
  }

  addCalendar(config) {
    const calendar = new Calendar(config, MULTI_CALENDAR_CLASS);
    this.html.container.appendChild(calendar.html.container);
    this.calendars.push(calendar);
  }

  addDay() {
    for (const cal of this.calendars) {
      cal.addDay();
    }
  }

  removeDay() {
    for (const cal of this.calendars) {
      cal.removeDay();
    }
  }
}
