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
/* globals moment */

describe('An instance of the Event class should', function () {

  var event = void 0;
  var eventClickSpy = void 0;
  var eventStartDate = moment();
  var eventEndDate = moment().add(1, 'days');
  var eventTitle = 'My awesome event title';
  var eventDescription = 'Super interesting description';
  var eventTooltip = 'A tooltip';

  beforeEach(function () {
    eventClickSpy = jasmine.createSpy('spy');

    var callbacks = {
      eventClick: eventClickSpy
    };
    var parentClass = 'super-class';
    var parentDate = new Date();
    var eventConfig = {
      startDate: eventStartDate,
      endDate: eventEndDate,
      title: eventTitle,
      description: eventDescription,
      tooltip: eventTooltip,
      ordering: {
        span: 2,
        isPlaceholder: false
      }
    };

    event = new Event(eventConfig, parentClass, parentDate, callbacks);
  });
  // ===================
  // Presentation
  // ===================
  xit('create a title element', function () {
    expect(event.html.title).toBeDefined();
    expect(event.html.title.innerHTML).toEqual(eventTitle);
  });
  xit('create a description element', function () {
    expect(event.html.description).toBeDefined();
    expect(event.html.description.innerHTML).toEqual(eventDescription);
  });
  xit('create a tooltip element to be shown on hover', function () {
    expect(event.html.tooltip).toBeDefined();
    expect(event.html.tooltip.innerHTML).toEqual(eventTooltip);
  });
  xit('create a time element', function () {});

  // ===================
  // Functionality
  // ===================
  xit('trigger the eventClick when clicked upon', function () {});
  xit('should fire the click event when clicked.', function () {});
});
//# sourceMappingURL=Event-specs.js.map
