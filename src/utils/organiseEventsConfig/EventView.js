import DateHandler from '../DateHandler';

export default class EventView {
  constructor(config, calStartDate, dayCount) {
    this.config = config;
    this.startDate = DateHandler.max(config.start, calStartDate);

    const calEndDate = DateHandler.add(calStartDate, dayCount - 1, 'days').endOf('day');
    this.endDate = DateHandler.min(config.end, calEndDate);

    const decimalDiff = DateHandler.diff(this.endDate, this.startDate, 'days', true);
    // If calendar finished before this event's end date or ends
    // before this event's start date, then there is nothing else to do.
    if (decimalDiff < 0) {
      // Negative length specifies that the view should not be added to calendar
      this.length = -1;
      return;
    }

    // How many days the CalEvent object created with this event config will take
    // given the current calendar start and end date
    this.length = Math.ceil(decimalDiff);

    // NOTE: This is altering the config object iself.
    // This will be used by the CalEvent class afterwards.
    this.config.ordering = this.config.ordering || {};
    this.config.ordering.span = this.length;
    this.config.ordering.isPlaceholder = false;

    // Days from the beginning of the calendar to the day the event starts
    this.offset = DateHandler.diff(this.startDate, calStartDate, 'days');
  }

  overlaps(otherView) {
    return DateHandler.rangesOverlap(
      this.startDate,
      this.endDate,
      otherView.startDate,
      otherView.endDate
    );
  }

  diff(otherView, criterion = 'minutes') {
    return DateHandler.diff(this.startDate, otherView.startDate, criterion);
  }
}
