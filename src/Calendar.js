import assert from './utils/assert.js';

export default class Calendar {
  constructor(config) {
    assert(config, 'No calendar configuration object provided.');

    assert(config.name, 'No calendar name provided for one of the calendars.');
    this.name = config.name;

    assert(config.id, `No ID provided for calendar "${config.name}"`);
    this.id = config.id;

    // Create html element.
    Object.freeze(this);
  }
}
