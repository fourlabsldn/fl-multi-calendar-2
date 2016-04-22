import assert from './utils/assert';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import ControlBar from './ControlBar';
import Calendar from './Calendar';

const MULTI_CALENDAR_CLASS = 'fl-mc';

export default class MultiCalendar extends ModelView {
  constructor(config) {
    assert(config, 'No Configuration object provided.');

    // Create HTML part with SuperClass
    super(null, MULTI_CALENDAR_CLASS, '', 'main');

    assert(typeof config.targetElement === 'object',
      'No valid targetElement provided.');
    this.targetElement = config.targetElement;
    this.targetElement.appendChild(this.html.container);

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    this.startDate = DateHandler.newDate();
    this.endDate = this.startDate;

    // Create control bar
    this.controlBar = new ControlBar(this.class);
    this.html.container.appendChild(this.controlBar.html.container);

    const els = [
      'weekpicker',
      'back',
      'forward',
      'today',
      'refresh',
      'date-range',
      'show-weekend',
    ];

    for (const el of els) {
      this.controlBar.listenTo(el, () => {
        console.log(el);
      });
    }

    this.controlBar.listenTo('forward', () => {
      console.log('Adding days');
      this.setStartDate(DateHandler.addDays(this.startDate, 1));
    });

    this.controlBar.listenTo('back', () => {
      console.log('Removing days');
      this.setStartDate(DateHandler.addDays(this.startDate, -1));
    });

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
    this.calendars = [];
    for (const cal of config.calendars) {
      this.addCalendar(cal);
    }

    this.loadEvents();

    Object.preventExtensions(this);
  }

  // TODO: Add calendar when other calendars already have days
  addCalendar(config) {
    const calendar = new Calendar(config, this.startDate, MULTI_CALENDAR_CLASS);
    this.html.container.appendChild(calendar.html.container);
    this.calendars.push(calendar);
  }

  addDay(calendars = this.calendars) {
    for (const cal of calendars) {
      cal.addDay();
    }
  }

  removeDay(calendars = this.calendars) {
    for (const cal of calendars) {
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

  setStartDate(date, calendars = this.calendars) {
    const newDate = DateHandler.newDate(date);
    for (const cal of calendars) {
      cal.setStartDate(newDate);
    }

    this.startDate = newDate;
    if (calendars.length > 0) {
      const daysInCalendar = calendars[0].getDayCount();
      // Make sure endDate will never be negative. even if there are 0 days in calendar
      const daysToEnd = Math.max(daysInCalendar - 1, 0);
      this.endDate = DateHandler.addDays(newDate, daysToEnd);
    } else {
      this.endDate = this.startDate;
    }
  }

}
