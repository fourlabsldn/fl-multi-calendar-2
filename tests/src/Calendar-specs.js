/* eslint-env jasmine */
import moment from 'moment';

import Calendar from '../../src/Calendar';

describe('An instance of the Calendar class should', () => {
  const calendarName = 'Karl Marx';
  const calendarDescription = 'Software Developer';
  const calendarId = '12345';
  const calendarConfig = {
    name: calendarName,
    description: calendarDescription,
    id: calendarId,
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
    it('create a title element with the appropriate content form the config', () => {
      expect(calendar.html).toBeDefined();
      const calContainer = calendar.html.container;
      expect(calContainer).toBeDefined();
      expect(calContainer.innerHTML.indexOf(calendarName) > 0).toBeTruthy();
      expect(calContainer.innerHTML.indexOf(calendarDescription) > 0).toBeTruthy();
    });

    it('create a container for day elements', () => {
      const calContainer = calendar.html.container;
      expect(calContainer.querySelector('[class*="days"]') !== undefined).toBeTruthy();
    });
  });

  // ===================
  // Functionality
  // ===================
  it('throw an error when initialised without a config', () => {
    expect(() => {
      const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
        null,
        calendarStartDate,
        calendarParentClass,
        calendarCallbacks
      );
    }).toThrow();
  });

  it('be instantiated without any days', () => {
    const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
      calendarConfig,
      calendarStartDate,
      calendarParentClass,
      calendarCallbacks
    );

    expect(newCalendar.getDayCount()).toEqual(0);
  });

  it('add the correct number of days when requested', () => {
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

  it('remove the correct number of days when requested', () => {
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
    for (let i = daysToBeAdded; i > 0; i--) {
      newCalendar.removeDay();
      expect(newCalendar.getDayCount()).toEqual(i - 1);
    }
  });

  it('change the date of all days when start date is changed', () => {
    let calStart = new Date();
    const newCalendar = new Calendar( // eslint-disable-line no-unused-vars
      calendarConfig,
      calStart,
      calendarParentClass,
      calendarCallbacks
    );

    const daysToBeAdded = 10;
    for (let i = 0; i < daysToBeAdded; i++) {
      newCalendar.addDay();
    }

    const calendarDays = [];
    newCalendar.days.forEach(day => {
      calendarDays.push(day.start);
    });

    calStart = moment(calStart).add(2, 'days');
    newCalendar.setStartDate(calStart);

    newCalendar.days.forEach((day, index) => {
      // Expect to find two days difference
      expect(moment(day.start).diff(calendarDays[index], 'days')).toEqual(2);
    });
  });
});
