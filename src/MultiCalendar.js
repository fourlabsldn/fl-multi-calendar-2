import assert from './utils/assert';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import ControlBar from './ControlBar';
import Calendar from './Calendar';

const MULTI_CALENDAR_CLASS = 'fl-mc';

const viewModes = {
  weekdays: {
    name: 'weekdays',
    dayCount: 5,
    className: 'fl-mc-view-weekdays',
    pickerType: 'week',
    showWeekendActiveState: true,
    newDateCallback: (newDate) => { return DateHandler.startOf(newDate, 'isoweek'); },
    dateForwardCallback: (oldDate) => { return DateHandler.add(oldDate, 1, 'week'); },
    dateBackCallback: (oldDate) => { return DateHandler.add(oldDate, -1, 'week'); },
  },
  fullWeek: {
    name: 'fullWeek',
    dayCount: 7,
    className: 'fl-mc-view-fullWeek',
    pickerType: 'week',
    showWeekendActiveState: false,
    newDateCallback: (newDate) => { return DateHandler.startOf(newDate, 'isoweek'); },
    dateForwardCallback: (oldDate) => { return DateHandler.add(oldDate, 1, 'week'); },
    dateBackCallback: (oldDate) => { return DateHandler.add(oldDate, -1, 'week'); },
  },
  oneDay: {
    name: 'oneDay',
    dayCount: 1,
    className: 'fl-mc-view-oneDay',
    pickerType: 'date',
    showWeekendActiveState: false, // The button will be hidden by css in this view mode
    newDateCallback: (newDate) => { return DateHandler.newDate(newDate); },
    dateForwardCallback: (oldDate) => { return DateHandler.add(oldDate, 1, 'day'); },
    dateBackCallback: (oldDate) => { return DateHandler.add(oldDate, -1, 'day'); },
  },
};

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
    this.currViewMode = null;

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
    controlBar.listenTo('weekpicker', () => {
      const weekpickerDate = this.controlBar.getWeekpickerDate();
      if (DateHandler.isValid(weekpickerDate)) {
        this.setStartDate(weekpickerDate);
      } else {
        controlBar.setWeekpickerDate(this.startDate);
      }
    });

    controlBar.listenTo('forward', () => {
      const newDate = this.currViewMode.dateForwardCallback(this.startDate);
      this.setStartDate(newDate);
    });

    controlBar.listenTo('back', () => {
      const newDate = this.currViewMode.dateBackCallback(this.startDate);
      this.setStartDate(newDate);
    });

    controlBar.listenTo('today', () => {
      this.setStartDate(DateHandler.newDate());
    });

    controlBar.listenTo('refresh', () => {
      this.loadEvents();
    });

    controlBar.listenTo('show-weekend', () => {
      if (this.currViewMode === viewModes.fullWeek) {
        this.setViewMode('weekdays');
      } else {
        this.setViewMode('fullWeek');
      }
      return true;
    });
  }

  // TODO: Add calendar when other calendars already have days
  addCalendar(config, startDate = this.startDate) {
    const calendar = new Calendar(config, startDate, MULTI_CALENDAR_CLASS);
    this.html.container.appendChild(calendar.html.container);
    this.calendars.push(calendar);
  }

  addDay(calendars = this.calendars) {
    console.log('Adding days');
    for (const cal of calendars) {
      cal.addDay();
    }
  }

  removeDay(calendars = this.calendars) {
    for (const cal of calendars) {
      cal.removeDay();
    }
  }

  /**
   * @method getDayCount Amount of days being shown in each calendar.
   * @param  {Array[Calendar]} calendars [optional]
   * @return {Int} If there are no calendars it returns 0;
   */
  getDayCount(calendars = this.calendars) {
    if (calendars.length === 0) { return 0; }
    return calendars[0].getDayCount();
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
    // This function may be called before a view mode is set. In this clase
    // the only acceptable start date is Today.
    let newDate;
    if (!this.currViewMode) {
      newDate = DateHandler.newDate();
    } else {
      newDate = this.currViewMode.newDateCallback(date);
    }

    for (const cal of calendars) {
      cal.setStartDate(newDate);
    }

    this.startDate = newDate;
    const daysInCalendar = this.getDayCount();

    // Make sure endDate will never be negative.
    // even if there are 0 days in each calendar
    const daysToEnd = Math.max(daysInCalendar - 1, 0);
    this.endDate = DateHandler.addDays(newDate, daysToEnd);

    this.controlBar.setWeekpickerDate(newDate);
    this.setEvents(this.lastLoadedEvents);
  }

  /**
   * @method setViewMode
   * @param {String} newMode
   * @param {Array[Calendar]} calendars [optional]
   * @return {void}
   */
  setViewMode(modeName, calendars = this.calendars) {
    let newMode = viewModes[modeName];
    if (newMode === undefined) {
      const fallbackMode = 'weekdays';
      assert.warn(false, `Invalid view mode: ${newMode}. Defaulting to ${fallbackMode}`);
      newMode = viewModes[fallbackMode];
    }

    if (newMode === this.currViewMode) { return; }

    // It might be the first time that the mode is being set
    // and the number of days in each calendar could be different
    // from all of the viewModes, that's why we are using this.getDayCount
    // instead of this.currViewMode.dayCount.
    const currDayCount = this.getDayCount();

    const dayCountDiff = Math.abs(newMode.dayCount - currDayCount);
    const method = (newMode.dayCount < currDayCount) ? 'removeDay' : 'addDay';

    // Add or remove the needed amount of days from the calendar.
    for (const cal of calendars) {
      for (let i = 0; i < dayCountDiff; i++) {
        cal[method]();
      }
    }

    // Remove any other view's class and add the one for this view.
    for (const view of Object.keys(viewModes)) {
      this.html.container.classList.remove(viewModes[view].className);
    }
    this.html.container.classList.add(newMode.className);

    // Set the weekpicker type correctly
    this.controlBar.setPickerType(newMode.pickerType);

    // Set 'Show Weekends' button state correctly
    this.controlBar.setShowWeekendActive(newMode.showWeekendActiveState);

    this.currViewMode = newMode;

    // Make sure the beginning startDate will be in accordance
    // with the new viewMode.
    this.setStartDate(this.startDate);
    this.setEvents(this.lastLoadedEvents);
  }

  getViewMode() {
    if (this.currViewMode) {
      return this.currViewMode.name;
    }
    return null;
  }

}
