import assert from './utils/assert.js';
import ModelView from './ModelView';
import DateHandler from './utils/DateHandler';

const CONTROL_CLASS = '-ctrl';
const datePickerFormats = {
  week: 'YYYY-[W]WW',
  date: 'YYYY-MM-DD',
};

/**
 * @class ControlBar
 * @api private
 */
export default class ControlBar extends ModelView {
  /**
   * @constructor
   * @api private
   * @param  {String} parentClass
   */
  constructor(parentClass) {
    const html = [
      { name: 'datePicker', tag: 'input' },
      { name: 'back', tag: 'button', content: '<i class=icon-chevron-left></i>' },
      { name: 'forward', tag: 'button', content: '<i class=icon-chevron-right></i>' },
      { name: 'today', tag: 'button', content: 'Today' },
      { name: 'refresh', tag: 'button',
        content: '<i class=icon-refresh></i><i class=icon-check></i><i class=icon-times></i>' },
      { name: 'titleBar', tag: 'p' },
      { name: 'show-weekend', tag: 'button', content: 'Show Weekend' },
    ];
    super(html, CONTROL_CLASS, parentClass, 'nav');

    this.refreshLoadingController = new ButtonLoadingController(
      this.html.refresh,
      'fl-mc-loading',
      'fl-mc-loading-complete',
      'fl-mc-loading-error'
    );
    this.eventListeners = {};

    Object.preventExtensions(this);
    // --------- end of attribute creation ----------

    this.html.datePicker.setAttribute('type', 'week');
    this.html.datePicker.addEventListener('change', (e) => {
      assert(e.target, 'Error in datePicker\'s change event');
      this.trigger('datePicker', e.target.value);
    });

    // Add listener to buttons
    for (const el of html) {
      if (el.tag !== 'button') { continue; }
      this.html[el.name].addEventListener('click', (e) => {
        assert(e.target, `Error in ${el.name}'s change event`);
        this.trigger(el.name, e);
      });
    }
  }

  /**
   * Returns the start date of the controlBar
   * @method getDate
   * @return {DateHandler}
   */
  getDate() {
    return this._getDatePickerDate();
  }

  /**
   * Sets the start date of control bar. The end date is automatically
   * calculated given the current dateRange
   * @method setDate
   * @param  {DateHandler} date
   */
  setDate(date) {
    this._setTitleBarDate(date);
    this._setDatePickerDate(date);
  }

  /**
   * Prepares the config bar to represent that dateRange
   * by changing the datepicker type and the title.
   * @method setDateRange
   * @param  {String}     range 'isoweek', 'week' or 'day'
   */
  setDateRange(range) {
    switch (range) {
      case 'isoweek':
        this._setDatePickerType('week');
        this._setShowWeekendActive(true);
        break;
      case 'week':
        this._setDatePickerType('week');
        this._setShowWeekendActive(false);
        break;
      case 'day':
        this._setDatePickerType('date');
        break;
      default:
        assert(false, `Unexpected date range: ${range}`);
    }
  }

  /**
   * Sets the state of the refresh button.
   * @method setLoadingState
   * @param  {String}        state
   */
  setLoadingState(state) {
    switch (state) {
      case 'loading':
        this.refreshLoadingController.setLoading();
        break;
      case 'success':
        this.refreshLoadingController.setLoadingSuccess();
        break;
      case 'error':
        this.refreshLoadingController.setLoadingError();
        break;
      default:
        assert.warn(false, `Unexpected loading state: ${state}`);
        break;
    }
  }

  /**
   * @private
   * @method _getDatePickerDate
   * @return {Date}
   */
  _getDatePickerDate() {
    return DateHandler.newDate(this.html.datePicker.value);
  }

  /**
   * @private
   * @method _setDatePickerDate
   * @param {Date} date
   */
  _setDatePickerDate(date) {
    // Make sure we set it using the correct format.
    const format = datePickerFormats[this.html.datePicker.type];
    this.html.datePicker.value = DateHandler.format(date, format);
  }

  /**
   * @private
   * @method _setDatePickerType
   * @param {String} type 'week' or 'day';
   */
  _setDatePickerType(dateType) {
    if (!(typeof dateType === 'string' && datePickerFormats[dateType])) {
      assert.warn(false, `Invalid datepicker type to be set: ${dateType}`);
      return;
    }

    if (this.html.datePicker.type === dateType) { return; }

    // Change picker type and set the date in the correct format.
    const currDate = this._getDatePickerDate();
    this.html.datePicker.type = dateType;
    this._setDatePickerDate(currDate);
  }

  /**
   * @private
   * @method _setTitleBarDate
   * @param {DateHandler or Date} date
   */
  _setTitleBarDate(date) {
    this.html.titleBar.innerHTML = DateHandler.format(date, 'YYYY');
  }
  /**
   * Assigns a callback to be called by this.trigger when the event happens
   * @method listenTo
   * @param  {String}   eventName
   * @param  {Function} callback
   * @return {void}
   */
  listenTo(eventName, callback) {
    assert(typeof callback === 'function', 'Invalid callback.');
    this.eventListeners[eventName] = this.eventListeners[eventName] || [];
    this.eventListeners[eventName].push(callback);
  }

  /**
   * Calls all callbacks assigned to an event with this.listenTo.
   * @method trigger
   * @param  {String} eventName
   * @param  {Anything} ...parameters
   * @return {void}
   */
  trigger(eventName, ...parameters) {
    if (!this.eventListeners[eventName]) { return; }
    for (const callback of this.eventListeners[eventName]) {
      callback.apply({}, parameters);
    }
  }

  /**
   * @private
   * @method _setShowWeekendActive
   * @param {Boolean} active
   */
  _setShowWeekendActive(active) {
    const activeClass = 'fl-mc-active';
    if (active) {
      this.html['show-weekend'].classList.remove(activeClass);
      this.html['show-weekend'].textContent = 'Show weekends';
    } else {
      this.html['show-weekend'].classList.add(activeClass);
      this.html['show-weekend'].textContent = 'Hide weekends';
    }
  }
}

/**
 * 	@private Only ControlBar will use this class
 * 	@class ButtonLoadingController
 */
class ButtonLoadingController {
  constructor(button, loadingClass, successClass, errorClass) {
    // Make sure we never handle a button twice.
    if (button.loadingIsHandled) { return; }
    button.loadingIsHandled = true;

    this.button = button;
    this.loadingClass = loadingClass;
    this.successClass = successClass;
    this.errorClass = errorClass;

    this._removeAllLoadingClasses();

    // Minimum time showing 'complete' or 'error' symbol.
    this.minAnimationTime = 500;
    this.minIconTime = 1500;

    // Time button was set to loading
    this.loadingStartTime = null;

    this.outcomeTimeout = null;
  }

  setLoading() {
    clearTimeout(this.outcomeTimeout);
    this._removeAllLoadingClasses();
    this.button.classList.add(this.loadingClass);
    this.loadingStartTime = DateHandler.newDate();
  }

  setLoadingSuccess() {
    this._completeLoadingWithSuccessStatus(true);
  }

  setLoadingError() {
    this._completeLoadingWithSuccessStatus(false);
  }

  /**
   * Shows a success or failure icon for a certain period of time.
   * @private
   * @method _completeLoadingWithSuccessStatus
   * @param  {Boolean} success
   * @return {void}
   */
  _completeLoadingWithSuccessStatus(success) {
    clearTimeout(this.outcomeTimeout);

    const outcomeClass = success ? this.successClass : this.errorClass;
    const remainingDelay = this._timeToAnimationTimeoutEnd();

    // This timeout will be cancelled if either this function or
    // setLoading are called
    this.outcomeTimeout = setTimeout(() => {
      this._removeAllLoadingClasses();
      // Show with the completed class for at least minTimeout miliseconds
      this.button.classList.add(outcomeClass);

      // This timeout will be cancelled if either this function or
      // setLoading are called
      this.outcomeTimeout = setTimeout(() => {
        this._removeAllLoadingClasses();
      }, this.minIconTime);
    }, remainingDelay);
  }

  /**
   * @private
   * @method _removeAllLoadingClasses
   * @return {void}
   */
  _removeAllLoadingClasses() {
    this.button.classList.remove(this.loadingClass);
    this.button.classList.remove(this.successClass);
    this.button.classList.remove(this.errorClass);
  }

  /**
  * Time remaining to minTimeout
   * @private
   * @method _timeToAnimationTimeoutEnd
   * @param  {DateHandler} timeoutStart
   * @param  {int} minTimeout
   * @param  {int} now
   * @return {int}
   */
  _timeToAnimationTimeoutEnd(
      timeoutStart = this.loadingStartTime,
      minTimeout = this.minAnimationTime,
      now = DateHandler.newDate()) {
    const delayEndTime = DateHandler.add(timeoutStart, minTimeout, 'milliseconds');
    const remainingDelay = DateHandler.diff(delayEndTime, now, 'milliseconds');
    return Math.max(remainingDelay, 0);
  }
}
