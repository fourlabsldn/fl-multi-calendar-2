import assert from './utils/assert.js';
import ModelView from './ModelView';

const CONTROL_CLASS = '-ctrl';

export default class ControlBar extends ModelView {
  constructor(parentClass) {
    const html = [
      { name: 'weekpicker', tag: 'input' },
      { name: 'back', tag: 'button', content: '<i class=icon-chevron-left></i>' },
      { name: 'forward', tag: 'button', content: '<i class=icon-chevron-right></i>' },
      { name: 'today', tag: 'button', content: 'today' },
      { name: 'refresh', tag: 'button', content: '<i class=icon-refresh></i>' },
      { name: 'date-range', tag: 'p' },
      { name: 'show-weekend', tag: 'button', content: 'Show Weekend' },
    ];
    super(html, CONTROL_CLASS, parentClass, 'nav');

    this.html.weekpicker.setAttribute('type', 'week');
    this.html.weekpicker.addEventListener('change', (e) => {
      assert(e.target, 'Error in weekpicker\'s change event');
      this.trigger('weekpicker', e.target.value);
    });

    // Add listener to buttons
    for (const el of html) {
      if (el.tag !== 'button') { continue; }
      this.html[el.name].addEventListener('click', (e) => {
        assert(e.target, `Error in ${el.name}'s change event`);
        this.trigger(el.name, e.target.value);
      });
    }

    this.eventListeners = {};

    Object.preventExtensions(this);
  }

  listenTo(eventName, callback) {
    assert(typeof callback === 'function', 'Invalid callback.');
    this.eventListeners[eventName] = this.eventListeners[eventName] || [];
    this.eventListeners[eventName].push(callback);
  }

  trigger(eventName, ...parameters) {
    if (!this.eventListeners[eventName]) { return; }
    for (const callback of this.eventListeners[eventName]) {
      callback.apply({}, parameters);
    }
  }
}
