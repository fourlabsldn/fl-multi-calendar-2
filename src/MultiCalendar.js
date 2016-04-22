import assert from './utils/assert';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import ControlBar from './ControlBar';
import Calendar from './Calendar';

const MULTI_CALENDAR_CLASS = 'fl-mc';

export default class MultiCalendar extends ModelView {
  constructor(config) {
    // ----------------------------------------------------------------
    // --------------------- Property creation  -----------------------
    // ----------------------------------------------------------------
    assert(config, 'No Configuration object provided.');

    // Create HTML part with SuperClass
    super(null, MULTI_CALENDAR_CLASS, '', 'main');

    assert(typeof config.targetElement === 'object',
        'No valid targetElement provided.');
    this.targetElement = config.targetElement;

    // Create control bar
    this.controlBar = new ControlBar(this.class);
    this.html.container.appendChild(this.controlBar.html.container);

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = config.loadUrl;

    // Dates will be initialised in this.setStartDate
    this.startDate = null;
    this.endDate = null;
    this.calendars = [];
    this.lastLoadedEvents = {};

    // Nothing else will be added to the object from here on.
    Object.preventExtensions(this);

    // ----------------------------------------------------------------
    // --------------- ControlBar & Calendars setup -- ----------------
    // ----------------------------------------------------------------

    this.initControlBar(this.controlBar);

    this.setStartDate(DateHandler.newDate());

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
    for (const cal of config.calendars) {
      this.addCalendar(cal, this.startDate);
    }

    this.loadEvents();

    // Add everything to the DOM
    this.targetElement.appendChild(this.html.container);
  }

  initControlBar(controlBar = this.controlBar) {
    // Add listeners to controlBar
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
      controlBar.listenTo(el, () => {
        console.log(el);
      });
    }

    controlBar.listenTo('forward', () => {
      const newDate = DateHandler.add(this.startDate, 1, 'week');
      this.setStartDate(newDate);
    });

    controlBar.listenTo('back', () => {
      const newDate = DateHandler.add(this.startDate, -1, 'week');
      this.setStartDate(newDate);
    });

    controlBar.listenTo('today', () => {
      this.setStartDate(DateHandler.newDate());
    });

    controlBar.listenTo('refresh', () => {
      this.loadEvents();
    });
  }

  // TODO: Add calendar when other calendars already have days
  addCalendar(config, startDate = this.startDate) {
    const calendar = new Calendar(config, startDate, MULTI_CALENDAR_CLASS);
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
      this.setEvents(loadedCalEvents, calendars);
    });
  }

  setEvents(calEvents = this.lastLoadedEvents, calendars = this.calendars) {
    if (typeof calEvents !== 'object') {
      assert.warn(false, 'Trying to set events with invalid object');
      return;
    }

    const loadedIds = Object.keys(calEvents);

    // Send each array of event objects to the corresponding calendar
    for (const loadedId of loadedIds) {
      const cal = this.findCalendar(loadedId, calendars);
      if (cal) { cal.setEvents(calEvents[loadedId]); }
    }

    this.lastLoadedEvents = calEvents;
  }

  findCalendar(calId, calendars = this.calendars) {
    return calendars.find((cal) => { return cal.id === calId; });
  }

  setStartDate(date, calendars = this.calendars) {
    // Prepare this for changing one day at a time in mobile view.
    const newDate = DateHandler.startOf(date, 'isoweek');
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

    this.setEvents(this.lastLoadedEvents);
  }

}
