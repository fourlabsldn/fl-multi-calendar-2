import assert from './utils/assert';
import DateHandler from './utils/DateHandler';
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

    this.startDate = DateHandler.newDate();
    this.endDate = this.startDate;

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
    this.calendars = [];
    for (const cal of config.calendars) {
      this.addCalendar(cal);
    }

    this.loadEvents();

    Object.freeze(this);
  }

  // TODO: Add calendar when other calendars already have days
  addCalendar(config) {
    const calendar = new Calendar(config, this.startDate, MULTI_CALENDAR_CLASS);
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

  // Loads server events into calendars
  loadEvents(loadUrl = this.loadUrl, calendars = this.calendars) {
    return fetch(loadUrl)
    .then((data) => { return data.json(); })
    // The loaded object is indexed by calendar id and each element contains
    // an array of event objects.
    .then((loadedCalEvents) => {
      const loadedIds = Object.keys(loadedCalEvents);

      // Send each array of event objects to the corresponding calendar
      for (const loadedId of loadedIds) {
        const cal = this.findCalendar(loadedId, calendars);
        if (cal) { cal.setEvents(loadedCalEvents[loadedId]); }
      }
    });
  }

  findCalendar(calId, calendars = this.calendars) {
    return calendars.find((cal) => { return cal.id === calId; });
  }


}
