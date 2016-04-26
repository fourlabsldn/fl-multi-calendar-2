import assert from './utils/assert.js';
import ModelView from './ModelView';
import DateHandler from './utils/DateHandler';

const CONTROL_CLASS = '-ctrl';
const datePickerFormats = {
  week: 'YYYY-[W]WW',
  date: 'YYYY-MM-DD',
};

export default class ControlBar extends ModelView {
  /**
   * @constructor
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

  getDate() {
    return this._getDatePickerDate();
  }

  setDate(date) {
    this._setTitleBarDate(date);
    this._setDatePickerDate(date);
  }

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

  setLoadingState(state) {
    switch (state) {
      case 'loading':
        this.refreshLoadingController.setLoading();
        break;
      case 'success':
        this.refreshLoadingController.setLoadingSuccess();
        break;
      case 'error':
      console.log('errpr');
        this.refreshLoadingController.setLoadingError();
        break;
      default:
        assert.warn(false, `Unexpected loading state: ${state}`);
        break;
    }
  }

  /**
   * @method _getDatePickerDate
   * @return {Date}
   */
  _getDatePickerDate() {
    return DateHandler.newDate(this.html.datePicker.value);
  }

  /**
   * @method _setDatePickerDate
   * @param {Date} date
   */
  _setDatePickerDate(date) {
    // Make sure we set it using the correct format.
    const format = datePickerFormats[this.html.datePicker.type];
    this.html.datePicker.value = DateHandler.format(date, format);
  }

  /**
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

  _setTitleBarDate(date) {
    this.html.titleBar.innerHTML = DateHandler.format(date, 'YYYY');
  }
  /**
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

    // This will be locked while elements are in their timeout
    // to change a state
    this.locked = false;
    this.complete = true;

    // Minimum time showing 'complete' or 'error' symbol.
    this.minAnimationTimeout = 500;
    this.minIconTimeout = 1500;

    // Time button was set to loading
    this.loadingStartTime = null;
  }

  setLoading() {
    if (!this.complete) {
      assert.warn(false,
        `Impossible to set load animation.
        Last animation still not complete.`);
      return;
    }

    if (this.locked) { return; }
    this.complete = false;
    this.button.classList.add(this.loadingClass);
    this.loadingStartTime = DateHandler.newDate();
  }

  setLoadingSuccess() {
    this._completeLoadingWithSuccessStatus(true);
  }

  setLoadingError() {
    this._completeLoadingWithSuccessStatus(false);
  }

  _completeLoadingWithSuccessStatus(success) {
    if (this.complete) { // That is, if it wasn't loading.
      assert(false,
        `Cannot set loading to complete when
        button was not in loading state.`);
      return;
    }


    if (this.locked) { return; }
    this.locked = true;

    const outcomeClass = success ? this.successClass : this.errorClass;
    const remainingDelay = this._timeToAnimationTimeoutEnd();

    setTimeout(() => {
      this._removeAllLoadingClasses();
      // Show with the completed class for at least minTimeout miliseconds
      this.button.classList.add(outcomeClass);
      setTimeout(() => { this._unlockAndComplete(); }, this.minIconTimeout);
    }, remainingDelay);
  }

  _removeAllLoadingClasses() {
    this.button.classList.remove(this.loadingClass);
    this.button.classList.remove(this.successClass);
    this.button.classList.remove(this.errorClass);
  }

  // Time remaining to minTimeout
  _timeToAnimationTimeoutEnd(
      timeoutStart = this.loadingStartTime,
      minTimeout = this.minAnimationTimeout,
      now = DateHandler.newDate()) {
    const delayEndTime = DateHandler.add(timeoutStart, minTimeout, 'milliseconds');
    const remainingDelay = DateHandler.diff(delayEndTime, now, 'milliseconds');
    return Math.max(remainingDelay, 0);
  }

  _unlockAndComplete() {
    this._removeAllLoadingClasses();
    this.complete = true;
    this.locked = false;
  }
}
