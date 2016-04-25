import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';

const EVENT_CLASS = '-event';

export default class Event extends ModelView {
  constructor(eventInfo, parentClass) {
    assert(typeof eventInfo === 'object',
      `Invalid eventInfo provided: ${eventInfo}`);

    // Create HTML part with SuperClass
    // The html elements to be created are 'time'
    // and whatever info comes in the eventInfo
    const html = [{ name: 'time', tag: 'p', content: eventInfo.time }];

    const fields = ['title', 'description', 'tooltip'];
    for (const field of fields) {
      if (eventInfo[field]) {
        html.push({ name: field, tag: 'p', content: eventInfo[field] });
      }
    }

    super(html, EVENT_CLASS, parentClass);

    assert(typeof eventInfo.start === 'string',
      `Invalid event start date provided: ${eventInfo.start}`);
    this.startDate = DateHandler.newDate(eventInfo.start);

    assert(typeof eventInfo.end === 'string',
      `Invalid event end date provided: ${eventInfo.end}`);
    this.endDate = DateHandler.newDate(eventInfo.end);

    assert(!eventInfo.description || typeof eventInfo.description === 'string',
        `Invalid description type: ${eventInfo.description}`);
    this.description = eventInfo.description;

    assert(!eventInfo.tooltip || typeof eventInfo.tooltip === 'string',
        `Invalid tooltip type: ${eventInfo.tooltip}`);
    this.tooltip = eventInfo.tooltip;

    this.updateTime();

    Object.preventExtensions(this);
  }

  getStartTime() {
    return this.startDate;
  }

  updateTime() {
    // TODO: What if it starts or ends in a different day?
    this.html.time.textContent =
     `${DateHandler.getTime(this.startDate)} - ${DateHandler.getTime(this.endDate)}`;
  }

  /**
   * @method areSame Whether two configurations would create the same event.
   * @param  {Object} config1 Object to generate an event.
   * @param  {Object} config2
   * @return {Boolean}
   */
  static areSame(config1, config2) {
    // Keys of both object
    const keys = Object.keys(config1).concat(Object.keys(config2));
    for (const key in keys) {
      if (config1[key].toString() !== config2[key].toString()) {
        return false;
      }
    }
    return true;
  }
}
