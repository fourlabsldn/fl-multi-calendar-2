import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';

const EVENT_CLASS = '-event';

/**
 * @class Event
 * @private
 */
class Event extends ModelView {
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

    this.updateTime();

    Object.preventExtensions(this);

    // Add classes specified to event
    if (Array.isArray(eventConfig.classes)) {
      eventConfig.classes.forEach((className) => {
        this.html.container.classList.add(className);
      });
    }

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
   * Checks whether two configurations would create the same event.
   * @static
   * @method areSame
   * @api private
   * @param  {Object} e1 Event object or event configuration object
   * @param  {Object} e2
   * @return {Boolean}
   */
  static areSame(e1, e2) {
    if (!e1 || !e2) { return false; }
    const event1 = (e1 instanceof Event) ? e1.getConfig() : e1;
    const event2 = (e2 instanceof Event) ? e2.getConfig() : e2;
    return JSON.stringify(event1) === JSON.stringify(event2);
  }
}

export default Event;
