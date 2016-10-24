/* eslint-env jasmine */

import moment from 'moment';
import CalEvent from '../../src/CalEvent';


describe('An instance of the CalEvent class should', () => {
  let event;
  let eventClickSpy;
  const eventStartDate = moment().format('DD/MM/YYYY');
  const eventEndDate = moment().add(1, 'days').format('DD/MM/YYYY');
  const eventTitle = 'My awesome event title'
  const eventDescription = 'Super interesting description';
  const eventTooltip = 'A tooltip';

  beforeEach(() => {
    eventClickSpy = jasmine.createSpy('spy');

    const callbacks = {
      eventClick: eventClickSpy,
    };
    const parentClass = 'super-class';
    const parentDate = new Date();
    const eventConfig = {
      start: eventStartDate,
      end: eventEndDate,
      title: eventTitle,
      description: eventDescription,
      tooltip: eventTooltip,
      ordering: {
        span: 2,
        isPlaceholder: false,
      },
    };

    event = new CalEvent(eventConfig, parentClass, parentDate, callbacks);
  });
  // ===================
  // Presentation
  // ===================
  it('create a title element', () => {
    expect(event.html.title).toBeDefined();
    expect(event.html.title.innerHTML).toEqual(eventTitle);
  });
  it('create a description element', () => {
    expect(event.html.description).toBeDefined();
    expect(event.html.description.innerHTML).toEqual(eventDescription);
  });
  it('create a tooltip element to be shown on hover', () => {
    expect(event.html.tooltip).toBeDefined();
    expect(event.html.tooltip.innerHTML).toEqual(eventTooltip);
  });
  it('create a time element', () => {
    expect(event.html.time).toBeDefined();
  });

  // ===================
  // Functionality
  // ===================
  it('trigger the eventClick when clicked upon', () => {
    event.html.container.click();
    expect(eventClickSpy).toHaveBeenCalled();
  });
});
