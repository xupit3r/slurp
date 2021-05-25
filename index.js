const axios = require('axios').default;
const Parser = require('./lib/parser.js');

const BASE = 'http://thejoeshow.net';

axios.get(BASE).then(response => {
  let html = response.data;
  let parser = new Parser(BASE, html);

  parser.parse();
  
  console.log(parser.links);
});

