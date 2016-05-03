'use strict'
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

function debounce(func, wait, immediate) {
  var _this = this;

  var timeout = void 0;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = _this;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

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
 * [triggerEvent description]
 * @method triggerEvent
 * @param  {String} eventName
 * @param  {HTMLElement} [target]
 * @param  {Object} [data] - Data to be sent in the event
 * @return {void}
 */
function triggerEvent(eventName) {
  var target = arguments.length <= 1 || arguments[1] === undefined ? document.body : arguments[1];
  var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var ev = new CustomEvent(eventName, {
    detail: data,
    bubbles: true,
    cancelable: true
  });

  target.dispatchEvent(ev);
}

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

var DEFAULT_TITLE_BAR_FORMAT = 'YYYY';
var CONTROL_CLASS = '-ctrl';
var datePickerFormats = {
  week: 'YYYY-[W]WW',
  date: 'YYYY-MM-DD'
};

/**
 * @class ControlBar
 * @api private
 */

var ControlBar = function (_ModelView) {
  babelHelpers.inherits(ControlBar, _ModelView);

  /**
   * @constructor
   * @api private
   * @param  {String} parentClass
   */

  function ControlBar(parentClass, titleBarFormat) {
    babelHelpers.classCallCheck(this, ControlBar);

    var html = [{ name: 'datePicker', tag: 'input' }, { name: 'back', tag: 'button', content: '<i class=icon-chevron-left></i>' }, { name: 'forward', tag: 'button', content: '<i class=icon-chevron-right></i>' }, { name: 'today', tag: 'button', content: 'Today' }, { name: 'refresh', tag: 'button',
      content: '<i class=icon-refresh></i><i class=icon-check></i><i class=icon-times></i>' }, { name: 'titleBar', tag: 'p' }, { name: 'show-weekend', tag: 'button', content: 'Show Weekend' }];

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ControlBar).call(this, html, CONTROL_CLASS, parentClass, 'nav'));

    _this.refreshLoadingController = new ButtonLoadingController(_this.html.refresh, 'fl-mc-loading', 'fl-mc-loading-complete', 'fl-mc-loading-error');
    _this.eventListeners = {};

    _this.titleBarFormat = typeof titleBarFormat === 'string' ? titleBarFormat : DEFAULT_TITLE_BAR_FORMAT;

    Object.preventExtensions(_this);
    // --------- end of attribute creation ----------

    _this.html.datePicker.setAttribute('type', 'week');
    _this.html.datePicker.addEventListener('change', function (e) {
      assert(e.target, 'Error in datePicker\'s change event');
      _this.trigger('datePicker', e.target.value);
    });

    // Add listener to buttons
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var el = _step.value;

        if (el.tag !== 'button') {
          return 'continue';
        }
        _this.html[el.name].addEventListener('click', function (e) {
          assert(e.target, 'Error in ' + el.name + '\'s change event');
          _this.trigger(el.name, e);
        });
      };

      for (var _iterator = html[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ret = _loop();

        if (_ret === 'continue') continue;
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

    return _this;
  }

  /**
   * Returns the start date of the controlBar
   * @method getDate
   * @return {DateHandler}
   */


  babelHelpers.createClass(ControlBar, [{
    key: 'getDate',
    value: function getDate() {
      return this._getDatePickerDate();
    }

    /**
     * Sets the start date of control bar. The end date is automatically
     * calculated given the current dateRange
     * @method setDate
     * @param  {DateHandler} date
     */

  }, {
    key: 'setDate',
    value: function setDate(date) {
      this._setTitleBarDate(date);
      this._setDatePickerDate(date);
    }

    /**
     * Prepares the config bar to represent that dateRange
     * by changing the datepicker type and the title.
     * @method setDateRange
     * @param  {String}     range 'isoweek', 'week' or 'day'
     */

  }, {
    key: 'setDateRange',
    value: function setDateRange(range) {
      switch (range) {
        case 'isoweek':
          this._setDatePickerType('week');
          this._setShowWeekendActive(true);
          break;
        case 'week':
          this._setDatePickerType('week');
          this._setShowWeekendActive(false);
          break;
        case 'day':
          this._setDatePickerType('date');
          break;
        default:
          assert(false, 'Unexpected date range: ' + range);
      }
    }

    /**
     * Sets the state of the refresh button.
     * @method setLoadingState
     * @param  {String}        state
     */

  }, {
    key: 'setLoadingState',
    value: function setLoadingState(state) {
      switch (state) {
        case 'loading':
          this.refreshLoadingController.setLoading();
          break;
        case 'success':
          this.refreshLoadingController.setLoadingSuccess();
          break;
        case 'error':
          this.refreshLoadingController.setLoadingError();
          break;
        default:
          assert.warn(false, 'Unexpected loading state: ' + state);
          break;
      }
    }

    /**
     * @private
     * @method _getDatePickerDate
     * @return {Date}
     */

  }, {
    key: '_getDatePickerDate',
    value: function _getDatePickerDate() {
      return DateHandler.newDate(this.html.datePicker.value);
    }

    /**
     * @private
     * @method _setDatePickerDate
     * @param {Date} date
     */

  }, {
    key: '_setDatePickerDate',
    value: function _setDatePickerDate(date) {
      // Make sure we set it using the correct format.
      var format = datePickerFormats[this.html.datePicker.type];
      this.html.datePicker.value = DateHandler.format(date, format);
    }

    /**
     * @private
     * @method _setDatePickerType
     * @param {String} type 'week' or 'day';
     */

  }, {
    key: '_setDatePickerType',
    value: function _setDatePickerType(dateType) {
      if (!(typeof dateType === 'string' && datePickerFormats[dateType])) {
        assert.warn(false, 'Invalid datepicker type to be set: ' + dateType);
        return;
      }

      if (this.html.datePicker.type === dateType) {
        return;
      }

      // Change picker type and set the date in the correct format.
      var currDate = this._getDatePickerDate();
      this.html.datePicker.type = dateType;
      this._setDatePickerDate(currDate);
    }

    /**
     * @private
     * @method _setTitleBarDate
     * @param {DateHandler | Date} date
     * @param {String} [format] - A format string for the title bar.
     */

  }, {
    key: '_setTitleBarDate',
    value: function _setTitleBarDate(date) {
      var format = arguments.length <= 1 || arguments[1] === undefined ? this.titleBarFormat : arguments[1];

      this.html.titleBar.innerHTML = DateHandler.format(date, format);
    }
    /**
     * Assigns a callback to be called by this.trigger when the event happens
     * @method listenTo
     * @param  {String}   eventName
     * @param  {Function} callback
     * @return {void}
     */

  }, {
    key: 'listenTo',
    value: function listenTo(eventName, callback) {
      assert(typeof callback === 'function', 'Invalid callback.');
      this.eventListeners[eventName] = this.eventListeners[eventName] || [];
      this.eventListeners[eventName].push(callback);
    }

    /**
     * Calls all callbacks assigned to an event with this.listenTo.
     * @method trigger
     * @param  {String} eventName
     * @param  {Anything} ...parameters
     * @return {void}
     */

  }, {
    key: 'trigger',
    value: function trigger(eventName) {
      if (!this.eventListeners[eventName]) {
        return;
      }

      for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        parameters[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.eventListeners[eventName][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var callback = _step2.value;

          callback.apply({}, parameters);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * @private
     * @method _setShowWeekendActive
     * @param {Boolean} active
     */

  }, {
    key: '_setShowWeekendActive',
    value: function _setShowWeekendActive(active) {
      var activeClass = 'fl-mc-active';
      if (active) {
        this.html['show-weekend'].classList.remove(activeClass);
        this.html['show-weekend'].textContent = 'Show weekends';
      } else {
        this.html['show-weekend'].classList.add(activeClass);
        this.html['show-weekend'].textContent = 'Hide weekends';
      }
    }
  }]);
  return ControlBar;
}(ModelView);

var ButtonLoadingController = function () {
  function ButtonLoadingController(button, loadingClass, successClass, errorClass) {
    babelHelpers.classCallCheck(this, ButtonLoadingController);

    // Make sure we never handle a button twice.
    if (button.loadingIsHandled) {
      return;
    }
    button.loadingIsHandled = true;

    this.button = button;
    this.loadingClass = loadingClass;
    this.successClass = successClass;
    this.errorClass = errorClass;

    this._removeAllLoadingClasses();

    // Minimum time showing 'complete' or 'error' symbol.
    this.minAnimationTime = 500;
    this.minIconTime = 1500;

    // Time button was set to loading
    this.loadingStartTime = null;

    this.outcomeTimeout = null;
  }

  babelHelpers.createClass(ButtonLoadingController, [{
    key: 'setLoading',
    value: function setLoading() {
      clearTimeout(this.outcomeTimeout);
      this._removeAllLoadingClasses();
      this.button.classList.add(this.loadingClass);
      this.loadingStartTime = DateHandler.newDate();
    }
  }, {
    key: 'setLoadingSuccess',
    value: function setLoadingSuccess() {
      this._completeLoadingWithSuccessStatus(true);
    }
  }, {
    key: 'setLoadingError',
    value: function setLoadingError() {
      this._completeLoadingWithSuccessStatus(false);
    }

    /**
     * Shows a success or failure icon for a certain period of time.
     * @private
     * @method _completeLoadingWithSuccessStatus
     * @param  {Boolean} success
     * @return {void}
     */

  }, {
    key: '_completeLoadingWithSuccessStatus',
    value: function _completeLoadingWithSuccessStatus(success) {
      var _this2 = this;

      clearTimeout(this.outcomeTimeout);

      var outcomeClass = success ? this.successClass : this.errorClass;
      var remainingDelay = this._timeToAnimationTimeoutEnd();

      // This timeout will be cancelled if either this function or
      // setLoading are called
      this.outcomeTimeout = setTimeout(function () {
        _this2._removeAllLoadingClasses();
        // Show with the completed class for at least minTimeout miliseconds
        _this2.button.classList.add(outcomeClass);

        // This timeout will be cancelled if either this function or
        // setLoading are called
        _this2.outcomeTimeout = setTimeout(function () {
          _this2._removeAllLoadingClasses();
        }, _this2.minIconTime);
      }, remainingDelay);
    }

    /**
     * @private
     * @method _removeAllLoadingClasses
     * @return {void}
     */

  }, {
    key: '_removeAllLoadingClasses',
    value: function _removeAllLoadingClasses() {
      this.button.classList.remove(this.loadingClass);
      this.button.classList.remove(this.successClass);
      this.button.classList.remove(this.errorClass);
    }

    /**
    * Time remaining to minTimeout
     * @private
     * @method _timeToAnimationTimeoutEnd
     * @param  {DateHandler} timeoutStart
     * @param  {int} minTimeout
     * @param  {int} now
     * @return {int}
     */

  }, {
    key: '_timeToAnimationTimeoutEnd',
    value: function _timeToAnimationTimeoutEnd() {
      var timeoutStart = arguments.length <= 0 || arguments[0] === undefined ? this.loadingStartTime : arguments[0];
      var minTimeout = arguments.length <= 1 || arguments[1] === undefined ? this.minAnimationTime : arguments[1];
      var now = arguments.length <= 2 || arguments[2] === undefined ? DateHandler.newDate() : arguments[2];

      var delayEndTime = DateHandler.add(timeoutStart, minTimeout, 'milliseconds');
      var remainingDelay = DateHandler.diff(delayEndTime, now, 'milliseconds');
      return Math.max(remainingDelay, 0);
    }
  }]);
  return ButtonLoadingController;
}();

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

    if (_this.isPlaceholder) {
      return babelHelpers.possibleConstructorReturn(_this);
    }

    _this._attatchClasses(parentDate);

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

// Returns all possible permutations of an array of values.
function permute(inp) {
  var permArr = [];
  var usedChars = [];

  function perm(input) {
    var i = void 0;
    var ch = void 0; // eslint-disable-line
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length === 0) {
        permArr.push(usedChars.slice());
      }
      perm(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  }

  return perm(inp);
}

var Ordering = function () {
  /**
   * @constructor
   * @param {Array<EventView>} eventViews - Event views in the order they should
   *                                      	be inserted into days.
   * @param {int} dayCount - Amount of days in the week all these events will
   *                       		be inserted.
   */

  function Ordering(eventViews, dayCount) {
    babelHelpers.classCallCheck(this, Ordering);

    this.eventViews = eventViews;
    this.dayCount = dayCount;
    this._nonPaddedLaidOutEvents = this._layOut();
    // Now that all events are occupying their position it is time to
    // fill all 'undefined' spaces with configs to generate placeholders.
    this.laidOutEvents = this._addPadding();
    this.score = this._calcScore();
  }

  babelHelpers.createClass(Ordering, [{
    key: "getScore",
    value: function getScore() {
      return this.score;
    }
  }, {
    key: "getOrderedEventConfigs",
    value: function getOrderedEventConfigs() {
      return this.laidOutEvents;
    }

    // Specifies who will be a placeholder and who won't and puts everyone
    // in the right place in an array of dayCount size.

  }, {
    key: "_layOut",
    value: function _layOut() {
      var _this = this;

      var eventViews = arguments.length <= 0 || arguments[0] === undefined ? this.eventViews : arguments[0];
      var dayCount = arguments.length <= 1 || arguments[1] === undefined ? this.dayCount : arguments[1];

      // Create days as an Array of arrays of length dayCount.
      var days = new Array(dayCount);
      for (var i = 0; i < days.length; i++) {
        days[i] = [];
      }

      eventViews.forEach(function (view) {
        var level = _this._getLevelThatEventWillFit(view, days);

        // NOTE: This is a very important part of this algorythym.
        // This creates the eventConfig object of the event that will be visible
        // spanning through more than one day. The Event class only know that
        // the event will be visible because of the isPlaceholder value.
        var visibleEventConfig = Object.create(view.config);
        visibleEventConfig.ordering = Object.create(view.config.ordering);

        // All configs apart from the visibleEventConfig are set to be
        // placeholders.
        visibleEventConfig.ordering.isPlaceholder = false;
        view.config.ordering.isPlaceholder = true;

        var eventStartIdx = view.offset;
        var eventEndIdx = view.offset + view.length - 1;
        days[eventStartIdx][level] = visibleEventConfig;

        // Fill the days where this event will be with its config. all
        // of this will yield placeholder events when the Event class creates them.
        for (var dayNum = eventStartIdx + 1; dayNum <= eventEndIdx; dayNum++) {
          days[dayNum][level] = view.config;
        }
      });
      return days;
    }
  }, {
    key: "_addPadding",
    value: function _addPadding() {
      var _this2 = this;

      var nonPaddedLaidOutEvents = arguments.length <= 0 || arguments[0] === undefined ? this._nonPaddedLaidOutEvents : arguments[0];

      var days = nonPaddedLaidOutEvents.slice(0);
      days.forEach(function (day) {
        // We need to use a for loop instead of a forEach because the forEach
        // will skip unset Array values and those are exactly the ones we are
        // trying to find.
        for (var levelNum = 0; levelNum < day.length; levelNum++) {
          if (day[levelNum] === undefined) {
            day[levelNum] = _this2._getPlaceholderFor(days, levelNum);
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

  }, {
    key: "_getPlaceholderFor",
    value: function _getPlaceholderFor(days, levelNum) {
      for (var i = 0; i < days.length; i++) {
        var slotContent = days[i][levelNum];
        if (slotContent && slotContent.ordering && slotContent.ordering.isPlaceholder) {
          return slotContent;
        }
      }

      return undefined;
    }
  }, {
    key: "_getLevelThatEventWillFit",
    value: function _getLevelThatEventWillFit(eView, days) {
      var level = 0;
      var fitsInLevel = false;

      // Minus one because length starts from 1 and indexes start from 0.
      var eventEndIdx = eView.offset + eView.length - 1;
      var eventStartIdx = eView.offset;

      while (!fitsInLevel) {
        fitsInLevel = true;

        for (var dayNum = eventStartIdx; dayNum <= eventEndIdx; dayNum++) {
          if (days[dayNum][level] !== undefined) {
            fitsInLevel = false;
            level++;
            break;
          }
        }
      }
      return level;
    }
  }, {
    key: "_calcScore",
    value: function _calcScore() {
      var nonPaddedLaidOutEvents = arguments.length <= 0 || arguments[0] === undefined ? this._nonPaddedLaidOutEvents : arguments[0];

      var days = nonPaddedLaidOutEvents;
      var score = 0;
      days.forEach(function (day) {
        // We need to use a for loop instead of a forEach because the forEach
        // will skip unset Array values and those are exactly the ones we are
        // trying to cound.
        for (var level = 0; level < day.length; level++) {
          score += day[level] === undefined ? 0 : 1;
        }
      });

      return score;
    }
  }]);
  return Ordering;
}();

var EventView = function () {
  function EventView(config, calStartDate, dayCount) {
    babelHelpers.classCallCheck(this, EventView);

    this.config = config;
    this.startDate = DateHandler.max(config.start, calStartDate);

    var calEndDate = DateHandler.add(calStartDate, dayCount - 1, 'days').endOf('day');
    this.endDate = DateHandler.min(config.end, calEndDate);

    var decimalDiff = DateHandler.diff(this.endDate, this.startDate, 'days', true);
    // If calendar finished before this event's end date or ends
    // before this event's start date, then there is nothing else to do.
    if (decimalDiff < 0) {
      // Negative length specifies that the view should not be added to calendar
      this.length = -1;
      return;
    }

    // How many days the Event object created with this event config will take
    // given the current calendar start and end date
    this.length = Math.ceil(decimalDiff);

    // NOTE: This is altering the config object iself.
    // This will be used by the Event class afterwards.
    this.config.ordering = this.config.ordering || {};
    this.config.ordering.span = this.length;
    this.config.ordering.isPlaceholder = false;

    // Days from the beginning of the calendar to the day the event starts
    this.offset = DateHandler.diff(this.startDate, calStartDate, 'days');
  }

  babelHelpers.createClass(EventView, [{
    key: 'overlaps',
    value: function overlaps(otherView) {
      return DateHandler.rangesOverlap(this.startDate, this.endDate, otherView.startDate, otherView.endDate);
    }
  }, {
    key: 'diff',
    value: function diff(otherView) {
      var criterion = arguments.length <= 1 || arguments[1] === undefined ? 'minutes' : arguments[1];

      return DateHandler.diff(this.startDate, otherView.startDate, criterion);
    }
  }]);
  return EventView;
}();

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
function organiseEventsConfig(eventsConfig, calStartDate, dayCount) {
  // We don't want to do unnecessary work.
  if (eventsConfig.length === 0 || dayCount === 0) {
    return [];
  }

  // Get all eventViews;
  var UnfilteredEventViews = eventsConfig.map(function (eConfig) {
    return new EventView(eConfig, calStartDate, dayCount);
  });

  var eventViews = UnfilteredEventViews.filter(function (eView) {
    return eView.length > 0;
  });

  // Organise all events chronologically
  eventViews.sort(function (v1, v2) {
    return v2.diff(v1, 'minutes');
  });

  // Get all single-day and more-than-one-day events
  var multiDayViews = [];
  var singleDayViews = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = eventViews[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var view = _step.value;

      var arr = view.length > 1 ? multiDayViews : singleDayViews;
      arr.push(view);
    }

    // // Get all overlapping more-than-one-day events in overlapping groups
    // const chains = getOverlappingChains(multiDayViews);

    // Array of arrays, each representing a day of the calendar. And each
    // day array will have the events for that day.
    // Create an array of length dayCount initialised with empty arrays.
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

  var days = new Array(dayCount);
  for (var i = 0; i < days.length; i++) {
    days[i] = [];
  }

  // Create all possible ordering combinations for eventViews
  // and get the position combination with best score
  var bestOrdering = getBestOrder(multiDayViews, dayCount);

  // Fill days with config objects for events from bestOrdering
  var eventsByDay = bestOrdering.getOrderedEventConfigs();
  // Add events to their respective day.
  eventsByDay.forEach(function (dayEvents, dayNum) {
    days[dayNum] = days[dayNum].concat(dayEvents);
  });

  // Add all other events configs to each day in the days array.
  // As singleDayViews is in chronological order, 'days' will be too.
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = singleDayViews[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _view = _step2.value;

      // The days[index] array minght still not have been initialised
      days[_view.offset].push(_view.config);
    }

    // Return array with all events for each day.
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

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
  var possibleOrders = permute(eventViews);
  var bestOrdering = void 0;
  var bestScore = 99; // just something big will work.
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = possibleOrders[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var order = _step3.value;

      var ordering = new Ordering(order, dayCount);
      var score = ordering.getScore();
      if (score === 0) {
        bestOrdering = ordering;
        break;
      } else if (score < bestScore) {
        bestScore = score;
        bestOrdering = ordering;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return bestOrdering || new Ordering([], dayCount);
}

var CALENDAR_CLASS = '-cal';

/**
 * 	@class Calendar
 * @api private
 */

var Calendar = function (_ModelView) {
  babelHelpers.inherits(Calendar, _ModelView);

  function Calendar(config, startDate, parentClass) {
    var callbacks = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    babelHelpers.classCallCheck(this, Calendar);

    assert(config, 'No calendar configuration object provided.');

    // Create HTML part with SuperClass
    var html = [{ name: 'header', tag: 'header' }, { name: 'days' }];


    // Inside the header we need some stuff.

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Calendar).call(this, html, CALENDAR_CLASS, parentClass, 'section'));

    assert(config.name, 'No calendar name provided for one of the calendars.');
    _this.title = config.name;
    _this.html.title = document.createElement('h2');
    _this.html.title.textContent = _this.title;
    _this.html.title.classList.add(_this.class + '-title');
    _this.html.header.appendChild(_this.html.title);

    if (typeof config.description === 'string') {
      _this.description = config.description;
      _this.html.description = document.createElement('p');
      _this.html.description.classList.add(_this.class + '-description');
      _this.html.description.textContent = _this.description;
      _this.html.header.appendChild(_this.html.description);
    }

    assert(config.id, 'No ID provided for calendar "' + config.name + '"');
    _this.id = config.id;

    assert(startDate, 'No start date provided.');
    _this.startDate = startDate;

    _this.dayConfig = config.dayConfig;

    _this.callbacks = callbacks;

    // The days array is ordered chronologically.
    _this.days = [];

    Object.preventExtensions(_this);

    // Prepare title click callback
    if (typeof _this.callbacks.titleClick === 'function') {
      _this.html.header.addEventListener('click', function () {
        callbacks.titleClick(config);
      });
    }
    return _this;
  }

  babelHelpers.createClass(Calendar, [{
    key: 'getId',
    value: function getId() {
      return this.id;
    }

    // Always adds to the end
    // The Object will decide what is the date of the day to be added.

  }, {
    key: 'addDay',
    value: function addDay() {
      var newDate = DateHandler.addDays(this.startDate, this.days.length);
      var newDay = new Day(newDate, this.class, this.dayConfig, this.callbacks);

      assert(newDay && newDay.html && newDay.html.container, 'New Day instance initialised without an HTML container.');
      this.days.push(newDay);
      this.html.days.appendChild(newDay.html.container);
    }

    // Always removes from the end

  }, {
    key: 'removeDay',
    value: function removeDay() {
      var dayToBeRemoved = this.days.pop();

      // Remove from DOM
      dayToBeRemoved.html.container.remove();

      // Remove last reference to the element
      dayToBeRemoved = null;
    }
  }, {
    key: 'getDayCount',
    value: function getDayCount() {
      var days = arguments.length <= 0 || arguments[0] === undefined ? this.days : arguments[0];

      return days.length;
    }

    /**
     * Updates events being shown to events created drom eventsArray.
     * @method setEvents
     * @param {Array<Object>} eventsArray - Array of events configuration objects
     */

  }, {
    key: 'setEvents',
    value: function setEvents(eventsArray) {
      assert(Array.isArray(eventsArray), 'The parameter provided is not an array.');

      var organisedEvents = organiseEventsConfig(eventsArray, this.startDate, this.days.length);

      for (var day = 0; day < this.days.length; day++) {
        this.days[day].setEvents(organisedEvents[day]);
      }
    }
  }, {
    key: 'clearEvents',
    value: function clearEvents() {
      var days = arguments.length <= 0 || arguments[0] === undefined ? this.days : arguments[0];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = days[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var day = _step.value;

          day.clearEvents();
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
    }

    /**
     * @method findDays
     * @api private
     * @param {String | Date} end
     * @param {String | Date} start
     * @param {Array<Day>} days
     * @returns {Array}
     */

  }, {
    key: 'findDaysInRange',
    value: function findDaysInRange(start, end) {
      var days = arguments.length <= 2 || arguments[2] === undefined ? this.days : arguments[2];

      var foundDays = [];

      if (DateHandler.sameDay(start, end)) {
        // If the range comprises just one day, we can run the find
        // function as it will just return one result
        var dayFound = days.find(function (day) {
          var sameDay = DateHandler.sameDay(start, day.getDate());
          return sameDay;
        });

        if (dayFound) {
          foundDays.push(dayFound);
        }
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = days[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var day = _step2.value;

            if (DateHandler.rangesOverlap(start, end, day.getStart(), day.getEnd())) {
              foundDays.push(day);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return foundDays;
    }
  }, {
    key: 'setStartDate',
    value: function setStartDate(date) {
      var days = arguments.length <= 1 || arguments[1] === undefined ? this.days : arguments[1];

      var counter = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = days[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var day = _step3.value;

          day.setDate(DateHandler.addDays(date, counter));
          counter++;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.startDate = date;
    }
  }]);
  return Calendar;
}(ModelView);

// Private variables
var MULTI_CALENDAR_CLASS = 'fl-mc';
var viewModeClassPrefix = MULTI_CALENDAR_CLASS + '-view-';
var viewModes = {
  weekdays: {
    name: 'weekdays',
    dateRange: 'isoweek',
    dateGapUnit: 'week', // Gap when pressing forward or back
    dayCount: 5
  },
  fullWeek: {
    name: 'fullWeek',
    dateRange: 'week',
    dateGapUnit: 'week', // Gap when pressing forward or back
    dayCount: 7
  },
  oneDay: {
    name: 'oneDay',
    dateRange: 'day',
    dateGapUnit: 'day', // Gap when pressing forward or back
    dayCount: 1
  }
};

var multiCalendarEvents = {
  loadingStart: 'fl-mc-loading-start',
  loadingComplete: 'fl-mc-loading-complete'
};

/**
 * @class MultiCalendar
 * @extends ModelView
 * @api private
 */

var MultiCalendar = function (_ModelView) {
  babelHelpers.inherits(MultiCalendar, _ModelView);

  /**
   * @constructor
   * @api private
   * @param  {Object} config - MultiCalendar configuration object
   */

  function MultiCalendar(config) {
    babelHelpers.classCallCheck(this, MultiCalendar);

    // ----------------------------------------------------------------
    // --------------------- Property creation  -----------------------
    // ----------------------------------------------------------------
    assert(config, 'No Configuration object provided.');

    // Create HTML part with SuperClass

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(MultiCalendar).call(this, null, MULTI_CALENDAR_CLASS, '', 'main'));

    assert(babelHelpers.typeof(config.targetElement) === 'object', 'No valid targetElement provided.');
    _this.targetElement = config.targetElement;

    // Create control bar
    _this.controlBar = new ControlBar(_this.class, config.titleBarFormat);
    _this.html.container.appendChild(_this.controlBar.html.container);

    assert(typeof config.loadUrl === 'string', 'No loadUrl provided.');
    _this.loadUrl = _this._prepareLoadUrl(config.loadUrl);

    _this.dayConfig = { dayHeaderFormat: config.dayHeaderFormat };

    // Dates will be initialised in this.setStartDate
    _this.startDate = null;
    _this.endDate = null;
    _this.calendars = [];
    _this.lastLoadedEvents = {};
    _this.currViewMode = null;

    // Tell last requests whether they were cancelled.
    _this.lastRequest = { cancelled: false };

    // Nothing else will be added to the object from here on.
    Object.preventExtensions(_this);

    // ----------------------------------------------------------------
    // --------------- ControlBar & Calendars setup -- ----------------
    // ----------------------------------------------------------------

    _this._initControlBar(_this.controlBar);

    _this.setStartDate(DateHandler.newDate());

    // Add Calendars
    assert(Array.isArray(config.calendars), 'No valid calendars array provided.');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = config.calendars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cal = _step.value;

        _this._addCalendar(cal, _this.startDate);
      }

      // Add everything to the DOM
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

    _this.targetElement.appendChild(_this.html.container);
    return _this;
  }

  /**
   * Sets up listeners to control bar events
   * @private
   * @method _initControlBar
   * @param  {ControlBar}  controlBar [optional]
   * @return {void}
   */


  babelHelpers.createClass(MultiCalendar, [{
    key: '_initControlBar',
    value: function _initControlBar() {
      var _this2 = this;

      var controlBar = arguments.length <= 0 || arguments[0] === undefined ? this.controlBar : arguments[0];

      this._makeControlBarSticky(controlBar);

      controlBar.listenTo('datePicker', function () {
        var datePickerDate = _this2.controlBar.getDate();
        _this2.goToDate(datePickerDate);
      });

      controlBar.listenTo('forward', function () {
        _this2.goForward();
      });
      controlBar.listenTo('back', function () {
        _this2.goBack();
      });
      controlBar.listenTo('today', function () {
        _this2.goToDate(DateHandler.newDate());
      });
      controlBar.listenTo('refresh', function () {
        _this2.refresh();
      });

      controlBar.listenTo('show-weekend', function () {
        var show = _this2.currViewMode === viewModes.weekdays;
        _this2.showWeekends(show);
      });
    }
    // ====================================================
    //          Public Interface
    // ====================================================
    /**
     * Moves the multi-calendar date forward by a day or by a week
     * depending on how many days are being shown.
     * @method goForward
     * @api public
     * @return {void}
     */

  }, {
    key: 'goForward',
    value: function goForward() {
      var startDate = this.startDate;
      var gapUnit = this.currViewMode.dateGapUnit;
      var newDate = DateHandler.add(startDate, 1, gapUnit);
      this.setStartDate(newDate);
    }

    /**
     * Moves the multi-calendar date back by a day or by a week
     * depending on how many days are being shown.
     * @method goBack
     * @api public
     * @return {void}
     */

  }, {
    key: 'goBack',
    value: function goBack() {
      var startDate = this.startDate;
      var gapUnit = this.currViewMode.dateGapUnit;
      var newDate = DateHandler.add(startDate, -1, gapUnit);
      this.setStartDate(newDate);
    }

    /**
     * Fetches data from the server for the current showing days and updates
     * the events.
     * @api public
     * @method refresh
     * @return {void}
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this._loadEvents();
    }

    /**
     * Shows or hides Saturday and Sunday from the current calendar view.
     * If calendar is in mobile mode (oneDay view) it does nothing.
     * @api public
     * @method showWeekends
     * @param  {Boolean} show - Whether to show the weekends or not.
     * @return {void}
     */

  }, {
    key: 'showWeekends',
    value: function showWeekends(show) {
      if (this.currViewMode === viewModes.oneDay) {
        return;
      }
      var newView = show ? 'fullWeek' : 'weekdays';
      this._setViewMode(newView);
    }

    /**
     * Moves all calendars to a view that shows the specified date.
     * @api public
     * @method goToDate
     * @param  {String | Date} date       [description]
     * @param  {ControlBar} controlBar [opitonal]
     * @return {void}
     */

  }, {
    key: 'goToDate',
    value: function goToDate(date) {
      var controlBar = arguments.length <= 1 || arguments[1] === undefined ? this.controlBar : arguments[1];

      if (DateHandler.isValid(date)) {
        this.setStartDate(date);
      } else {
        controlBar.setDate(this.date);
      }
    }

    // ====================================================
    // ------------- End of Public interface --------------
    // ====================================================
    /**
     * @private
     * @method _addCalendar
     * @param  {Object}       config    Configuration object for the calendar
     * @param  {DateHandler}  startDate [optional]
     */

  }, {
    key: '_addCalendar',
    value: function _addCalendar(config) {
      var startDate = arguments.length <= 1 || arguments[1] === undefined ? this.startDate : arguments[1];

      // TODO: Add calendar when other calendars already have days
      var calendarCallbacks = {
        titleClick: config.titleClick,
        dayHeaderClick: config.dayHeaderClick,
        eventClick: config.eventClick
      };

      config.dayConfig = this.dayConfig;

      var calendar = new Calendar(config, startDate, MULTI_CALENDAR_CLASS, calendarCallbacks);
      this.html.container.appendChild(calendar.html.container);
      this.calendars.push(calendar);
    }

    /**
     * Amount of days being shown in each calendar.
     * @method getDayCount
     * @param  {Array<Calendar>} calendars
     * @return {Int} - Amount of days being shown in each calendar.
     *               - If there are no calendars it returns 0.
     */

  }, {
    key: 'getDayCount',
    value: function getDayCount() {
      var calendars = arguments.length <= 0 || arguments[0] === undefined ? this.calendars : arguments[0];

      if (calendars.length === 0) {
        return 0;
      }
      return calendars[0].getDayCount();
    }

    /**
     * Fetches events from the server and puts them into calendars
     * @private
     * @method _loadEvents
     * @param  {String}    loadUrl            [optional]
     * @param  {Array<Calendar>}   calendars  [optional]
     * @param  {ControlBar}   controlBar      [optional]
     * @return {Promise}              Promise that will be resolved when events
     *                                 have been loaded and added to the calendars
     */

  }, {
    key: '_loadEvents',
    value: function _loadEvents() {
      var loadUrl = arguments.length <= 0 || arguments[0] === undefined ? this.loadUrl : arguments[0];

      var _this3 = this;

      var calendars = arguments.length <= 1 || arguments[1] === undefined ? this.calendars : arguments[1];
      var controlBar = arguments.length <= 2 || arguments[2] === undefined ? this.controlBar : arguments[2];

      triggerEvent(multiCalendarEvents.loadingStart, this.html.container);

      controlBar.setLoadingState('loading');

      // Crete array of calendar IDS
      var calIds = [];
      this.calendars.forEach(function (cal) {
        calIds.push(cal.getId());
      });

      var params = {
        ids: calIds,
        start: DateHandler.format(this.startDate, 'X'),
        end: DateHandler.format(this.endDate, 'X')
      };

      var fullUrl = this._addParametersToUrl(params, loadUrl);

      var requestConfig = {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'include'
      };

      // Cancel last request. The function that made the request
      // will preserve this object in a closure so we can safely
      // assign a new object to this.lastRequest.
      this.lastRequest.cancelled = true;
      var thisRequest = { cancelled: false };
      this.lastRequest = thisRequest;

      // TODO: develop a timeout mechanism
      return fetch(fullUrl, requestConfig).then(function (data) {
        return data.json();
      })
      // The loaded object is indexed by calendar id and each element contains
      // an array of event objects.
      .then(function (loadedCalEvents) {
        if (thisRequest.cancelled) {
          return;
        }
        _this3._setEvents(loadedCalEvents, calendars);
        controlBar.setLoadingState('success');
      }).catch(function (e) {
        if (thisRequest.cancelled) {
          return;
        }
        controlBar.setLoadingState('error');
        console.error(e);
      })
      // After error or success
      .then(function () {
        triggerEvent(multiCalendarEvents.loadingComplete, _this3.html.container);
      });
    }

    /**
     * Sets the events for all calendars
     * @private
     * @method _setEvents
     * @param  {Array<Object>}  calEvents    [optional]
     * @param  {Array<Calendar>}  calendars  [optional]
     */

  }, {
    key: '_setEvents',
    value: function _setEvents() {
      var calEvents = arguments.length <= 0 || arguments[0] === undefined ? this.lastLoadedEvents : arguments[0];
      var calendars = arguments.length <= 1 || arguments[1] === undefined ? this.calendars : arguments[1];

      if ((typeof calEvents === 'undefined' ? 'undefined' : babelHelpers.typeof(calEvents)) !== 'object') {
        assert.warn(false, 'Trying to set events with invalid object');
        return;
      }

      var loadedIds = Object.keys(calEvents);

      // Send each array of event objects to the corresponding calendar
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = loadedIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var loadedId = _step2.value;

          var cal = this._findCalendar(loadedId, calendars);
          if (cal) {
            cal.setEvents(calEvents[loadedId]);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.lastLoadedEvents = calEvents;
    }

    /**
     * @private
     * @method _findCalendar
     * @param  {String}           calId
     * @param  {Calendar}      calendars [optional]
     * @return {Calendar}
     */

  }, {
    key: '_findCalendar',
    value: function _findCalendar(calId) {
      var calendars = arguments.length <= 1 || arguments[1] === undefined ? this.calendars : arguments[1];

      return calendars.find(function (cal) {
        return cal.id === calId;
      });
    }

    /**
     * Sets the start date of all calendars and of the control bar.
     * @method setStartDate
     * @param  {DateHandler | String}   date
     * @param  {Array<Calendar>}        calendars  [optional]
     */

  }, {
    key: 'setStartDate',
    value: function setStartDate(date) {
      var calendars = arguments.length <= 1 || arguments[1] === undefined ? this.calendars : arguments[1];

      // This function may be called before a view mode is set. In this clase
      // the only acceptable start date is Today.
      var newDate = void 0;
      if (!this.currViewMode) {
        newDate = DateHandler.newDate();
      } else {
        var dateRange = this.currViewMode.dateRange;
        newDate = DateHandler.startOf(date, dateRange);
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = calendars[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var cal = _step3.value;

          cal.setStartDate(newDate);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.startDate = newDate;
      var daysInCalendar = this.getDayCount();

      // Make sure endDate will never be negative.
      // even if there are 0 days in each calendar
      var daysToEnd = Math.max(daysInCalendar - 1, 0);
      this.endDate = DateHandler.addDays(newDate, daysToEnd);

      this.controlBar.setDate(newDate);
      this._loadEvents();
    }

    /**
     * @private
     * @method _setViewMode
     * @param {String} newMode
     * @param {Array<Calendar>} calendars [optional]
     * @return {void}
     */

  }, {
    key: '_setViewMode',
    value: function _setViewMode(modeName) {
      var calendars = arguments.length <= 1 || arguments[1] === undefined ? this.calendars : arguments[1];

      var newMode = viewModes[modeName];
      if (newMode === undefined) {
        var fallbackMode = 'weekdays';
        assert.warn(false, 'Invalid view mode: ' + newMode + '. Defaulting to ' + fallbackMode);
        newMode = viewModes[fallbackMode];
      }

      if (newMode === this.currViewMode) {
        return;
      }

      // It might be the first time that the mode is being set
      // and the number of days in each calendar could be different
      // from all of the viewModes, that's why we are using this.getDayCount
      // instead of this.currViewMode.dayCount.
      var currDayCount = this.getDayCount();

      var dayCountDiff = Math.abs(newMode.dayCount - currDayCount);
      var method = newMode.dayCount < currDayCount ? 'removeDay' : 'addDay';

      // Add or remove the needed amount of days from the calendar.
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = calendars[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var cal = _step4.value;

          for (var i = 0; i < dayCountDiff; i++) {
            cal[method]();
          }
        }

        // Remove any other view's class and add the one for this view.
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.keys(viewModes)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var view = _step5.value;

          var _viewClass = this._viewModeClassName(viewModes[view]);
          this.html.container.classList.remove(_viewClass);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var viewClass = this._viewModeClassName(newMode);
      this.html.container.classList.add(viewClass);

      // This will set the datepicker type and all buttons correctly
      this.controlBar.setDateRange(newMode.dateRange);

      this.currViewMode = newMode;

      // Make sure the beginning startDate will be in accordance
      // with the new viewMode.
      this.setStartDate(this.startDate);
    }
  }, {
    key: 'getViewMode',
    value: function getViewMode() {
      return this.currViewMode ? this.currViewMode.name : null;
    }

    /**
    * Returns a className for a viewMode.
    * @private
    * @method _viewModeClassName
    * @param  {String} view
    * @return {String}      The class name to be added to the main container.
    */

  }, {
    key: '_viewModeClassName',
    value: function _viewModeClassName(view) {
      return viewModeClassPrefix + view.name;
    }

    /**
     * @private
     * @method _makeControlBarSticky
     * @param  {ControlBar} controlBar [optional]
     * @return {void}
     */

  }, {
    key: '_makeControlBarSticky',
    value: function _makeControlBarSticky() {
      var controlBar = arguments.length <= 0 || arguments[0] === undefined ? this.controlBar : arguments[0];

      var container = this.html.container;
      var bar = controlBar.html.container;

      // Make sure we don't set the listeners twice.
      if (bar.isSticky) {
        return;
      }
      bar.isSticky = true;

      var initialPadTop = '';
      var initialBarWidth = '';

      function stickyCheck() {
        var cBox = container.getBoundingClientRect();
        var barHeight = bar.clientHeight;

        if (cBox.top + barHeight <= 0 && !bar.classList.contains('sticky')) {
          bar.classList.add('sticky');

          var containerWidth = container.clientWidth;
          initialBarWidth = bar.style.width;
          bar.style.width = containerWidth + 'px';

          initialPadTop = parseInt(container.style.paddingTop, 10) || 0;
          container.style.paddingTop = barHeight + initialPadTop + 'px';
        } else if (cBox.top + barHeight > 0 && bar.classList.contains('sticky')) {
          bar.classList.remove('sticky');

          bar.style.width = initialBarWidth;

          container.style.paddingTop = initialPadTop;
        }
      }

      var stickyCheckDebounded = debounce(stickyCheck, 50);
      window.addEventListener('scroll', stickyCheckDebounded);
    }

    /**
     * Adds parameters as GET string parameters to a prepared URL
     * @private
     * @method _addParametersToUrl
     * @param  {Object}            params
     * @param  {String}            loadUrl [optional]
     * @return {String}           The full URL with parameters
     */

  }, {
    key: '_addParametersToUrl',
    value: function _addParametersToUrl(params) {
      var loadUrl = arguments.length <= 1 || arguments[1] === undefined ? this.loadUrl : arguments[1];

      var getParams = [];
      var keys = Object.keys(params);
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = keys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var param = _step6.value;

          var value = params[param].toString();
          var encodedParam = encodeURIComponent(param);
          var encodedValue = encodeURIComponent(value);
          getParams.push(encodedParam + '=' + encodedValue);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var encodedGetParams = getParams.join('&');
      var fullUrl = loadUrl + encodedGetParams;
      return fullUrl;
    }

    /**
     * Adds a proper domain an prepares the URL for query parameters.
     * @private
     * @method _prepareLoadUrl
     * @param  {String}        url
     * @return {String}            The usable loadUrl
     */

  }, {
    key: '_prepareLoadUrl',
    value: function _prepareLoadUrl(rawUrl) {
      var url = void 0;
      try {
        url = new URL(rawUrl);
      } catch (e) {
        try {
          url = new URL(location.origin + rawUrl);
          assert.warn(false, 'No domain provided. Assuming domain: ' + location.origin);
        } catch (e2) {
          assert(false, 'Invalid URL: ${loadUrl}');
        }
      }

      var fullUrl = void 0;
      if (url.search.length > 0) {
        url.search = url.search + '&';
        fullUrl = url.href;
      } else {
        fullUrl = url.href + '?';
      }
      return fullUrl;
    }
  }]);
  return MultiCalendar;
}(ModelView);

xController(function (xDivEl) {
  //eslint-disable-line
  // Grab config object
  var config = window[xDivEl.dataset.config];
  if ((typeof config === 'undefined' ? 'undefined' : babelHelpers.typeof(config)) !== 'object') {
    throw new Error('x-div multiCalendar: No configuration object provided.');
  }

  // Create multiCalendar
  config.targetElement = xDivEl;
  var multiCalendar = new MultiCalendar(config);

  // Setup responsiveness
  // TODO: move that to MultiCalendar
  function viewModeUpdate() {
    var currViewMode = multiCalendar.getViewMode();
    if (window.innerWidth < 850 && currViewMode !== 'oneDay') {
      multiCalendar._setViewMode('oneDay');
    } else if (window.innerWidth > 850 && currViewMode === 'oneDay' || !currViewMode) {
      multiCalendar._setViewMode('weekdays');
    }
  }

  var viewModeUpdateDebounced = debounce(viewModeUpdate, 200);
  viewModeUpdateDebounced();
  window.addEventListener('resize', viewModeUpdateDebounced);

  /**
   * You can call public functions of MultiCalendar on it.
   * Access it through window[multiCalendar]
   * @module MultiCalendar
   * @api public
   * @global
   */
  window.multiCalendar = multiCalendar;
});
//# sourceMappingURL=fl-multi-calendar.js.map
