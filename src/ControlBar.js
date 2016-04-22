import assert from './utils/assert.js';
import ModelView from './ModelView';

class ControlBar extends ModelView {
  constructor(parentClass) {
    const html = [
      { name: 'weekpicker', tag: 'input' },
      { name: 'back', tag: 'button', content: '<' },
      { name: 'forward', tag: 'button', content: '>' },
      { name: 'today', tag: 'button', content: 'today' },
      { name: 'refresh', tag: 'button'},
      { name: 'date-range', tag: 'p'},
      { name: 'show-weekend', tag: 'button', content: 'Show Weekend' },
    ];
    super(html, instanceClass, parentClass = '', 'nav');
  }
}
