import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';
import ModelView from './ModelView';

const EVENT_CLASS = '-event';

/**
 * @class Event
 * @private
 */
class Event extends ModelView {
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
        'Event ordering not initialised');
    this.isPlaceholder = eventConfig.ordering.isPlaceholder;

    Object.preventExtensions(this);

    this._setPlaceHolderStatus(parentDate);

    if (this.isPlaceholder) { return; }

    this._attatchClasses(parentDate);

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

  _setPlaceHolderStatus(parentDate, eventConfig = this.config) {
    assert(typeof eventConfig.ordering.span === 'number',
      'Event configuration object not propperly handled. No "span" property found.');

    const span = eventConfig.ordering.span;
    if (this.isPlaceholder) {
      this.html.container.classList.add(
        `fl-mc-multiple-days-placeholder-${span}`
      );
    } else if (span > 0) {
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

    const startInParentDate = DateHandler.sameDay(parentDate, this.startDate);
    const endInParentDate = DateHandler.sameDay(parentDate, this.endDate);

    if (startInParentDate && endInParentDate) { return; }
    if (startInParentDate) {
      const daysToEnd = DateHandler.diff(this.endDate, parentDate, 'days', true);
      const daysToEndRound = Math.ceil(daysToEnd);
      const normalisedDaysToEnd = Math.min(daysToEndRound, 7);
      this.html.container.classList.add(
        `fl-mc-multiple-days-${normalisedDaysToEnd}`
      );
    } else {
      const daySpan = DateHandler.diff(this.endDate, this.startDate, 'days', true);
      const daySpanRound = Math.ceil(daySpan);
      const normalisedSpan = Math.min(daySpanRound, 7);
      this.html.container.classList.add(
        `fl-mc-multiple-days-placeholder-${normalisedSpan}`
      );
    }
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
