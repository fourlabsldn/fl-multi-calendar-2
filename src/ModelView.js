// html = [
//  {name: 'details', tag: 'p', content: 'asdf'}
// ]
import assert from './utils/assert';

export default class ModelView {
  constructor(html, instanceClass, parentClass = '', containerTag = 'div') {
    assert(instanceClass, 'No instance class provided.');
    this.class = parentClass + instanceClass;

    // Create HTML
    this.html = {};

    this.html.container = document.createElement(containerTag);
    this.html.container.classList.add(this.class);

    if (!html) { return; }
    assert(Array.isArray(html),
      'Parameter is not an Array.');

    for (const prop of html) {
      assert(prop.name, 'No property name provided.');
      const propName = prop.name;
      const propTag = prop.tag || 'div';

      this.html[propName] = document.createElement(propTag);
      this.html[propName].classList.add(`${this.class}-${propName}`);
      if (prop.content) {
        this.html[propName].textContent = prop.content;
      }

      this.html.container.appendChild(this.html[propName]);
    }
  }
}
