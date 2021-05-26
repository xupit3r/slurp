const { URL } = require('url');
const { v4: uuid } = require('uuid');
const htmlparser2 = require('htmlparser2');

/**
 * Takes HTML, parses it, and provides access to information about the 
 * document.
 */
module.exports = class Parser {
  /**
   * Builds a parser for a web requested HTML document
   * 
   * @param {String} base this is the base URL associated with the document
   * @param {String} html the HTML to be associated with this parser
   */
  constructor (base, html) {
    this.base = base;
    this.html = html;
    this.items = [];
  }

  /**
   * Parses the HTML associated with this class.
   */
  parse () {
    const place = [];
    const texts = [];
    const ids = {};

    const htmlParser = new htmlparser2.Parser({
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

    htmlParser.write(this.html);

    this.items = Object.values(ids);
  }

  /**
   * Retrieves any links that exist in the document.
   * 
   * @returns an array of fully qualified links found in the document.
   */
  get links () {
    return this.items.filter(v => v.tag === 'a').map(v => {
      let { href } = new URL(v.attributes.href, this.base);
      return href;
    });
  }

  /**
   * Retrieves all text from within the document. The text is returned 
   * as an array, where each element is a continuous block of text that 
   * was found within the document.
   * 
   * @returns an array of strings (in document order)
   */
  get text () {
    return this.items.filter(v => v.text).map(v => v.text);
  }
}