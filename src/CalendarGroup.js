import assert from './utils/assert';
import Calendar from './Calendar';

const CALENDAR_GROUP_CLASS = 'js-fl-mc';

export default class CalendarGroup {
  constructor(config) {
    assert(config, 'No Configuration object provided.');

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    // Create HTML
    this.html = {}; // Where we will keep references to html sections.
    this.html.container = document.createElement('main');
    this.html.container.classList.add(CALENDAR_GROUP_CLASS);

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
    const calendar = new Calendar(config, CALENDAR_GROUP_CLASS);
    this.html.container.appendChild(calendar.html.container);
    this.calendars.push(calendar);
  }
}
