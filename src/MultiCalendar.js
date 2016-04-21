import assert from './utils/assert';
import ModelView from './ModelView';
import Calendar from './Calendar';

const MULTI_CALENDAR_CLASS = 'js-fl-mc';

export default class MultiCalendar extends ModelView {
  constructor(config) {
    assert(config, 'No Configuration object provided.');

    // Create HTML part with SuperClass
    super(null, MULTI_CALENDAR_CLASS, null, 'main');

    assert(typeof config.targetElement === 'object',
      'No valid targetElement provided.');
    this.targetElement = config.targetElement;
    this.targetElement.appendChild(this.html.container);

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
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
