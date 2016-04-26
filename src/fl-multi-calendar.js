/* globals xController */

import MultiCalendar from './MultiCalendar';

xController((xDivEl) => {
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
  function setViewModeBasedOnWindowSize() {
    const currViewMode = multiCalendar.getViewMode();
    if (window.innerWidth < 850 && currViewMode !== 'oneDay') {
      multiCalendar.setViewMode('oneDay');
    } else if (window.innerWidth > 850 && currViewMode === 'oneDay' || !currViewMode) {
      multiCalendar.setViewMode('weekdays');
    }
  }

  setViewModeBasedOnWindowSize();
  window.addEventListener('resize', setViewModeBasedOnWindowSize);
});
