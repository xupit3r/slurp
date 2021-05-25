const { v4: uuid } = require('uuid');
const htmlparser2 = require('htmlparser2');

/**
 * Takes an HTML string and returns a JSON document containing the information.
 * 
 * @param {String} html an HTML string to parse
 * @returns a JSON object representing the parsed HTML string
 */
module.exports = function hsonParser (html) {
  const place = [];
  const texts = [];
  const ids = {};

  const parser = new htmlparser2.Parser({
    onopentag(tagname, attributes) {
      let id = uuid();

      ids[id] = {
        id: id,
        tag: tagname,
        attributes: attributes,
        text: null,
        descendants: []
      };

      // add it to all ancestors
      place.forEach(anscestorId => {
        ids[anscestorId].descendants.push(id);
      });

      place.push(id);
    },
    ontext(text) {
      texts.push(text.trim());
    },
    onclosetag() {
      let id = place.pop();

      if (id && (typeof ids[id] !== 'undefined')) {
        ids[id].text = texts.pop();
      }
    }
  });

  parser.write(html);

  return Object.values(ids);
}