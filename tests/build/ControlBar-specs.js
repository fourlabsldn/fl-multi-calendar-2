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

describe('A ControlBar class\'s instance should', function () {
  // ===================
  // Presentation
  // ===================
  var controlBar = void 0;
  var controlBarEl = void 0;
  var spy = void 0;
  beforeAll(function () {
    var parentClass = 'super-class';
    var titleBarFormat = 'YYYY';
    controlBar = new ControlBar(parentClass, titleBarFormat);
    controlBarEl = controlBar.html.container;
  });

  beforeEach(function () {
    spy = jasmine.createSpy('spy');
  });

  it('have a and backward forward button', function () {
    expect(controlBar).toBeDefined();
    expect(controlBar.html).toBeDefined();
    expect(controlBar.html.container).toBeDefined();
    var backBtn = controlBarEl.querySelector('[class*=-back]');
    expect(backBtn).toBeDefined();

    var forwardBtn = controlBarEl.querySelector('[class*=-forward]');
    expect(forwardBtn).toBeDefined();
  });

  it('have a today button', function () {
    var todayBtn = controlBarEl.querySelector('[class*=-today]');
    expect(todayBtn).toBeDefined();
  });

  it('have a weekpicker', function () {
    var datePicker = controlBarEl.querySelector('input[class*=-datePicker]');
    expect(datePicker).toBeDefined();
  });

  it('have an update refresh', function () {
    var refreshBtn = controlBarEl.querySelector('[class*=-refresh]');
    expect(refreshBtn).toBeDefined();
  });

  it('have a title to put the calendar date', function () {
    var titleBar = controlBarEl.querySelector('[class*=-titleBar]');
    expect(titleBar).toBeDefined();
  });

  it('have a "show weekends" button', function () {
    var showWeekendBtn = controlBarEl.querySelector('[class*=-show-weekend]');
    expect(showWeekendBtn).toBeDefined();
  });

  // ===================
  // Functionality
  // ===================
  it('emmit change correct event when forward button is pressed', function () {
    controlBar.listenTo('forward', spy);
    controlBar.html.forward.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when backward button is pressed', function () {
    controlBar.listenTo('back', spy);
    controlBar.html.back.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when today button is pressed', function () {
    controlBar.listenTo('today', spy);
    controlBar.html.today.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when "show weekends" button is pressed', function () {
    controlBar.listenTo('show-weekend', spy);
    controlBar.html['show-weekend'].click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when refresh button is pressed', function () {
    controlBar.listenTo('refresh', spy);
    controlBar.html.refresh.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when the weekpicker is changed', function () {
    controlBar.listenTo('datePicker', spy);
    controlBar.html.datePicker.dispatchEvent(new CustomEvent('change'));
    expect(spy).toHaveBeenCalled();
  });

  it('change title when an appropriate event is fired.', function () {
    var titleBefore = controlBar.html.titleBar.innerHTML;
    controlBar.setDate(new Date());
    var titleAfter = controlBar.html.titleBar.innerHTML;
    expect(titleBefore).not.toEqual(titleAfter);
  });

  it('handle invalid dates', function () {
    expect(function () {
      controlBar.setDate(undefined);
    }).not.toThrow();
    expect(function () {
      controlBar.setDate(null);
    }).not.toThrow();
    expect(function () {
      controlBar.setDate(32);
    }).not.toThrow();
  });
});
//# sourceMappingURL=ControlBar-specs.js.map
