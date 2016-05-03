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

/* eslint-env jasmine */

describe('A ControlBar class\'s instance should', function () {
  // ===================
  // Presentation
  // ===================
  xit('have a and backward forward button');
  xit('have a today button');
  xit('have a weekpicker');
  xit('have an update button');
  xit('have a title with the calendar date');
  xit('have a "show weekends" button');

  // ===================
  // Functionality
  // ===================
  xit('emmit change correct event when forward button is pressed');
  xit('emmit change correct event when backward button is pressed');
  xit('emmit change correct event when today button is pressed');
  xit('emmit change correct event when "show weekends" button is pressed');
  xit('emmit change correct event when refresh button is pressed');
  xit('emmit change correct event when the weekpicker is changed');
  xit('change title when an appropriate event is fired.');
  xit('handle invalid dates');
});
//# sourceMappingURL=ControlBar-specs.js.map
