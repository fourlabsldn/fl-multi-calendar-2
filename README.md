# fl-multi-calendar

## Configuration object

Example valid configuration object:

``` javascript
{
  loadUrl: 'http://localhost:5000',
  calendars: [{
    name: 'Karl Marx',
    id: '12345',
    description: 'Software Developer', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, {
    name: 'Friedrich Hegel',
    id: '7899',
    description: 'HR Manager', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, {
    name: 'Immanuel Kant',
    id: '23456',
    description: 'Research and Revelopement', //optional
    titleClick: titleClick, //optional
    dayHeaderClick: dayHeaderClick,
    eventClick: eventClick,
  }, ],
}
```
