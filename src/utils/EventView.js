import DateHandler from './DateHandler';

export default class EventView {
  constructor(config, calStartDate, dayCount) {
    this.config = config;
    this.startDate = DateHandler.max(config.start, calStartDate);

    const calEndDate = DateHandler.add(calStartDate, dayCount - 1);
    this.endDate = DateHandler.min(config.end, calEndDate);

    const decimalDiff = DateHandler.diff(this.startDate, this.endDate, 'days', true);
    // How many days the Event object created with this event config will take
    // given the current calendar start and end date
    this.length = Math.ceil(decimalDiff);

    // NOTE: This is altering the config object iself.
    // This will be used by the Event class afterwards.
    this.config.ordering = this.config.ordering || {};
    this.config.ordering.span = this.length;
    this.config.ordering.isPlaceholder = false;

    // Days from the beginning of the calendar to the day the event starts
    this.offset = DateHandler.diff(calStartDate, this.endDate, 'days');
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
