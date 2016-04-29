import permute from './permute';
import Ordering from './Ordering';
import EventView from './EventView';

/**
 * Creates events for all days of a calendar given a configuration array.
 * The result contains the events in the order they must be added.
 * It also modifies the configuration object of events that span through
 * more than one day.
 * @function organiseEventsConfig
 * @param  {Array<Object>} eventsConfig - Array of event configuration objects
 * @param  {DateHandler} startDate - Calendar start date
 * @param  {Int} dayCount - Amount of days in calendar. Minimum value = 1
 * @return {Array<Array<Event>>} Array containing one array of events for each day.
 */
export default function organiseEventsConfig(eventsConfig, calStartDate, dayCount) {
  // Get all eventViews;
  const eventViews = eventsConfig.map((eConfig) => {
    return new EventView(eConfig, calStartDate, dayCount);
  });

  // Organise all events chronologically
  eventViews.sort((v1, v2) => {
    return v1.diff(v2, 'minutes');
  });

  // Get all single-day and more-than-one-day events
  const multiDayViews = [];
  const singleDayViews = [];
  for (const view of eventViews) {
    const arr = (view.length > 1) ? multiDayViews : singleDayViews;
    arr.push(view);
  }

  // Get all overlapping more-than-one-day events in overlapping groups
  const chains = getOverlappingChains(multiDayViews);

  // Create all possible ordering combinations for them
  // and get the position combination with best score
  const bestOrderings = [];
  for (const chain of chains) {
    const bestOrdering = getBestOrder(chain, dayCount);
    bestOrderings.push(bestOrdering);
  }

  // Array of arrays, each representing a day of the calendar. And each
  // day array will have the events for that day.
  // Create an array of length dayCount initialised with empty arrays.
  const days = new Array(dayCount).fill([]);

  // Fill days with config objects for events from ordered overlapping chains
  for (const ordering of bestOrderings) {
    const eventsByDay = ordering.getOrderedEventConfigs();
    // Add events to the respective day.
    eventsByDay.forEach((dayEvents, dayNum) => {
      days[dayNum] = days[dayNum].concat(dayEvents);
    });
  }

  // Add all other events configs to each day in the days array.
  // As sinfleDayViews is in chronological order, 'days' will be too.
  for (const view of singleDayViews) {
    // The days[index] array minght still not have been initialised
    days[view.offset].push(view.config);
  }

  // Return array with all events for each day.
  return days;
}

/**
 * Returns groups of events that overlap each other.
 * @function getOverlappingChains
 * @param  {Array<EventView>} multiDayViews
 * @return {Array<Array<EventView>>} - Chains of overlapping events.
 */
function getOverlappingChains(multiDayViews) {
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
 * @function _getBestOrdering
 * @param  {Array<EventView>} eventViews - This array is ordered chronologically
 * @return {Array<Ordering>}
 */
function getBestOrder(eventViews, dayCount) {
  // TODO: Remove events with equal start and end date from the count
  // (only if there are more than four events overlapping).

  // Find the best of all possible orderings
  const possibleOrders = permute(eventViews);
  let bestOrdering;
  let bestScore;
  for (const order of possibleOrders) {
    const ordering = new Ordering(order, dayCount);
    const score = ordering.getScore();
    if (score === 0) {
      bestOrdering = ordering;
      break;
    } else if (score < bestScore) {
      bestScore = ordering;
      bestOrdering = order;
    }
  }

  return bestOrdering;
}
