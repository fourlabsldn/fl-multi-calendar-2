/* eslint-env jasmine */
import moment from '../../bower_components/moment/src/moment.js';
import Day from '../../src/Day';

describe('A Day class\'s instance should', () => {
  const title1 = 'Simple title1';
  const title2 = 'Simple title3';
  const title3 = 'Simple title2';
  const event1 = {
    id: '12345',
    title: title1,
    start: '2016-04-25 09:00:00',
    end: '2016-04-26 18:00:00',
    tooltip: 'LOL',
    classes: ['fl-mc-event-color-red'],
    ordering: {
      span: 1,
      isPlaceholder: false,
    },
  };
  const event2 = {
    id: '2345',
    title: title2,
    start: '2016-04-27 09:00:00',
    end: '2016-04-28 18:00:00',
    tooltip: 'LOdsfL',
    classes: ['fl-mc-event-color-green'],
    ordering: {
      span: 1,
      isPlaceholder: false,
    },
  };
  const event3 = {
    id: '3456',
    title: title3,
    start: '2016-04-26 09:00:00',
    end: '2016-04-27 18:00:00',
    tooltip: 'LoooOL',
    classes: ['fl-mc-event-color-blue'],
    ordering: {
      span: 1,
      isPlaceholder: false,
    },
  };

  let day;
  const dayHeaderFormat = 'DD/MM/YYYY';
  let headerClickSpy;

  beforeEach((done) => {
    headerClickSpy = jasmine.createSpy('spy');

    const date = new Date();
    const parentClass = 'super-class';
    const config = {
      dayHeaderFormat,
    };
    const callbacks = {
      dayHeaderClick: headerClickSpy,
    };
    day = new Day(date, parentClass, config, callbacks);
    done();
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

  it('trigger title click event when the title is clicked.', () => {
    day.html.header.click();
    expect(headerClickSpy).toHaveBeenCalled();
  });

  it('create events correctly', () => {
    const eventGroup = [event1, event2, event3];
    day.setEvents(eventGroup);
    expect(day.events.length).toEqual(3);
    expect(day.events[0].html.title.innerHTML).toEqual(title1);
    expect(day.events[1].html.title.innerHTML).toEqual(title2);
    expect(day.events[2].html.title.innerHTML).toEqual(title3);

    // Check that events were added to the HTML
    expect(day.html.events.children.length).toEqual(3);
    expect(day.html.events.children[0].innerHTML).toContain(title1);
    expect(day.html.events.children[1].innerHTML).toContain(title2);
    expect(day.html.events.children[2].innerHTML).toContain(title3);
  });

  it('update events correctly', () => {
    const eventGroup1 = [event1, event2];
    day.setEvents(eventGroup1);
    const eventGroup2 = [event3];
    day.setEvents(eventGroup2);
    expect(day.events.length).toEqual(1);
    expect(day.events[0].html.title.innerHTML).toEqual(title3);

    // Check that events were added to the HTML
    expect(day.html.events.children.length).toEqual(1);
    expect(day.html.events.children[0].innerHTML).toContain(title3);
  });

  it('update all events on date change', () => {
    const eventGroup1 = [event1, event2];
    day.setEvents(eventGroup1);
    day.setDate(moment().add(2, 'days'));
    expect(day.events.length).toEqual(0);
    expect(day.html.events.children.length).toEqual(0);
  });


  it('clear all events when requested', () => {
    const eventGroup1 = [event1, event2];
    day.setEvents(eventGroup1);
    day.clearEvents();
    expect(day.events.length).toEqual(0);
    expect(day.html.events.children.length).toEqual(0);
  });

  it('not change HTML if setEvents is called with the same events as last call.', () => {
    const eventGroup1 = [event1, event2];
    day.setEvents(eventGroup1);
    const eventElBefore1 = day.html.events.children[0];
    const eventElBefore2 = day.html.events.children[1];

    day.setEvents(eventGroup1);
    const eventElAfter1 = day.html.events.children[0];
    const eventElAfter2 = day.html.events.children[1];
    expect(eventElBefore1).toEqual(eventElAfter1);
    expect(eventElBefore2).toEqual(eventElAfter2);
  });

  it('add new Event without deleting other ones that should stay.', () => {
    const eventGroup1 = [event1];
    day.setEvents(eventGroup1);
    const eventElBefore1 = day.html.events.children[0];

    const eventGroup2 = [event1, event2];
    day.setEvents(eventGroup2);
    const eventElAfter1 = day.html.events.children[0];
    expect(eventElBefore1).toEqual(eventElAfter1);
    expect(day.events.length).toEqual(eventGroup2.length);
  });

  it('remove events that are not present in the new array of events configuration.', () => {
    const eventGroup1 = [event1, event2];
    day.setEvents(eventGroup1);
    const eventElBefore1 = day.html.events.children[0];

    const eventGroup2 = [event1];
    day.setEvents(eventGroup2);
    const eventElAfter1 = day.html.events.children[0];
    expect(eventElBefore1).toEqual(eventElAfter1);
    expect(day.events.length).toEqual(eventGroup2.length);
    expect(day.html.events.children.length).toEqual(eventGroup2.length);
  });
});
