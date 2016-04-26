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
      { name: 'refresh', tag: 'button', content: '<i class=icon-refresh></i>' },
      { name: 'titleBar', tag: 'p' },
      { name: 'show-weekend', tag: 'button', content: 'Show Weekend' },
    ];
    super(html, CONTROL_CLASS, parentClass, 'nav');

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
