/* eslint-env jasmine */

describe('A Day class\'s instance should', () => {
  // ===================
  // Presentation
  // ===================
  describe('create day element with', () => {
    xit('date title');
    xit('events space');
  });

  xit('highlight the html element if it refers to the current day.');
  xit('show the specified date');
  xit('show the date in the correct format');

  // ===================
  // Functionality
  // ===================
  xit('change day when commanded to.');
  xit('trigger title click event when the title is clicked.');

  xit('create events correctly');
  xit('update events correctly');

  xit('update all events on date change');
  xit('update all events without date change when requested');

  xit('clear all events when requested');

  xit('not change HTML if setEvents is called with the same events as last call.');
  xit('add new Event without deleting other ones that should stay.');
  xit('remove events that are not present in the new array of events configuration.');
});
