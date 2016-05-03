/* eslint-env jasmine */

import Calendar from '../../src/Calendar';

describe('An instance of the Calendar class should', () => {
  const calendarName = 'Karl Marx';
  const calendarDescription = 'Software Developer';
  const calendarId = '12345';
  const calendarConfig = {
    calendarName,
    calendarDescription,
    calendarId,
  };
  const calendarStartDate = new Date();
  const calendarParentClass = 'super-class';
  const calendarCallbacks = {
    titleClick: () => console.log('titleClick'),
    dayHeaderClick: () => console.log('dayHeaderClick'),
    eventClick: () => console.log('eventClick'),
  };

  describe('after instantiated', () => {
    let calendar;
    beforeAll(() => {
      calendar = new Calendar(
        calendarConfig,
        calendarStartDate,
        calendarParentClass,
        calendarCallbacks
      );
    });

    // ===================
    // Presentation
    // ===================
    xit('create a title element with the appropriate content form the config', () => {
      expect(calendar.html).toBeDefined();
      const calContainer = calendar.html.container;
      expect(calContainer).toBeDefined();
      expect(calContainer.innerHTML.indexOf(calendarName) > 0).toBeTruthy();
      expect(calContainer.innerHTML.indexOf(calendarDescription) > 0).toBeTruthy();
    });

    xit('create a container for day elements', () => {
      const calContainer = calendar.html.container;
      expect(calContainer.querySelector('[class*="days"]') !== undefined).toBeTruthy();
    });
  });

  // ===================
  // Functionality
  // ===================
  xit('throw an error when initialised without a config', () => {
    expect(() => {
      const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
        null,
        calendarStartDate,
        calendarParentClass,
        calendarCallbacks
      );
    }).toThrow();
  });

  xit('be instantiated without any days', () => {
    const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
      calendarConfig,
      calendarStartDate,
      calendarParentClass,
      calendarCallbacks
    );

    expect(newCalendar.getDayCount()).toEqual(0);
  });

  xit('add the correct number of days when requested', () => {
    const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
      calendarConfig,
      calendarStartDate,
      calendarParentClass,
      calendarCallbacks
    );

    for (let i = 0; i < 10; i++) {
      expect(newCalendar.getDayCount()).toEqual(i);
      newCalendar.addDay();
      expect(newCalendar.getDayCount()).toEqual(i + 1);
    }
  });

  xit('remove the correct number of days when requested', () => {
    const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
      calendarConfig,
      calendarStartDate,
      calendarParentClass,
      calendarCallbacks
    );

    const daysToBeAdded = 10;
    for (let i = 0; i < daysToBeAdded; i++) {
      newCalendar.addDay();
    }
    expect(newCalendar.getDayCount()).toEqual(daysToBeAdded);
    for (let i = daysToBeAdded; i > 0; i++) {
      newCalendar.removeDay();
      expect(newCalendar.getDayCount()).toEqual(i - 1);
    }
  });

  xit('change the date of all days when start date is changed', () => {

  });
});
