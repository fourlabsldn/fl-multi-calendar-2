import assert from './utils/assert.js';
import DateHandler from './DateHandler';

const EVENT_CLASS = '-event';

export default class Event {
  constructor(eventInfo, parentClass) {
    assert(typeof eventInfo === 'object',
      `Invalid eventInfo provided: ${eventInfo}`);

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

    assert(parentClass, 'No parent class provided.');
    this.class = parentClass + EVENT_CLASS;

    // Create HTML
    this.html = {};

    this.html.container = document.createElement('div');
    this.html.container.classList.add(parentClass + EVENT_CLASS);

    this.html.time = document.createElement('p');
    this.html.time.classList.add(`${this.class}-time`);

    // TODO: What if it starts or ends in a different day?
    this.html.time.innerText =
     `${DateHandler.getTime(this.startDate)} - ${DateHandler.getTime(this.endDate)}`;

    const properties = ['title', 'description', 'tooltip'];
    for (const prop of properties) {
      if (typeof eventInfo[prop] === 'string') {
        this[prop] = eventInfo[prop];
        this.html[prop] = document.createElement('p');
        this.html[prop].classList.add(`${this.class}-prop`);
        this.html[prop].innerText = this[prop];
        this.html.container.appendChild(this.html[prop]);
      }
    }

    Object.freeze(this);
  }

  getStartTime() {
    return this.startDate;
  }
}
