const axios = require('axios').default;
const parser = require('./lib/parser.js');

axios.get('http://thejoeshow.net').then(response => {
  let result = parser(response.data);
  console.log(result);
});

