import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';

const EVENT_CLASS = '-event';

const possibleColors = {
  blue: 'fl-mc-event-color-blue',
  green: 'fl-mc-event-color-green',
  yellow: 'fl-mc-event-color-yellow',
  red: 'fl-mc-event-color-red',
  orange: 'fl-mc-event-color-orange',
  white: 'fl-mc-event-color-white',
  black: 'fl-mc-event-color-black',
};

export default class Event extends ModelView {
  constructor(eventConfig, parentClass, callbacks = {}) {
    assert(typeof eventConfig === 'object',
      `Invalid event configuration object provided: ${eventConfig}`);

    // Create HTML part with SuperClass
    // The html elements to be created are 'time'
    // and whatever info comes in the eventConfig
    const html = [{ name: 'time', tag: 'p', content: eventConfig.time }];

    const fields = ['title', 'description', 'tooltip'];
    for (const field of fields) {
      if (eventConfig[field]) {
        html.push({ name: field, tag: 'p', content: eventConfig[field] });
      }
    }

    super(html, EVENT_CLASS, parentClass);

    this.config = eventConfig;

    this.callbacks = callbacks;

    assert(typeof eventConfig.start === 'string',
      `Invalid event start date provided: ${eventConfig.start}`);
    this.startDate = DateHandler.newDate(eventConfig.start);

    assert(typeof eventConfig.end === 'string',
      `Invalid event end date provided: ${eventConfig.end}`);
    this.endDate = DateHandler.newDate(eventConfig.end);

    assert(!eventConfig.description || typeof eventConfig.description === 'string',
        `Invalid description type: ${eventConfig.description}`);
    this.description = eventConfig.description;

    assert(!eventConfig.tooltip || typeof eventConfig.tooltip === 'string',
        `Invalid tooltip type: ${eventConfig.tooltip}`);
    this.tooltip = eventConfig.tooltip;

    if (eventConfig.color) {
      assert(possibleColors[eventConfig.color],
        `Invalid color: ${eventConfig.color}`);
      const colorClass = possibleColors[eventConfig.color];
      this.html.container.classList.add(colorClass);
    }

    this.updateTime();

    Object.preventExtensions(this);

    // Setup eventClick callback
    if (typeof this.callbacks.eventClick === 'function') {
      this.html.container.addEventListener('click', () => {
        this.callbacks.eventClick(this.getConfig());
      });
    }
  }

  getStartTime() {
    return this.startDate;
  }

  updateTime() {
    // TODO: What if it starts or ends in a different day?
    this.html.time.textContent =
     `${DateHandler.getTime(this.startDate)} - ${DateHandler.getTime(this.endDate)}`;
  }

  getConfig() {
    return this.config;
  }

  /**
   * @method areSame Whether two configurations would create the same event.
   * @param  {Object} e1 Event object or event configuration object
   * @param  {Object} e2
   * @return {Boolean}
   */
  static areSame(e1, e2) {
    if (!e1 || !e2) { return false; }
    const event1 = (e1 instanceof Event) ? e1.getConfig() : e1;
    const event2 = (e2 instanceof Event) ? e2.getConfig() : e2;
    return JSON.stringify(event1) === JSON.stringify(event2);

    // TODO: Check properties properly, using a properties array with the
    // name and of every relevant property.

    // const keysEvent1 = Object.keys(event1);
    // const keysEvent2 = Object.keys(event2);
    // if (keysEvent1.length !== keysEvent2.length) { return false; }
    //
    // // Keys of both object
    // const keys = keysEvent1.concat(keysEvent1);
    // const keySet = new Set(keys); // So we don't compare the same thing twice.
    // for (const key of keySet) {
    //   if (!event1[key] || !event2[key]) { return false; }
    //   if (event1[key].toString() !== event2[key].toString()) {
    //     return false;
    //   }
    // }
    // return true;
  }
}
