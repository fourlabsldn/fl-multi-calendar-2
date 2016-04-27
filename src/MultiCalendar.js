import assert from './utils/assert';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';
import ControlBar from './ControlBar';
import Calendar from './Calendar';
import debounce from './utils/debounce';

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

/**
 * @class MultiCalendar
 */
class MultiCalendar extends ModelView {
  /**
   * @constructor
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
    this.controlBar = new ControlBar(this.class);
    this.html.container.appendChild(this.controlBar.html.container);

    assert(typeof config.loadUrl === 'string',
      'No loadUrl provided.');
    this.loadUrl = this._prepareLoadUrl(config.loadUrl);

    // Dates will be initialised in this.setStartDate
    this.startDate = null;
    this.endDate = null;
    this.calendars = [];
    this.lastLoadedEvents = {};
    this.currViewMode = null;

    // Tell last requests whether they were cancelled.
    this.lastRequest = { cancelled: false };

    // Nothing else will be added to the object from here on.
    Object.preventExtensions(this);

    // ----------------------------------------------------------------
    // --------------- ControlBar & Calendars setup -- ----------------
    // ----------------------------------------------------------------

    this._initControlBar(this.controlBar);

    this.setStartDate(DateHandler.newDate());

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
  goForward() {
    const startDate = this.startDate;
    const gapUnit = this.currViewMode.dateGapUnit;
    const newDate = DateHandler.add(startDate, 1, gapUnit);
    this.setStartDate(newDate);
  }

  goBack() {
    const startDate = this.startDate;
    const gapUnit = this.currViewMode.dateGapUnit;
    const newDate = DateHandler.add(startDate, -1, gapUnit);
    this.setStartDate(newDate);
  }

  refresh() {
    this._loadEvents();
  }

  showWeekends(show) {
    if (this.currViewMode === viewModes.oneDay) { return; }
    const newView = show ? 'fullWeek' : 'weekdays';
    this._setViewMode(newView);
  }

  /**
   * Moves all calendars to a view that shows the specified date.
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
    controlBar.setLoadingState('loading');

    // Crete array of calendar IDS
    const calIds = [];
    this.calendars.forEach((cal) => {
      calIds.push(cal.getId());
    });

    const params = {
      ids: calIds,
      start: DateHandler.format(this.startDate, 'X'),
      end: DateHandler.format(this.endDate, 'X'),
    };

    const fullUrl = this._addParametersToUrl(params, loadUrl);

    const requestConfig = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
    };

    // Cancel last request. The function that made the request
    // will preserve this object in a closure so we can safely
    // assign a new object to this.lastRequest.
    this.lastRequest.cancelled = true;
    const thisRequest = { cancelled: false };
    this.lastRequest = thisRequest;

    // TODO: develop a timeout mechanism
    return fetch(fullUrl, requestConfig)
    .then((data) => { return data.json(); })
    // The loaded object is indexed by calendar id and each element contains
    // an array of event objects.
    .then((loadedCalEvents) => {
      if (thisRequest.cancelled) { return; }
      this._setEvents(loadedCalEvents, calendars);
      controlBar.setLoadingState('success');
    })
    .catch((e) => {
      if (thisRequest.cancelled) { return; }
      controlBar.setLoadingState('error');
      console.error(e);
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
    return calendars.find((cal) => { return cal.id === calId; });
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
    this.endDate = DateHandler.addDays(newDate, daysToEnd);

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

  /**
   * Adds parameters as GET string parameters to a prepared URL
   * @private
   * @method _addParametersToUrl
   * @param  {Object}            params
   * @param  {String}            loadUrl [optional]
   * @return {String}           The full URL with parameters
   */
  _addParametersToUrl(params, loadUrl = this.loadUrl) {
    const getParams = [];
    const keys = Object.keys(params);
    for (const param of keys) {
      let value = params[param].toString();
      if (Array.isArray(params[param])) {
        value = `[${value}]`;
      }
      getParams.push(`${param}=${value}`);
    }

    const unencodedGetParams = getParams.join('&');
    const encodedGetParams = encodeURIComponent(unencodedGetParams);
    const fullUrl = loadUrl + encodedGetParams;
    return fullUrl;
  }

  /**
   * Adds a proper domain an prepares the URL for query parameters.
   * @private
   * @method _prepareLoadUrl
   * @param  {String}        url
   * @return {String}            The usable loadUrl
   */
  _prepareLoadUrl(rawUrl) {
    let url;
    try {
      url = new URL(rawUrl);
    } catch (e) {
      try {
        url = new URL(location.origin + rawUrl);
        assert.warn(false, `No domain provided. Assuming domain: ${location.origin}`);
      } catch (e2) {
        assert(false, 'Invalid URL: ${loadUrl}');
      }
    }

    let fullUrl;
    if (url.search.length > 0) {
      url.search = `${url.search}&`;
      fullUrl = url.href;
    } else {
      fullUrl = `${url.href}?`;
    }
    return fullUrl;
  }
}

export default MultiCalendar;
