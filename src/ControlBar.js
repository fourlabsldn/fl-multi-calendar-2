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
      { name: 'weekpicker', tag: 'input' },
      { name: 'back', tag: 'button', content: '<i class=icon-chevron-left></i>' },
      { name: 'forward', tag: 'button', content: '<i class=icon-chevron-right></i>' },
      { name: 'today', tag: 'button', content: 'Today' },
      { name: 'refresh', tag: 'button', content: '<i class=icon-refresh></i>' },
      { name: 'date-range', tag: 'p' },
      { name: 'show-weekend', tag: 'button', content: 'Show Weekend' },
    ];
    super(html, CONTROL_CLASS, parentClass, 'nav');

    this.eventListeners = {};

    Object.preventExtensions(this);
    // --------- end of attribute creation ----------

    this.html.weekpicker.setAttribute('type', 'week');
    this.html.weekpicker.addEventListener('change', (e) => {
      assert(e.target, 'Error in weekpicker\'s change event');
      this.trigger('weekpicker', e.target.value);
    });

    // TODO: Remove this statement
    this.html['date-range'].innerHTML = 'Apr 04 - Apr 05';

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
   * @method getWeekpickerDate
   * @return {Date}
   */
  getWeekpickerDate() {
    return DateHandler.newDate(this.html.weekpicker.value);
  }

  /**
   * @method setWeekpickerDate
   * @param {Date} date
   */
  setWeekpickerDate(date) {
    // Make sure we set it using the correct format.
    const format = datePickerFormats[this.html.weekpicker.type];
    this.html.weekpicker.value = DateHandler.format(date, format);
  }

  /**
   * @method setPickerType
   * @param {String} type 'week' or 'day';
   */
  setPickerType(dateType) {
    if (!(typeof dateType === 'string' && datePickerFormats[dateType])) {
      assert.warn(false, `Invalid datepicker type to be set: ${dateType}`);
      return;
    }

    if (this.html.weekpicker.type === dateType) { return; }

    // Change picker type and set the date in the correct format.
    const currDate = this.getWeekpickerDate();
    this.html.weekpicker.type = dateType;
    this.setWeekpickerDate(currDate);
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

  setShowWeekendActive(active) {
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
