import assert from './utils/assert';
import Calendar from './Calendar';

export default class CalendarGroup {
  constructor(config) {
    assert(config, 'No Configuration object provided.');

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    assert(Array.isArray(config.calendars),
      'No valid calendars array provided.');

    this.calendars = [];
    for (const cal of config.calendars) {
      this.addCalendar(cal);
    }

    Object.freeze(this);
  }

  addCalendar(config) {
    const calendar = new Calendar(config);
    this.calendars.push(calendar);
  }
}
