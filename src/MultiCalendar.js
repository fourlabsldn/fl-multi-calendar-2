/* eslint-disable no-underscore-dangle */

import assert from './utils/assert';
import debounce from './utils/debounce';
import DateHandler from './utils/DateHandler';
import triggerEvent from './utils/triggerEvent';

import ModelView from './ModelView';
import ControlBar from './ControlBar';
import Calendar from './Calendar';
import DataLoader from './DataLoader';

// Private variables
const MULTI_CALENDAR_CLASS = 'fl-mc';
const viewModeClassPrefix = `${MULTI_CALENDAR_CLASS}-view-`;
const viewModes = {
  weekdays: {
    name: 'weekdays',
    dateRange: 'isoweek',
    dateGapUnit: 'week', // Gap when pressing forward or back
    dayCount: 5,
  },
  fullWeek: {
    name: 'fullWeek',
    dateRange: 'week',
    dateGapUnit: 'week', // Gap when pressing forward or back
    dayCount: 7,
  },
  oneDay: {
    name: 'oneDay',
    dateRange: 'day',
    dateGapUnit: 'day', // Gap when pressing forward or back
    dayCount: 1,
  },
};

const multiCalendarEvents = {
  loadingStart: 'fl-mc-loading-start',
  loadingComplete: 'fl-mc-loading-complete',
};

/**
 * @class MultiCalendar
 * @extends ModelView
 * @api private
 */
class MultiCalendar extends ModelView {
  /**
   * @constructor
   * @api private
   * @param  {Object} config - MultiCalendar configuration object
   */
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
    this.controlBar = new ControlBar(this.class, config.titleBarFormat);
    this.html.container.appendChild(this.controlBar.html.container);

    this.dataLoader = new DataLoader(config.loadUrl);

    this.dayConfig = { dayHeaderFormat: config.dayHeaderFormat };

    this.startDate = DateHandler.newDate();
    this.endDate = DateHandler.newDate();
    this.calendars = [];
    this.lastLoadedEvents = {};
    this.currViewMode = null;

    // Nothing else will be added to the object from here on.
    Object.preventExtensions(this);

    // ----------------------------------------------------------------
    // --------------- ControlBar & Calendars setup -- ----------------
    // ----------------------------------------------------------------

    this._initControlBar(this.controlBar);

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
    for (const cal of config.calendars) {
      this._addCalendar(cal, this.startDate);
    }

    // Add everything to the DOM
    this.targetElement.appendChild(this.html.container);
  }

  /**
   * Sets up listeners to control bar events
   * @private
   * @method _initControlBar
   * @param  {ControlBar}  controlBar [optional]
   * @return {void}
   */
  _initControlBar(controlBar = this.controlBar) {
    this._makeControlBarSticky(controlBar);

    controlBar.listenTo('datePicker', () => {
      const datePickerDate = this.controlBar.getDate();
      this.goToDate(datePickerDate);
    });

    controlBar.listenTo('forward', () => { this.goForward(); });
    controlBar.listenTo('back', () => { this.goBack(); });
    controlBar.listenTo('today', () => { this.goToDate(DateHandler.newDate()); });
    controlBar.listenTo('refresh', () => { this.refresh(); });

    controlBar.listenTo('show-weekend', () => {
      const show = (this.currViewMode === viewModes.weekdays);
      this.showWeekends(show);
    });
  }
  // ====================================================
  //          Public Interface
  // ====================================================
  /**
   * Moves the multi-calendar date forward by a day or by a week
   * depending on how many days are being shown.
   * @method goForward
   * @api public
   * @return {void}
   */
  goForward() {
    const startDate = this.startDate;
    const gapUnit = this.currViewMode.dateGapUnit;
    const newDate = DateHandler.add(startDate, 1, gapUnit);
    this.setStartDate(newDate);
  }

  /**
   * Moves the multi-calendar date back by a day or by a week
   * depending on how many days are being shown.
   * @method goBack
   * @api public
   * @return {void}
   */
  goBack() {
    const startDate = this.startDate;
    const gapUnit = this.currViewMode.dateGapUnit;
    const newDate = DateHandler.add(startDate, -1, gapUnit);
    this.setStartDate(newDate);
  }

  /**
   * Fetches data from the server for the current showing days and updates
   * the events.
   * @api public
   * @method refresh
   * @return {void}
   */
  refresh() {
    this._loadEvents();
  }

  setFilter(...args) {
    this.dataLoader.setFilter(...args);
    this.refresh();
  }

  /**
   * Shows or hides Saturday and Sunday from the current calendar view.
   * If calendar is in mobile mode (oneDay view) it does nothing.
   * @api public
   * @method showWeekends
   * @param  {Boolean} show - Whether to show the weekends or not.
   * @return {void}
   */
  showWeekends(show) {
    if (this.currViewMode === viewModes.oneDay) { return; }
    const newView = show ? 'fullWeek' : 'weekdays';
    this._setViewMode(newView);
  }

  /**
   * Moves all calendars to a view that shows the specified date.
   * @api public
   * @method goToDate
   * @param  {String | Date} date       [description]
   * @param  {ControlBar} controlBar [opitonal]
   * @return {void}
   */
  goToDate(date, controlBar = this.controlBar) {
    if (DateHandler.isValid(date)) {
      this.setStartDate(date);
    } else {
      controlBar.setDate(this.date);
    }
  }


  // ====================================================
  // ------------- End of Public interface --------------
  // ====================================================
  /**
   * @private
   * @method _addCalendar
   * @param  {Object}       config    Configuration object for the calendar
   * @param  {DateHandler}  startDate [optional]
   */
  _addCalendar(config, startDate = this.startDate) {
    // TODO: Add calendar when other calendars already have days
    const calendarCallbacks = {
      titleClick: config.titleClick,
      dayHeaderClick: config.dayHeaderClick,
      eventClick: config.eventClick,
    };

    config.dayConfig = this.dayConfig; // eslint-disable-line no-param-reassign

    const calendar = new Calendar(config, startDate, MULTI_CALENDAR_CLASS, calendarCallbacks);
    this.html.container.appendChild(calendar.html.container);
    this.calendars.push(calendar);
  }

  /**
   * Amount of days being shown in each calendar.
   * @method getDayCount
   * @param  {Array<Calendar>} calendars
   * @return {Int} - Amount of days being shown in each calendar.
   *               - If there are no calendars it returns 0.
   */
  getDayCount(calendars = this.calendars) {
    if (calendars.length === 0) { return 0; }
    return calendars[0].getDayCount();
  }

  /**
   * Fetches events from the server and puts them into calendars
   * @private
   * @method _loadEvents
   * @param  {String}    loadUrl            [optional]
   * @param  {Array<Calendar>}   calendars  [optional]
   * @param  {ControlBar}   controlBar      [optional]
   * @return {Promise}              Promise that will be resolved when events
   *                                 have been loaded and added to the calendars
   */
  _loadEvents(loadUrl = this.loadUrl, calendars = this.calendars, controlBar = this.controlBar) {
    triggerEvent(multiCalendarEvents.loadingStart, this.html.container);

    controlBar.setLoadingState('loading');

    const startDate = DateHandler.format(this.startDate, 'X');
    const endDate = DateHandler.format(this.endDate, 'X');
    const calendarIds = this.calendars.map(cal => cal.getId());

    return this.dataLoader.loadEvents(startDate, endDate, calendarIds)
    .then((loadedCalEvents) => {
      // Loading interrupted
      if (!loadedCalEvents) { return; }

      this._setEvents(loadedCalEvents, calendars);
      controlBar.setLoadingState('success');
    })
    .catch((e) => {
      controlBar.setLoadingState('error');
      console.error(e);
    })
    // After error or success
    .then(() => {
      triggerEvent(multiCalendarEvents.loadingComplete, this.html.container);
    });
  }

  /**
   * Sets the events for all calendars
   * @private
   * @method _setEvents
   * @param  {Array<Object>}  calEvents    [optional]
   * @param  {Array<Calendar>}  calendars  [optional]
   */
  _setEvents(calEvents = this.lastLoadedEvents, calendars = this.calendars) {
    if (typeof calEvents !== 'object') {
      assert.warn(false, 'Trying to set events with invalid object');
      return;
    }

    const loadedIds = Object.keys(calEvents);

    // Send each array of event objects to the corresponding calendar
    for (const loadedId of loadedIds) {
      const cal = this._findCalendar(loadedId, calendars);
      if (cal) { cal.setEvents(calEvents[loadedId]); }
    }

    this.lastLoadedEvents = calEvents;
  }

  /**
   * @private
   * @method _findCalendar
   * @param  {String}           calId
   * @param  {Calendar}      calendars [optional]
   * @return {Calendar}
   */
  _findCalendar(calId, calendars = this.calendars) {
    return calendars.find((cal) => { return cal.id == calId; });
  }

  /**
   * Sets the start date of all calendars and of the control bar.
   * @method setStartDate
   * @param  {DateHandler | String}   date
   * @param  {Array<Calendar>}        calendars  [optional]
   */
  setStartDate(date, calendars = this.calendars) {
    // This function may be called before a view mode is set. In this clase
    // the only acceptable start date is Today.
    let newDate;
    if (!this.currViewMode) {
      newDate = DateHandler.newDate();
    } else {
      const dateRange = this.currViewMode.dateRange;
      newDate = DateHandler.startOf(date, dateRange);
    }

    for (const cal of calendars) {
      cal.setStartDate(newDate);
    }

    this.startDate = newDate;
    const daysInCalendar = this.getDayCount();

    // Make sure endDate will never be negative.
    // even if there are 0 days in each calendar
    const daysToEnd = Math.max(daysInCalendar - 1, 0);
    const endDay = DateHandler.addDays(newDate, daysToEnd);
    this.endDate = DateHandler.endOf(endDay, 'day'); // 23:59:59 of endDay

    this.controlBar.setDate(newDate);
    this._loadEvents();
  }

  /**
   * @private
   * @method _setViewMode
   * @param {String} newMode
   * @param {Array<Calendar>} calendars [optional]
   * @return {void}
   */
  _setViewMode(modeName, calendars = this.calendars) {
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
      const viewClass = this._viewModeClassName(viewModes[view]);
      this.html.container.classList.remove(viewClass);
    }
    const viewClass = this._viewModeClassName(newMode);
    this.html.container.classList.add(viewClass);

    // This will set the datepicker type and all buttons correctly
    this.controlBar.setDateRange(newMode.dateRange);

    this.currViewMode = newMode;

    // Make sure the beginning startDate will be in accordance
    // with the new viewMode.
    this.setStartDate(this.startDate);
  }

  getViewMode() {
    return this.currViewMode ? this.currViewMode.name : null;
  }

  /**
  * Returns a className for a viewMode.
  * @private
  * @method _viewModeClassName
  * @param  {String} view
  * @return {String}      The class name to be added to the main container.
  */
  _viewModeClassName(view) {
    return viewModeClassPrefix + view.name;
  }

  /**
   * @private
   * @method _makeControlBarSticky
   * @param  {ControlBar} controlBar [optional]
   * @return {void}
   */
  _makeControlBarSticky(controlBar = this.controlBar) {
    const container = this.html.container;
    const bar = controlBar.html.container;

    // Make sure we don't set the listeners twice.
    if (bar.isSticky) { return; }
    bar.isSticky = true;

    let initialPadTop = '';
    let initialBarWidth = '';

    function stickyCheck() {
      const cBox = container.getBoundingClientRect();
      const barHeight = bar.clientHeight;

      if (cBox.top + barHeight <= 0 && !bar.classList.contains('sticky')) {
        bar.classList.add('sticky');

        const containerWidth = container.clientWidth;
        initialBarWidth = bar.style.width;
        bar.style.width = `${containerWidth}px`;

        initialPadTop = parseInt(container.style.paddingTop, 10) || 0;
        container.style.paddingTop = `${barHeight + initialPadTop}px`;
      } else if (cBox.top + barHeight > 0 && bar.classList.contains('sticky')) {
        bar.classList.remove('sticky');

        bar.style.width = initialBarWidth;

        container.style.paddingTop = initialPadTop;
      }
    }

    const stickyCheckDebounded = debounce(stickyCheck, 50);
    window.addEventListener('scroll', stickyCheckDebounded);
  }
}

export default MultiCalendar;
