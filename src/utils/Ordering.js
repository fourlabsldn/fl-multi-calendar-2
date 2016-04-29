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

  // Specifies who will be a placeholder and who won't and puts everyone
  // in the right place in an array of dayCount size.
  _layOut(eventViews = this.eventViews, dayCount = this.dayCount) {
    // Create days as an Array of arrays of length dayCount.
    const days = new Array(dayCount);
    for (let i = 0; i < days.length; i++) {
      days[i] = [];
    }

    eventViews.forEach((view) => {
      const level = this._getLevelThatEventWillFit(view, days);

      // NOTE: This is a very important part of this algorythym.
      // This creates the eventConfig object of the event that will be visible
      // spanning through more than one day. The Event class only know that
      // the event will be visible because of the isPlaceholder value.
      const visibleEventConfig = Object.create(view.config);
      visibleEventConfig.ordering = Object.create(view.config.ordering);
      // All configs apart from the visibleEventConfig are set to be
      // placeholders.
      visibleEventConfig.ordering.isPlaceholder = false;
      view.config.ordering.isPlaceholder = true;
      days[view.offset][level] = visibleEventConfig;

      // Fill the days where this event will be with its config. all
      // of this will yield placeholder events when the Event class creates them.
      for (let dayNum = view.offset + 1; dayNum < (view.offset + view.length); dayNum++) {
        days[dayNum][level] = view.config;
      }
    });
    return days;
  }

  _addPadding(nonPaddedLaidOutEvents = this._nonPaddedLaidOutEvents) {
    const days = Array.from(nonPaddedLaidOutEvents);
    let level = 0;
    let lastEvent = this._getFirstEventOfLevel(days, level);

    // Go through all days of the week and add events in undefined
    // slots of all levels.
    while (lastEvent) {
      for (let dayNum = 0; dayNum < days.length; dayNum++) {
        if (days[dayNum][level] === undefined) {
          days[dayNum][level] = lastEvent;
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
    return days.reduce((firstOfLevel, day) => {
      return firstOfLevel || day[level];
    }, null);
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

  _calcScore(nonPaddedLaidOutEvents = this._nonPaddedLaidOutEvents) {
    const days = nonPaddedLaidOutEvents;
    let score = 0;
    days.forEach((day) => {
      day.forEach((eventConfig) => {
        score += (eventConfig === undefined) ? 0 : 1;
      });
    });

    return score;
  }
}
