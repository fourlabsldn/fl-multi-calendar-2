import MultiCalendar from './MultiCalendar';
import debounce from './utils/debounce';

xController((xDivEl) => { //eslint-disable-line
  // Grab config object
  const config = window[xDivEl.dataset.config];
  if (typeof config !== 'object') {
    throw new Error('x-div multiCalendar: No configuration object provided.');
  }

  // Create multiCalendar
  config.targetElement = xDivEl;
  const multiCalendar = new MultiCalendar(config);

  // Setup responsiveness
  // TODO: move that to MultiCalendar
  function viewModeUpdate() {
    const currViewMode = multiCalendar.getViewMode();
    if (window.innerWidth < 850 && currViewMode !== 'oneDay') {
      multiCalendar._setViewMode('oneDay');
    } else if (window.innerWidth > 850 && currViewMode === 'oneDay' || !currViewMode) {
      multiCalendar._setViewMode('weekdays');
    }
  }

  const viewModeUpdateDebounced = debounce(viewModeUpdate, 200);
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
