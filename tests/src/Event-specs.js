/* eslint-env jasmine */
/* globals moment */

describe('An instance of the Event class should', () => {

  let event;
  let eventClickSpy;
  const eventStartDate = moment();
  const eventEndDate = moment().add(1, 'days');
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
      startDate: eventStartDate,
      endDate: eventEndDate,
      title: eventTitle,
      description: eventDescription,
      tooltip: eventTooltip,
      ordering: {
        span: 2,
        isPlaceholder: false,
      },
    };

    event = new Event(eventConfig, parentClass, parentDate, callbacks);
  });
  // ===================
  // Presentation
  // ===================
  xit('create a title element', () => {
    expect(event.html.title).toBeDefined();
    expect(event.html.title.innerHTML).toEqual(eventTitle);
  });
  xit('create a description element', () => {
    expect(event.html.description).toBeDefined();
    expect(event.html.description.innerHTML).toEqual(eventDescription);
  });
  xit('create a tooltip element to be shown on hover', () => {
    expect(event.html.tooltip).toBeDefined();
    expect(event.html.tooltip.innerHTML).toEqual(eventTooltip);
  });
  xit('create a time element', () => {

  });

  // ===================
  // Functionality
  // ===================
  xit('trigger the eventClick when clicked upon', () => {

  });
  xit('should fire the click event when clicked.', () => {

  });
});
