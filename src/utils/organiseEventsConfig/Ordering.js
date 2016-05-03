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

      const eventStartIdx = view.offset;
      const eventEndIdx = view.offset + view.length - 1;
      days[eventStartIdx][level] = visibleEventConfig;

      // Fill the days where this event will be with its config. all
      // of this will yield placeholder events when the Event class creates them.
      for (let dayNum = eventStartIdx + 1; dayNum <= eventEndIdx; dayNum++) {
        days[dayNum][level] = view.config;
      }
    });
    return days;
  }

  _addPadding(nonPaddedLaidOutEvents = this._nonPaddedLaidOutEvents) {
    const days = nonPaddedLaidOutEvents.slice(0);
    days.forEach((day) => {
      // We need to use a for loop instead of a forEach because the forEach
      // will skip unset Array values and those are exactly the ones we are
      // trying to find.
      for (let levelNum = 0; levelNum < day.length; levelNum++) {
        if (day[levelNum] === undefined) {
          day[levelNum] = this._getPlaceholderFor(days, levelNum);
        }
      }
    });
    return days;
  }

  /**
   * Returns the first placeholder element found in the specified level
   * @method _getPlaceholderFor
   * @param  {Array<Array<Object>>} days - Array of Arrays containing eventConfig data
   * @param  {int} levelNum - Level where placeholder must be found.
   * @return {Object} Will return undefined if nothing is found.
   */
  _getPlaceholderFor(days, levelNum) {
    for (let i = 0; i < days.length; i++) {
      const slotContent = days[i][levelNum];
      if (slotContent &&
          slotContent.ordering &&
          slotContent.ordering.isPlaceholder) {
        return slotContent;
      }
    }

    return undefined;
  }
  _getLevelThatEventWillFit(eView, days) {
    let level = 0;
    let fitsInLevel = false;

    // Minus one because length starts from 1 and indexes start from 0.
    const eventEndIdx = eView.offset + eView.length - 1;
    const eventStartIdx = eView.offset;

    while (!fitsInLevel) {
      fitsInLevel = true;

      for (let dayNum = eventStartIdx; dayNum <= eventEndIdx; dayNum++) {
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
      // We need to use a for loop instead of a forEach because the forEach
      // will skip unset Array values and those are exactly the ones we are
      // trying to cound.
      for (let level = 0; level < day.length; level++) {
        score += (day[level] === undefined) ? 0 : 1;
      }
    });

    return score;
  }
}
