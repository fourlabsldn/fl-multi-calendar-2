/* globals moment */

// This class serves mainly to wrap moment.js
export default class DateHandler {
  static add(date, amount, unit) {
    return moment(date).add(amount, unit);
  }

  static addDays(date, amount) {
    return this.add(date, amount, 'day');
  }

  // Will return today's date if no date is given
  static newDate(date) {
    return moment(date);
  }

  static format(date, formatOptions = 'dddd, MMM DD') {
    return moment(date).format(formatOptions);
  }

  static getTime(date, format = 'HH:mm') {
    return moment(date).format(format);
  }

  // Returns positive if date1 > date2 and 0 if they are equal.
  static diff(date1, date2, criterion = 'minutes', floatingPoint = false) {
    return moment(date1).diff(moment(date2), criterion, floatingPoint);
  }

  static sameDay(date1, date2) {
    return moment(date1).isSame(date2, 'day');
  }

  static rangesOverlap(start1, end1, start2, end2) {
    if (moment(end1).valueOf() < moment(start2).valueOf()) { return false; }
    if (moment(end2).valueOf() < moment(start1).valueOf()) { return false; }
    return true;
  }

  static startOf(date, criterion) {
    return moment(date).startOf(criterion);
  }

  static endOf(date, criterion) {
    return moment(date).endOf(criterion);
  }

  static isValid(date) {
    return date.isValid();
  }
}
