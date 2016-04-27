/**
 * [triggerEvent description]
 * @method triggerEvent
 * @param  {String} eventName
 * @param  {HTMLElement} [target]
 * @param  {Object} [data] - Data to be sent in the event
 * @return {void}
 */
export default function triggerEvent(eventName, target = document.body, data = {}) {
  const ev = new CustomEvent(eventName, {
    detail: data,
    bubbles: true,
    cancelable: true,
  });

  target.dispatchEvent(ev);
}
