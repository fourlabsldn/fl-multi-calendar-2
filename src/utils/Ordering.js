export default class Ordering {
  /**
   * @constructor
   * @param {Array<EventView>} eventViews - Event views in the order they should
   *                                      	be inserted into days.
   * @param {int} dayCount - Amount of days in the week all these events will
   *                       		be inserted.
   */
  constructor(eventViews, dayCount) {
    this.eventViews = eventViews;
    this.dayCount = dayCount;
    this._nonPaddedLaidOutEvents = this._layOut();
    // Now that all events are occupying their position it is time to
    // fill all 'undefined' spaces with configs to generate placeholders.
    this.laidOutEvents = this._addPadding();
    this.score = this._calcScore();
  }

  getScore() {
    return this.score;
  }

  getOrderedEventConfigs() {
    return this.laidOutEvents;
  }

  _layOut(eventViews = this.eventViews, dayCount = this.dayCount) {
    const days = new Array(dayCount).fill([]); // Array of arrays.

    eventViews.forEach((view) => {
      const level = this._getLevelThatEventWillFit(view, days);

      // NOTE: This is a very important part of this algorythym.
      // This creates the viewConfig object of the event that will be visible
      // spanning through more than one day. The Event class only know that
      // the wide event is visible because it has the 'span' property.
      const wideEventConfig = Object.create(view.config);
      wideEventConfig.span = view.length;
      days[view.offset][level] = wideEventConfig;

      // Fill the days where this event will be with its config. all
      // of this will yield placeholder events when the Event class creates them.
      for (let dayNum = view.offset + 1; dayNum < view.length; dayNum++) {
        days[view.offset][level] = view.config;
      }
    });
    return days;
  }

  _addPadding(eventViews = this.eventViews,
       nonPaddedLaidOutEvents = this._nonPaddedLaidOutEvents) {
    const days = Array.from(nonPaddedLaidOutEvents);
    let level = 0;
    let lastEvent = this._getFirstEventOfLevel(days, level);

    // Go through all days of the week and add events in undefined
    // slots of all levels.
    while (lastEvent) {
      for (let dayNum = 0; dayNum < days.length; dayNum++) {
        if (days[dayNum][level] === undefined) {
          days[dayNum][level] = lastEvent.config;
        } else {
          lastEvent = days[dayNum][level];
        }
      }

      level++;
      lastEvent = this._getFirstEventOfLevel(days, level);
    }

    return days;
  }

  _getFirstEventOfLevel(days, level) {
    // Will return the first value in that level != from undefined
    return days.reduce((prev, curr) => {
      return (prev[level]) ? prev[level] : curr[level];
    });
  }

  _getLevelThatEventWillFit(eView, days) {
    let level = 0;
    let fitsInLevel = false;
    while (!fitsInLevel) {
      fitsInLevel = true;

      for (let dayNum = eView.offset; dayNum < eView.length; dayNum++) {
        if (days[dayNum][level] !== undefined) {
          fitsInLevel = false;
          level++;
          break;
        }
      }
    }
    return level;
  }

  _calcScore(nonPaddedLaidOutEvents = this._nonPaddedLaidOutEvent) {
    const days = nonPaddedLaidOutEvents;
    let score;
    days.forEach((day) => {
      day.forEach((eventConfig) => {
        score += (eventConfig === undefined) ? 0 : 1;
      });
    });

    return score;
  }
}
