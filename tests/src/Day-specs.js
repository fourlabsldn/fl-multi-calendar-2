/* eslint-env jasmine */
/* globals moment */

import Day from '../../src/Day';

describe('A Day class\'s instance should', () => {
  let day;
  const dayHeaderFormat = 'DD/MM/YYYY';
  beforeAll(() => {
    const date = new Date();
    const parentClass = 'super-class';
    const config = {
      dayHeaderFormat,
    };
    const callbacks = {};
    day = new Day(date, parentClass, config, callbacks);
  });
  // ===================
  // Presentation
  // ===================
  describe('create day element with', () => {
    it('date title', () => {
      expect(day.html.header).toBeDefined();
      expect(day.html.container.querySelector('[class*=header]')).toBeDefined();
    });
    it('events space', () => {
      expect(day.html.events).toBeDefined();
      expect(day.html.container.querySelector('[class*=events]')).toBeDefined();
    });
  });

  it('highlight the html element if it refers to the current day.', () => {
    expect(day.html.events).toBeDefined();
  });
  it('show the specified date', () => {
    day.setDate(new Date());
    const diff = Math.abs(moment(day.html.header).diff(new Date(), 'days'));
    expect(diff).toEqual(0);
  });
  it('show the date in the correct format', () => {
    day.setDate(new Date());
    const dayHeader = day.html.header.innerHTML;
    const dateInCorrectFormat = moment().format(dayHeaderFormat);
    expect(dayHeader).toEqual(dateInCorrectFormat);
  });

  // ===================
  // Functionality
  // ===================
  it('change day when commanded to.', () => {
    day.setDate(new Date());
    const dayDate1 = moment(day.date).format(dayHeaderFormat);
    day.setDate(moment().add(3, 'days'));
    const dayDate2 = moment(day.date).format(dayHeaderFormat);
    expect(dayDate1).not.toEqual(dayDate2);
  });

  xit('trigger title click event when the title is clicked.', () => {

  });

  xit('create events correctly', () => {

  });
  xit('update events correctly', () => {

  });

  xit('update all events on date change', () => {

  });
  xit('update all events without date change when requested', () => {

  });

  xit('clear all events when requested', () => {

  });

  xit('not change HTML if setEvents is called with the same events as last call.', () => {

  });
  xit('add new Event without deleting other ones that should stay.', () => {

  });
  xit('remove events that are not present in the new array of events configuration.', () => {

  });
});
