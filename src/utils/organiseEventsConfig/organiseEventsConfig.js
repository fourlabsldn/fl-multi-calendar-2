import permute from '../permute';
import DateHandler from '../DateHandler';

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
 * @return {Array<Array<CalEvent>>} Array containing one array of events for each day.
 */
export default function organiseEventsConfig(eventsConfig, calStartDate, dayCount) {
  // We don't want to do unnecessary work.
  if (eventsConfig.length === 0 || dayCount === 0) {
    return [];
  }

  // Get all eventViews;
  const UnfilteredEventViews = eventsConfig.map((eConfig) => {
    return new EventView(eConfig, calStartDate, dayCount);
  });

  const eventViews = UnfilteredEventViews.filter((eView) => {
    return eView.length > 0;
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

  // // Get all overlapping more-than-one-day events in overlapping groups
  // const chains = getOverlappingChains(multiDayViews);

  // Array of arrays, each representing a day of the calendar. And each
  // day array will have the events for that day.
  // Create an array of length dayCount initialised with empty arrays.
  const days = new Array(dayCount);
  for (let i = 0; i < days.length; i++) {
    days[i] = [];
  }

  // Create all possible ordering combinations for eventViews
  // and get the position combination with best score
  const bestOrdering = getBestOrder(multiDayViews, dayCount);

  // Fill days with config objects for events from bestOrdering
  const eventsByDay = bestOrdering.getOrderedEventConfigs();
  // Add events to their respective day.
  eventsByDay.forEach((dayEvents, dayNum) => {
    days[dayNum] = days[dayNum].concat(dayEvents);
  });

  // Add all other events configs to each day in the days array.
  // As singleDayViews is in chronological order, 'days' will be too.
  for (const view of singleDayViews) {
    // The days[index] array minght still not have been initialised
    days[view.offset].push(view.config);
  }

  // Return array with all events for each day.
  return days;
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
  let bestScore = 99; // just something big will work.
  for (const order of possibleOrders) {
    const ordering = new Ordering(order, dayCount);
    const score = ordering.getScore();
    if (score === 0) {
      bestOrdering = ordering;
      break;
    } else if (score < bestScore) {
      bestScore = score;
      bestOrdering = ordering;
    }
  }

  return bestOrdering || new Ordering([], dayCount);
}
