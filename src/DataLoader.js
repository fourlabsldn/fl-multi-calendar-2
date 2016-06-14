import assert from './utils/assert.js';
import DateHandler from './utils/DateHandler';

export default class DataLoader {
  constructor(loadUrl) {
    assert(typeof loadUrl === 'string', `Invalid load URL: ${loadUrl}`);
    this.loadUrl = this.prepareLoadUrl(loadUrl);
    this.filter = {
      test: 123,
    };

    // Tell last requests whether they were cancelled.
    this.lastRequest = { cancelled: false };
    Object.preventExtensions(this);
  }

  /**
   * Sets a filter object whose attributes will be appended to all server requests
   * @method setFilter
   * @param  {Object} newFilter
   */
  setFilter(newFilter) {
    assert(typeof newFilter === 'object', 'Invalid filter. Not an object');
    this.filter = newFilter;
  }

  /**
   * Fetches events from the server and puts them into calendars
   * @private
   * @method _loadEvents
   * @param  {String} loadUrl
   * @param  {Array<Int | String>} calendarIds
   * @param  {ControlBar} controlBar
   * @return {Promise} Resolved with events loaded or with null if request was cancelled
   */
  loadEvents(startDate, endDate, calendarIds) {
    const params = {
      ids: calendarIds,
      start: DateHandler.format(this.startDate, 'X'),
      end: DateHandler.format(this.endDate, 'X'),
    };

    // integrate filters to request
    for (const prop of Object.keys(this.filter)) {
      params[prop] = this.filter[prop];
    }

    const fullUrl = this.addParametersToUrl(params, this.loadUrl);
    const requestConfig = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
    };

    // Cancel last request. The function that made the request
    // will preserve this object in a closure so we can safely
    // assign a new object to this.lastRequest.
    this.lastRequest.cancelled = true;
    const thisRequest = { cancelled: false };
    this.lastRequest = thisRequest;

    // TODO: develop a timeout mechanism
    return fetch(fullUrl, requestConfig)
    .then((data) => { return data.json(); })
    // The loaded object is indexed by calendar id and each element contains
    // an array of event objects.
    .then((loadedCalEvents) => {
      if (thisRequest.cancelled) { return null; }
      return loadedCalEvents;
    })
    .catch((e) => {
      if (thisRequest.cancelled) { return null; }
      throw e;
    });
  }

  /**
   * Adds parameters as GET string parameters to a prepared URL
   * @private
   * @method _addParametersToUrl
   * @param  {Object} params
   * @param  {String} loadUrl [optional]
   * @return {String} The full URL with parameters
   */
  addParametersToUrl(params, loadUrl = this.loadUrl) {
    const getParams = [];
    const keys = Object.keys(params);
    for (const param of keys) {
      const value = params[param].toString();
      const encodedParam = encodeURIComponent(param);
      const encodedValue = encodeURIComponent(value);
      getParams.push(`${encodedParam}=${encodedValue}`);
    }

    const encodedGetParams = getParams.join('&');
    const fullUrl = loadUrl + encodedGetParams;
    return fullUrl;
  }

  /**
   * Adds a proper domain an prepares the URL for query parameters.
   * @private
   * @method _prepareLoadUrl
   * @param  {String}  url
   * @return {String} The usable loadUrl
   */
  prepareLoadUrl(rawUrl) {
    let url;
    try {
      url = new URL(rawUrl);
    } catch (e) {
      try {
        url = new URL(location.origin + rawUrl);
        assert.warn(false, `No domain provided. Assuming domain: ${location.origin}`);
      } catch (e2) {
        assert(false, 'Invalid URL: ${loadUrl}');
      }
    }

    let fullUrl;
    if (url.search.length > 0) {
      url.search = `${url.search}&`;
      fullUrl = url.href;
    } else {
      fullUrl = `${url.href}?`;
    }
    return fullUrl;
  }
}
