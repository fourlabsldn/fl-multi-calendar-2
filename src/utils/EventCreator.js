import DateHandler from './DateHandler';

export default class EventCreator {
  constructor() {
    return this;
  }

  /**
   * Creates events for all days of a calendar given a configuration array.
   * The result contains the events in the order they must be added.
   * @method createEvents
   * @param  {Array<Object>} eventsConfig - Array of event configuration objects
   * @param  {DateHandler} startDate - Calendar start date
   * @param  {DateHandler} calendarEndDate - Last day showing in the calendar
   * @return {Array<Array<Event>>} Array containing one array of events for each day.
   */
  createEvents(eventsConfig, calendarStartDate, calendarEndDate, parentClass, callbacks) {
    // Get all eventViews;
    const eventViews = eventsConfig.map((eConfig) => {
      return new EventView(eConfig, calendarStartDate, calendarEndDate);
    });

    // Organise all events chronologically
    eventViews.sort((v1, v2) => {
      return DateHandler.diff(v1.startDate, v2.startDate, 'minutes');
    });

    // Get all single-day and more-than-one-day events
    const multiDayViews = [];
    const singleDayViews = [];
    for (const view of eventViews) {
      const arr = (view.length > 1) ? multiDayViews : singleDayViews;
      arr.push(view);
    }

    // Get all overlapping more-than-one-day events in overlapping groups
    const chains = this._getOverlappingChains(multiDayViews);

    // Create all possible ordering combinations for them
    // and get the position combination with best score
    const bestOrderings = [];
    for (const chain of chains) {
      const bestOrdering = this._getBestOrdering(chain);
      bestOrderings.push(bestOrdering);
    }

    // Array of arrays, each representing a day of the calendar. And each
    // day array will have the events for that day.
    const days = [];

    // Create day events array from orderings
    for (const ordering of bestOrderings) {
      const eventsByDay = Ordering.createEvents(
        ordering,
        calendarStartDate,
        parentClass,
        callbacks
      );
      // Add events to the respective day.
      eventsByDay.forEach((dayEvents, idx) => {
        days[idx] = days[idx] || [];
        days[idx] = days[idx].concat(dayEvents);
      });
    }

    // Add all other events in chronological order to each day in the days array.
    for (const view of singleDayViews) {
      // The days[index] array minght still not have been initialised
      days[view.offset] = days[view.offset] || [];
      days[view.offset].push(view);
    }

    // Return array with all events for each day.
    return days;
  }

  /**
   * Returns groups of events that overlap each other.
   * @method _getOverlappingChains
   * @param  {Array<EventView>} multiDayViews
   * @return {Array<Array<EventView>>} - Chains of overlapping events.
   */
  _getOverlappingChains(multiDayViews) {
    const chains = [];

    multiDayViews.forEach((view1, idx1) => {
      multiDayViews.forEach((view2, idx2) => {
        // Avoid going here twice for the same pair
        if (idx2 <= idx1) { return; }

        if (!view1.overlaps(view2)) { return; }

        // Check if any of the two views is in any chain already.
        for (const chain of chains) {
          if (chain.includes(view1)) { chain.push(view2); return; }
          if (chain.includes(view2)) { chain.push(view1); return; }
        }

        // If it overlaps and didn't fit in any of the previous chains,
        // then create a new one for it.
        chains.push([view1, view2]);
      });
    });

    return chains;
  }

  /**
   * @method _getBestOrdering
   * @param  {Array<EventView>} eventViews - This array is ordered chronologically
   * @return {Array<Ordering>}
   */
  _getBestOrdering(eventViews) {
    // const totalPossibleOrderings = factorial(eventViews);
    // TODO: Remove events with equal start and end date from the count
    // (only if there are more than four events overlapping).

    // Find the best of all possible orderings
    const possibleOrderings = permute(eventViews);
    let bestOrdering;
    let bestScore;
    for (const ord of possibleOrderings) {
      const score = Ordering.calcScore(ord);
      if (score === 0) {
        bestOrdering = ord;
        break;
      } else if (score < bestScore) {
        bestScore = score;
        bestOrdering = ord;
      }
    }

    return bestOrdering;
  }
}

class EventView {
  constructor(config, calendarStartDate, calendarEndDate) {
    this.config = config;
    this.startDate = DateHandler.max(config.startDate, calendarStartDate);
    this.endDate = DateHandler.min(config.endDate, calendarEndDate);
    const decimalDiff = DateHandler.diff(this.startDate, this.endDate, 'days', true);
    // How many days the Event object created with this event config will take
    // given the current calendar start and end date
    this.length = Math.ceil(decimalDiff);

    // Days from the beginning of the calendar to the day the event starts
    this.offset = DateHandler.diff(calendarStartDate, this.endDate, 'days');
  }

  overlaps(otherView) {
    return DateHandler.rangesOverlap(
      this.startDate,
      this.endDate,
      otherView.startDate,
      otherView.endDate
    );
  }
}

class Ordering {
  /**
   * [createEvents description]
   * @method createEvents
   * @param  {Array<Array<EventView>>} eventViewsDays - Each subarray represents a day
   * @param  {DateHandler} calendarStartDate [description]
   * @param  {[type]} eventStuff [description]
   * @return {[type]} [description]
   */
  static createEvents(eventViewsDays, calendarStartDate, parentClass, callbacks) {
    let offset;
    // Get first element to find out from which day of
    // the week eventViewsDays is starting and make sure to
    // count that as an offset so that our returning array
    // starts from the correct date.
    for (const view of eventViewsDays[0]) {
      if (!view) { continue; }
      offset = view.offset;
    }

    let level = 0;
    let lastEvent;
    const eventsDays = [];
    // Go through all days of the week and create events for all levels.
    do {
      lastEvent = null;
      for (let i = offset; i < eventViewsDays.length; i++) {
        eventsDays[i] = eventsDays[i] || [];
        if (eventViewsDays[i][level] || lastEvent) {
          const parentDate = DateHandler.add(calendarStartDate, offset, 'days');
          eventsDays[i][level] = new Event(
            eventViewsDays[i][level].config,
            parentClass,
            parentDate,
            callbacks
          );
          lastEvent = eventViewsDays[i][level];
        } else {
          // This should create a placeholder for the event that will still
          // appear at this level.
          console.warn('One undealt with blank space passed.');
        }
      }
      level++;
    } while (lastEvent);

    // Make sure all elements are initialised before returning.
    for (let i = 0; i < eventsDays.length; i++) {
      eventsDays[i] = eventsDays[i] || [];
    }
    return eventsDays;
  }

  static calcScore(eventViews) {
    const days = [];

    eventViews.forEach((view) => {
      const offset = view.offset;
      let okForAllLevels = false;
      let level = 0;

      while (!okForAllLevels) {
        okForAllLevels = true;

        for (let dayIndex = offset; dayIndex < view.length; dayIndex++) {
          days[dayIndex] = days[dayIndex] || [];

          if (days[dayIndex][level] !== undefined) {
            okForAllLevels = false;
            level++;
            break;
          }
        }
      }

      // Fill day with event data.
      for (let dayIndex = offset; dayIndex < view.length; dayIndex++) {
        days[dayIndex][level] = view;
      }
    });

    // Now that everything is accommodated, let's calculate the scode.
    let score;
    days.forEach((day) => {
      day.forEach((val) => {
        score += val === undefined ? 0 : 1;
      });
    });

    return score;
  }
}


function permute(inp) {
  const permArr = [];
  const usedChars = [];

  function perm(input) {
    let i;
    let ch; // eslint-disable-line
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length === 0) {
        permArr.push(usedChars.slice());
      }
      perm(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  }

  return perm(inp);
}
