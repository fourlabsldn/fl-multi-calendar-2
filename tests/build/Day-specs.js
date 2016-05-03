var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false

function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';

    // Strict mode doesn't allow us to use callers
    // // The assert function is calling this processCondition and we are
    // // really interested is in who is calling the assert function.
    // const assertFunction = processCondition.caller;
    //
    // if (!assertFunction) {
    //   // The program should never ever ever come here.
    //   throw new Error('No "assert" function as a caller?');
    // }
    //
    // if (assertFunction.caller && assertFunction.caller.name) {
    //   completeErrorMessage = `${assertFunction.caller.name}: `;
    // }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

function assert() {
  var error = processCondition.apply(undefined, arguments);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

assert.warn = function warn() {
  var error = processCondition.apply(undefined, arguments);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

/* globals moment */

// This class serves mainly to wrap moment.js

var DateHandler = function () {
  function DateHandler() {
    babelHelpers.classCallCheck(this, DateHandler);
  }

  babelHelpers.createClass(DateHandler, null, [{
    key: 'add',
    value: function add(date, amount, unit) {
      return moment(date).add(amount, unit);
    }
  }, {
    key: 'addDays',
    value: function addDays(date, amount) {
      return this.add(date, amount, 'day');
    }

    // Will return today's date if no date is given

  }, {
    key: 'newDate',
    value: function newDate(date) {
      return moment(date);
    }
  }, {
    key: 'format',
    value: function format(date) {
      var formatOptions = arguments.length <= 1 || arguments[1] === undefined ? 'dddd, MMM DD' : arguments[1];

      return moment(date).format(formatOptions);
    }
  }, {
    key: 'getTime',
    value: function getTime(date) {
      var format = arguments.length <= 1 || arguments[1] === undefined ? 'HH:mm' : arguments[1];

      return moment(date).format(format);
    }

    // Returns positive if date1 > date2 and 0 if they are equal.

  }, {
    key: 'diff',
    value: function diff(date1, date2) {
      var criterion = arguments.length <= 2 || arguments[2] === undefined ? 'minutes' : arguments[2];
      var floatingPoint = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      return moment(date1).diff(moment(date2), criterion, floatingPoint);
    }
  }, {
    key: 'sameDay',
    value: function sameDay(date1, date2) {
      return moment(date1).isSame(date2, 'day');
    }
  }, {
    key: 'rangesOverlap',
    value: function rangesOverlap(start1, end1, start2, end2) {
      if (moment(end1).valueOf() < moment(start2).valueOf()) {
        return false;
      }
      if (moment(end2).valueOf() < moment(start1).valueOf()) {
        return false;
      }
      return true;
    }
  }, {
    key: 'startOf',
    value: function startOf(date, criterion) {
      return moment(date).startOf(criterion);
    }
  }, {
    key: 'endOf',
    value: function endOf(date, criterion) {
      return moment(date).endOf(criterion);
    }
  }, {
    key: 'isValid',
    value: function isValid(date) {
      return date.isValid();
    }
  }, {
    key: 'max',
    value: function max(date1, date2, criterion) {
      return DateHandler.diff(date1, date2, criterion) > 0 ? date1 : date2;
    }
  }, {
    key: 'min',
    value: function min(date1, date2, criterion) {
      return DateHandler.diff(date1, date2, criterion) < 0 ? date1 : date2;
    }
  }]);
  return DateHandler;
}();

/**
 * @class ModelView
 * @abstract
 * @api private
 */

var ModelView = function ModelView(html, instanceClass) {
  var parentClass = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var containerTag = arguments.length <= 3 || arguments[3] === undefined ? 'div' : arguments[3];
  babelHelpers.classCallCheck(this, ModelView);

  assert(instanceClass, 'No instance class provided.');
  this.class = parentClass + instanceClass;

  // Create HTML
  this.html = {};

  this.html.container = document.createElement(containerTag);
  this.html.container.classList.add(this.class);

  if (!html) {
    return;
  }
  assert(Array.isArray(html), 'Parameter is not an Array.');

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = html[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      assert(prop.name, 'No property name provided.');
      var propName = prop.name;
      var propTag = prop.tag || 'div';

      this.html[propName] = document.createElement(propTag);
      this.html[propName].classList.add(this.class + '-' + propName);
      if (prop.content) {
        this.html[propName].innerHTML = prop.content;
      }

      this.html.container.appendChild(this.html[propName]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var EVENT_CLASS = '-event';

/**
 * @class Event
 * @private
 */

var Event = function (_ModelView) {
  babelHelpers.inherits(Event, _ModelView);

  function Event(eventConfig, parentClass, parentDate) {
    var callbacks = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    babelHelpers.classCallCheck(this, Event);

    assert((typeof eventConfig === 'undefined' ? 'undefined' : babelHelpers.typeof(eventConfig)) === 'object', 'Invalid event configuration object provided: ' + eventConfig);

    // Create HTML part with SuperClass
    // The html elements to be created are 'time'
    // and whatever info comes in the eventConfig
    var html = [{ name: 'time', tag: 'span', content: eventConfig.time }];

    var fields = ['title', 'description', 'tooltip'];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        if (eventConfig[field]) {
          html.push({ name: field, tag: 'span', content: eventConfig[field] });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Event).call(this, html, EVENT_CLASS, parentClass));

    _this.config = eventConfig;

    _this.callbacks = callbacks;

    assert(typeof eventConfig.start === 'string', 'Invalid event start date provided: ' + eventConfig.start);
    _this.startDate = DateHandler.newDate(eventConfig.start);

    assert(typeof eventConfig.end === 'string', 'Invalid event end date provided: ' + eventConfig.end);
    _this.endDate = DateHandler.newDate(eventConfig.end);

    assert(!eventConfig.description || typeof eventConfig.description === 'string', 'Invalid description type: ' + eventConfig.description);
    _this.description = eventConfig.description;

    assert(!eventConfig.tooltip || typeof eventConfig.tooltip === 'string', 'Invalid tooltip type: ' + eventConfig.tooltip);
    _this.tooltip = eventConfig.tooltip;

    _this.updateTime();

    assert(eventConfig.ordering && typeof eventConfig.ordering.isPlaceholder === 'boolean', 'Event ordering not initialised');
    _this.isPlaceholder = eventConfig.ordering.isPlaceholder;

    Object.preventExtensions(_this);

    _this._setPlaceHolderStatus(parentDate);

    _this._attatchClasses(parentDate);

    if (_this.isPlaceholder) {
      return babelHelpers.possibleConstructorReturn(_this);
    }

    // Setup eventClick callback
    if (typeof _this.callbacks.eventClick === 'function') {
      _this.html.container.addEventListener('click', function () {
        _this.callbacks.eventClick(_this.getConfig());
      });
    }
    return _this;
  }

  babelHelpers.createClass(Event, [{
    key: 'getStartTime',
    value: function getStartTime() {
      return this.startDate;
    }
  }, {
    key: 'updateTime',
    value: function updateTime() {
      // TODO: What if it starts or ends in a different day?
      this.html.time.textContent = DateHandler.getTime(this.startDate) + ' - ' + DateHandler.getTime(this.endDate);
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: '_setPlaceHolderStatus',
    value: function _setPlaceHolderStatus(parentDate) {
      var eventConfig = arguments.length <= 1 || arguments[1] === undefined ? this.config : arguments[1];

      var span = eventConfig.ordering.span;
      assert(typeof span === 'number', 'Event configuration object not propperly handled. No "span" property found.');
      assert(span > 0, 'Invalid span value for event configuration: ' + span);

      if (this.isPlaceholder) {
        this.html.container.classList.add('fl-mc-multiple-days-placeholder-' + span);
      } else if (span > 1) {
        this.html.container.classList.add('fl-mc-multiple-days-' + span);
      } // Else we don't need to do anything.
    }
  }, {
    key: '_attatchClasses',
    value: function _attatchClasses(parentDate) {
      var _this2 = this;

      var eventConfig = arguments.length <= 1 || arguments[1] === undefined ? this.config : arguments[1];

      // Add classes specified in config
      if (Array.isArray(eventConfig.classes)) {
        eventConfig.classes.forEach(function (className) {
          _this2.html.container.classList.add(className);
        });
      }
    }

    /**
     * Checks whether two configurations would create the same event.
     * @static
     * @method areSame
     * @api private
     * @param  {Object} e1 Event object or event configuration object
     * @param  {Object} e2
     * @return {Boolean}
     */

  }], [{
    key: 'areSame',
    value: function areSame(e1, e2) {
      if (!e1 || !e2) {
        return false;
      }
      var event1 = e1 instanceof Event ? e1.getConfig() : e1;
      var event2 = e2 instanceof Event ? e2.getConfig() : e2;
      return JSON.stringify(event1) === JSON.stringify(event2);
    }
  }]);
  return Event;
}(ModelView);

var DAY_CLASS = '-day';
var DEFAULT_HEADER_FORMAT = 'dddd, MMM DD';

/**
 * @class Day
 * @api private
 */

var Day = function (_ModelView) {
  babelHelpers.inherits(Day, _ModelView);

  function Day(date, parentClass) {
    var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var callbacks = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    babelHelpers.classCallCheck(this, Day);

    // Create HTML part with SuperClass
    var html = [{ name: 'header', tag: 'header' }, { name: 'events' }];

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Day).call(this, html, DAY_CLASS, parentClass));

    _this.date = null;
    _this.start = null;
    _this.end = null;

    _this.callbacks = callbacks;

    _this.headerFormat = typeof config.dayHeaderFormat === 'string' ? config.dayHeaderFormat : DEFAULT_HEADER_FORMAT;

    // The order of this array doesn't matter.
    _this.events = [];

    Object.preventExtensions(_this);
    // -------- end of attribute creation ---------

    if (typeof callbacks.dayHeaderClick === 'function') {
      _this.html.header.addEventListener('click', function () {
        var eventConfigs = [];
        _this.events.forEach(function (ev) {
          eventConfigs.push(ev.getConfig());
        });
        _this.callbacks.dayHeaderClick(_this.date, eventConfigs);
      });
    }

    _this.setDate(date);
    return _this;
  }

  babelHelpers.createClass(Day, [{
    key: 'updateHeader',
    value: function updateHeader() {
      this.html.header.textContent = DateHandler.format(this.date, this.headerFormat);
    }
  }, {
    key: 'addEvent',
    value: function addEvent(eventInfo) {
      var newEvent = new Event(eventInfo, this.class, this.date, this.callbacks);
      assert(newEvent && newEvent.html && newEvent.html.container, 'New Event instance initialised without an HTML container.');

      // TODO: Check on adding new events when other events are
      // already there. This is what the commented out code is for.
      // // Insert new event in the right place in the HTML.
      // let insertedBeforeEvent = false;
      // for (const event of this.events) {
      //   const timeDiff = DateHandler.diff(
      //     newEvent.getStartTime(),
      //     event.getStartTime(),
      //     'minutes'
      //   );
      //   const eventStartsAfter = timeDiff < 0;
      //   if (eventStartsAfter) {
      //     const oldEventIndex = this.events.indexOf(event);
      //     assert(typeof oldEventIndex === 'number',
      //       'Weird bug in time comparison.');
      //     insertedBeforeEvent = true;
      //
      //     // insert before event that starts later.
      //     this.html.events.insertBefore(
      //       newEvent.html.container,
      //       event.html.container
      //     );
      //   }
      // }
      //
      // if (!insertedBeforeEvent) {
      //   // Either there are no events in this.events or all
      //   // of them begin before newEvent.
      //   this.html.events.appendChild(newEvent.html.container);
      // }

      this.html.events.appendChild(newEvent.html.container);
      // Now add it to the events array.
      this.events.push(newEvent);
    }

    /**
     * @method setEvents
     * @api private
     * @param  {Array<Object>}  newEventsConfig   array of event configuration objects
     */

  }, {
    key: 'setEvents',
    value: function setEvents(newEventsConfig) {
      var _this2 = this;

      assert.warn(Array.isArray(newEventsConfig), 'Invalid array of configuration events,\n      clearing all events from day ' + this.date.toString() + '.');

      var sameAmountOfEvents = newEventsConfig.length === this.events.length;
      var allEventsAreSame = newEventsConfig.reduce(function (outcome, newEvent, newEventIdx) {
        var areSameEvents = Event.areSame(newEvent, _this2.events[newEventIdx]);
        return outcome && areSameEvents;
      }, true);

      if (sameAmountOfEvents && allEventsAreSame) {
        return;
      }

      this.clearEvents();
      newEventsConfig.forEach(function (newEvent) {
        _this2.addEvent(newEvent);
      });
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      return this.date;
    }
  }, {
    key: 'getStart',
    value: function getStart() {
      return this.start;
    }
  }, {
    key: 'getEnd',
    value: function getEnd() {
      return this.end;
    }

    // Expects a date object

  }, {
    key: 'setDate',
    value: function setDate(newDate) {
      assert((typeof newDate === 'undefined' ? 'undefined' : babelHelpers.typeof(newDate)) === 'object', 'No date object provided.');
      this.date = newDate;
      this.start = DateHandler.startOf(this.date, 'day');
      this.end = DateHandler.endOf(this.date, 'day');
      this.updateHeader();
      this._todayColor();
    }
  }, {
    key: 'clearEvents',
    value: function clearEvents() {
      var events = arguments.length <= 0 || arguments[0] === undefined ? this.events : arguments[0];

      var eventsNo = events.length;
      for (var i = 0; i < eventsNo; i++) {
        var event = events.pop(); // Remove JS reference
        event.html.container.remove(); // Remove DOM reference
        event = null; // Make object available to be garbage collected
      }
    }
  }, {
    key: 'removeEvent',
    value: function removeEvent(event) {
      var idx = this.events.indexOf(event);
      if (idx >= 0) {
        this.events.splice(idx, 1);
      } else {
        assert.warn('Trying to remove an event that was not in day.\n                  Event starting ' + event.start + ' for id ' + event.id + '.');
        return;
      }
      event.html.container.remove(); // Remove DOM reference
      event = null; // Make object available to be garbage collected
    }

    /**
     *  Assigns a different class to the container if
     *  this instance represents today's date
     * @private
     * @method _todayColor
     * @param  {DateHandler}    date [optional]
     * @return {void}
     */

  }, {
    key: '_todayColor',
    value: function _todayColor() {
      var date = arguments.length <= 0 || arguments[0] === undefined ? this.date : arguments[0];

      if (DateHandler.sameDay(date, DateHandler.newDate())) {
        this.html.container.classList.add(this.class + '-today');
      } else {
        this.html.container.classList.remove(this.class + '-today');
      }
    }

    /**
     * Checks whether an event that uses the same configuration object
     * is already being displayer.
     * @method hasEvent
     * @api private
     * @param  {Object}  eventConfig
     * @return {Boolean}
     */

  }, {
    key: 'hasEvent',
    value: function hasEvent(eventConfig) {
      return this.events.some(function (x) {
        return Event.isSame(x.config(), eventConfig);
      });
    }
  }]);
  return Day;
}(ModelView);

describe('A Day class\'s instance should', function () {
  var day = void 0;
  var dayHeaderFormat = 'DD/MM/YYYY';
  beforeAll(function () {
    var date = new Date();
    var parentClass = 'super-class';
    var config = {
      dayHeaderFormat: dayHeaderFormat
    };
    var callbacks = {};
    day = new Day(date, parentClass, config, callbacks);
  });
  // ===================
  // Presentation
  // ===================
  describe('create day element with', function () {
    it('date title', function () {
      expect(day.html.header).toBeDefined();
      expect(day.html.container.querySelector('[class*=header]')).toBeDefined();
    });
    it('events space', function () {
      expect(day.html.events).toBeDefined();
      expect(day.html.container.querySelector('[class*=events]')).toBeDefined();
    });
  });

  it('highlight the html element if it refers to the current day.', function () {
    expect(day.html.events).toBeDefined();
  });
  it('show the specified date', function () {
    day.setDate(new Date());
    var diff = Math.abs(moment(day.html.header).diff(new Date(), 'days'));
    expect(diff).toEqual(0);
  });
  it('show the date in the correct format', function () {
    day.setDate(new Date());
    var dayHeader = day.html.header.innerHTML;
    var dateInCorrectFormat = moment().format(dayHeaderFormat);
    expect(dayHeader).toEqual(dateInCorrectFormat);
  });

  // ===================
  // Functionality
  // ===================
  it('change day when commanded to.', function () {
    day.setDate(new Date());
    var dayDate1 = moment(day.date).format(dayHeaderFormat);
    day.setDate(moment().add(3, 'days'));
    var dayDate2 = moment(day.date).format(dayHeaderFormat);
    expect(dayDate1).not.toEqual(dayDate2);
  });

  xit('trigger title click event when the title is clicked.', function () {});

  xit('create events correctly', function () {});
  xit('update events correctly', function () {});

  xit('update all events on date change', function () {});
  xit('update all events without date change when requested', function () {});

  xit('clear all events when requested', function () {});

  xit('not change HTML if setEvents is called with the same events as last call.', function () {});
  xit('add new Event without deleting other ones that should stay.', function () {});
  xit('remove events that are not present in the new array of events configuration.', function () {});
});
//# sourceMappingURL=Day-specs.js.map
