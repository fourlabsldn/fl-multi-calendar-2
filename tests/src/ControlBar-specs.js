/* eslint-env jasmine */
import ControlBar from '../../src/ControlBar';

describe('A ControlBar class\'s instance should', () => {
  // ===================
  // Presentation
  // ===================
  let controlBar;
  let controlBarEl;
  let spy;
  beforeAll(() => {
    const parentClass = 'super-class';
    const titleBarFormat = 'YYYY';
    controlBar = new ControlBar(parentClass, titleBarFormat);
    controlBarEl = controlBar.html.container;
  });

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
  });

  it('have a and backward forward button', () => {
    expect(controlBar).toBeDefined();
    expect(controlBar.html).toBeDefined();
    expect(controlBar.html.container).toBeDefined();
    const backBtn = controlBarEl.querySelector('[class*=-back]');
    expect(backBtn).toBeDefined();

    const forwardBtn = controlBarEl.querySelector('[class*=-forward]');
    expect(forwardBtn).toBeDefined();
  });

  it('have a today button', () => {
    const todayBtn = controlBarEl.querySelector('[class*=-today]');
    expect(todayBtn).toBeDefined();
  });

  it('have a weekpicker', () => {
    const datePicker = controlBarEl.querySelector('input[class*=-datePicker]');
    expect(datePicker).toBeDefined();
  });

  it('have an update refresh', () => {
    const refreshBtn = controlBarEl.querySelector('[class*=-refresh]');
    expect(refreshBtn).toBeDefined();
  });

  it('have a title to put the calendar date', () => {
    const titleBar = controlBarEl.querySelector('[class*=-titleBar]');
    expect(titleBar).toBeDefined();
  });

  it('have a "show weekends" button', () => {
    const showWeekendBtn = controlBarEl.querySelector('[class*=-show-weekend]');
    expect(showWeekendBtn).toBeDefined();
  });

  // ===================
  // Functionality
  // ===================
  it('emmit change correct event when forward button is pressed', () => {
    controlBar.listenTo('forward', spy);
    controlBar.html.forward.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when backward button is pressed', () => {
    controlBar.listenTo('back', spy);
    controlBar.html.back.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when today button is pressed', () => {
    controlBar.listenTo('today', spy);
    controlBar.html.today.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when "show weekends" button is pressed', () => {
    controlBar.listenTo('show-weekend', spy);
    controlBar.html['show-weekend'].click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when refresh button is pressed', () => {
    controlBar.listenTo('refresh', spy);
    controlBar.html.refresh.click();
    expect(spy).toHaveBeenCalled();
  });
  it('emmit change correct event when the weekpicker is changed', () => {
    controlBar.listenTo('datePicker', spy);
    controlBar.html.datePicker.dispatchEvent(new CustomEvent('change'));
    expect(spy).toHaveBeenCalled();
  });

  it('change title when an appropriate event is fired.', () => {
    const titleBefore = controlBar.html.titleBar.innerHTML;
    controlBar.setDate(new Date());
    const titleAfter = controlBar.html.titleBar.innerHTML;
    expect(titleBefore).not.toEqual(titleAfter);
  });

  it('handle invalid dates', () => {
    expect(() => { controlBar.setDate(undefined); }).not.toThrow();
    expect(() => { controlBar.setDate(null); }).not.toThrow();
    expect(() => { controlBar.setDate(32); }).not.toThrow();
  });
});
