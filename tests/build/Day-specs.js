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

describe('A Day class\'s instance should', function () {
  // ===================
  // Presentation
  // ===================
  describe('create day element with', function () {
    xit('date title');
    xit('events space');
  });

  xit('highlight the html element if it refers to the current day.');
  xit('show the specified date');
  xit('show the date in the correct format');

  // ===================
  // Functionality
  // ===================
  xit('change day when commanded to.');
  xit('trigger title click event when the title is clicked.');

  xit('create events correctly');
  xit('update events correctly');

  xit('update all events on date change');
  xit('update all events without date change when requested');

  xit('clear all events when requested');

  xit('not change HTML if setEvents is called with the same events as last call.');
  xit('add new Event without deleting other ones that should stay.');
  xit('remove events that are not present in the new array of events configuration.');
});
//# sourceMappingURL=Day-specs.js.map
