/* globals moment */

// This class serves mainly to wrap moment.js
export default class DateHandler {
  static addDays(date, amount) {
    return moment(date).add(amount, 'day');
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

  // Returns if date1 is at least one minute after date2
  static isGreater(date1, date2) {
    const difference = moment(date1).diff(moment(date2), 'minutes');
    return difference > 0;
  }
}
