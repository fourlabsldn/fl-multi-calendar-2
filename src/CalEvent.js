import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';

const EVENT_CLASS = '-event';

/**
 * @class CalEvent
 * @private
 */
class CalEvent extends ModelView {
  constructor(eventConfig, parentClass, parentDate, callbacks = {}) {
    assert(typeof eventConfig === 'object',
      `Invalid event configuration object provided: ${eventConfig}`);

    // Create HTML part with SuperClass
    // The html elements to be created are 'time'
    // and whatever info comes in the eventConfig
    const html = [{ name: 'time', tag: 'span', content: eventConfig.time }];

    const fields = ['title', 'description', 'tooltip'];
    for (const field of fields) {
      if (eventConfig[field]) {
        html.push({ name: field, tag: 'span', content: eventConfig[field] });
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

    assert(eventConfig.ordering &&
        typeof eventConfig.ordering.isPlaceholder === 'boolean',
        'CalEvent ordering not initialised');
    this.isPlaceholder = eventConfig.ordering.isPlaceholder;

    Object.preventExtensions(this);

    this._setPlaceHolderStatus(parentDate);

    this._attatchClasses(parentDate);

    if (this.isPlaceholder) { return; }

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
    const multiDayEvent = (this.config.ordering.span && this.config.ordering.span > 1);
    const singleDayformat = 'HH:mm';
    const multiDayFormat = 'MMM DD HH:mm';

    const format = multiDayEvent ? multiDayFormat : singleDayformat;
    const startTime = DateHandler.format(this.startDate, format);
    const endTime = DateHandler.format(this.endDate, format);
    this.html.time.textContent = `${startTime} - ${endTime}`;
  }

  getConfig() {
    return this.config;
  }

  _setPlaceHolderStatus(parentDate, eventConfig = this.config) {
    const span = eventConfig.ordering.span;
    assert(typeof span === 'number',
      'CalEvent configuration object not propperly handled. No "span" property found.');
    assert(span > 0, `Invalid span value for event configuration: ${span}`);

    if (this.isPlaceholder) {
      this.html.container.classList.add(
        `fl-mc-multiple-days-placeholder-${span}`
      );
    } else if (span > 1) {
      this.html.container.classList.add(
        `fl-mc-multiple-days-${span}`
      );
    } // Else we don't need to do anything.
  }

  _attatchClasses(parentDate, eventConfig = this.config) {
    // Add classes specified in config
    if (Array.isArray(eventConfig.classes)) {
      eventConfig.classes.forEach((className) => {
        this.html.container.classList.add(className);
      });
    }
  }

  /**
   * Checks whether two configurations would create the same event.
   * @static
   * @method areSame
   * @api private
   * @param  {Object} e1 CalEvent object or event configuration object
   * @param  {Object} e2
   * @return {Boolean}
   */
  static areSame(e1, e2) {
    if (!e1 || !e2) { return false; }
    const event1 = (e1 instanceof CalEvent) ? e1.getConfig() : e1;
    const event2 = (e2 instanceof CalEvent) ? e2.getConfig() : e2;
    return JSON.stringify(event1) === JSON.stringify(event2);
  }
}

export default CalEvent;
