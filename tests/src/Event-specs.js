/* eslint-env jasmine */

describe('An instance of the Event class should', () => {

  let event;
  let eventClickSpy;
  const eventStartDate = moment();
  const eventEndDate = moment().add(1, 'days');
  const eventDescription = 'My Awesome event';

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
      description: eventDescription,
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
    // expect(event.html.title).toBeDefined();
  });
  xit('create a description element', () => {
    // expect(event.html.title).toBeDefined();
  });
  xit('create a tooltip element to be shown on hover', () => {

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
