'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['', '', '', '', ''], ['', '', '', '', '']);

var _ObjectUtil = require('./ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides common string utilities.
 */
var StringUtil = function () {
  function StringUtil() {
    (0, _classCallCheck3.default)(this, StringUtil);
  }

  (0, _createClass3.default)(StringUtil, null, [{
    key: 'compare',

    /**
     * Compares two strings.
     *
     * @param {string}   lhs - Left-hand side.
     * @param {string}   rhs - Right-hand side.
     *
     * @returns {number}
     */
    value: function compare(lhs, rhs) {
      return lhs.toLowerCase().localeCompare(rhs.toLowerCase());
    }

    /**
     * Increments the indentation amount.
     *
     * @param {number}   indentation - Current indentation amount.
     * @param {number}   amount - (Optional) indentation amount; default: 3.
     *
     * @returns {number}
     */

  }, {
    key: 'incrementIndent',
    value: function incrementIndent(indentation) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

      return indentation + amount;
    }

    /**
     * Creates an indentation string given the indentation amount.
     *
     * @param {number}   indentation - Current indentation amount.
     * @param {string}   string - A string to append.
     *
     * @returns {string}
     */

  }, {
    key: 'indent',
    value: function indent(indentation) {
      var string = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return new Array(indentation + 1).join(' ') + string;
    }

    /**
     * Returns the SafeEntry constructor which is used by `safeStringsObject` and `safeStringsPrependObject`.
     *
     * @returns {SafeEntry}
     */

  }, {
    key: 'safeStringObject',


    /**
     * Provides a way to output a given string value with concatenated data from safely accessing an objects data /
     * entries given an accessor string which describes the entries to walk. To access deeper entries into the object
     * format the accessor string with `.` between entries to walk.
     *
     * @param {string}   string - A string to prepend to the object data received.
     * @param {object}   object - An object to access entry data.
     * @param {string}   accessor - A string describing the entries to access.
     * @param {number}   newLine - (Optional) A number of new line characters to append; default: `1`.
     * @param {string}   appendString - (Optional) A string to potentially append; default: `''`;
     * @param {function} tagFunction - (Optional) A template tag function to apply; default: `void 0`;
     *
     * @returns {string}
     */
    value: function safeStringObject(string, object, accessor) {
      var newLine = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var appendString = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
      var tagFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : void 0;

      var value = _ObjectUtil2.default.safeAccess(object, accessor);

      if (typeof value === 'undefined' || Array.isArray(value) && value.length === 0) {
        return '';
      }

      var end = '\n';

      // Create the ending new line result if it is not the default of `1`.
      if (newLine === 0 || newLine > 1) {
        end = new Array(newLine + 1).join('\n');
      }

      return typeof tagFunction === 'function' ? tagFunction(_templateObject, string, value, appendString, end) : '' + string + value + appendString + end;
    }

    /**
     * Provides a convenience method producing a block of `safeStringObject` results.
     *
     * @param {object}         object - An object to access entry data.
     *
     * @param {string|SafeEntry|Array<string|SafeEntry>} entries -
     *                                  Multiple arrays or strings. If an entry is not a SafeEntry it will
     *                                  simply be appended. If the entry is an array then entries in this array
     *                                  correspond to the following parameters which are forwarded onto
     *                                  `safeStringObject`.
     *
     * @returns {string}
     */

  }, {
    key: 'safeStringsObject',
    value: function safeStringsObject(object) {
      for (var _len = arguments.length, entries = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        entries[_key - 1] = arguments[_key];
      }

      return StringUtil.safeStringsPrependObject.apply(StringUtil, ['', object].concat(entries));
    }

    /**
     * Provides a convenience method producing a block of `safeStringObject` results with the option to prepend a
     * given string.
     *
     * @param {*}              origPrepend - An additional value to prepend to all results.
     *
     * @param {object}         object - An object to access entry data.
     *
     * @param {string|SafeEntry|Array<string|SafeEntry>} entries -
     *                                  Multiple arrays or strings. If an entry is not a SafeEntry it will
     *                                  simply be appended. If the entry is an array then entries in this array
     *                                  correspond to the following parameters which are forwarded onto
     *                                  `safeStringObject`.
     *
     * @returns {string}
     */

  }, {
    key: 'safeStringsPrependObject',
    value: function safeStringsPrependObject(origPrepend, object) {
      if ((typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) !== 'object') {
        return '';
      }

      var output = [];

      var skipPrepend = false;

      for (var _len2 = arguments.length, entries = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        entries[_key2 - 2] = arguments[_key2];
      }

      for (var cntr = 0; cntr < entries.length; cntr++) {
        var entry = entries[cntr];

        // Skip prepend action if last entry did not include a new line.
        var prepend = skipPrepend ? '' : origPrepend;

        // Process an array entry otherwise simply append `entry` to output if it is a string.
        if (entry instanceof SafeEntry) {
          skipPrepend = entry.newLine === 0;

          output.push(StringUtil.safeStringObject('' + prepend + entry.prependString, object, entry.accessor, entry.newLine, entry.appendString, entry.tagFunction));
        } else if (typeof entry === 'string' && entry !== '') {
          output.push('' + prepend + entry);
        } else if (typeof entry.toString === 'function') {
          var stringValue = entry.toString();

          if (stringValue !== '') {
            output.push('' + prepend + stringValue);
          }
        }
      }

      return output.join('');
    }

    /**
     * Provides a tagged template method to escape HTML elements.
     *
     * @param {Array<string>}  literal - Literal components of template string.
     * @param {Array<*>}       values - Values to substitute.
     *
     * @returns {string}
     */

  }, {
    key: 'tagEscapeHTML',
    value: function tagEscapeHTML(literal) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      return values.reduce(function (previous, value, index) {
        return previous + String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;') + literal[index + 1];
      }, literal[0]);
    }
  }, {
    key: 'SafeEntry',
    get: function get() {
      return SafeEntry;
    }
  }]);
  return StringUtil;
}();

/**
 * Defines the parameters for a safe string object lookup. If the accessor resolves against a given object then
 * a string is created by combining the prepend / append strings between the value with optional new lines appended
 * at the end. If a template tag function is defined it is applied to the template string.
 */


exports.default = StringUtil;

var SafeEntry = function () {
  /**
   * Initializes SafeEntry instance.
   *
   * @param {string}   prependString - The string to prepend.
   * @param {string}   accessor - The accessor string describing the lookup operation.
   * @param {number}   newLine - (Optional) The number of newlines characters to append.
   * @param {string}   appendString - (Optional) A string to append to the end.
   * @param {function} tagFunction - (Optional) A template tag function to apply.
   */
  function SafeEntry(prependString, accessor) {
    var newLine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var appendString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var tagFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : void 0;
    (0, _classCallCheck3.default)(this, SafeEntry);

    if (typeof prependString !== 'string') {
      throw new TypeError('ctor error: \'prependString\' is not a \'string\'.');
    }
    if (typeof accessor !== 'string') {
      throw new TypeError('ctor error: \'accessor\' is not a \'string\'.');
    }
    if (typeof appendString !== 'string') {
      throw new TypeError('ctor error: \'appendString\' is not a \'string\'.');
    }

    if (typeof tagFunction !== 'function' && typeof tagFunction !== 'undefined') {
      throw new TypeError('ctor error: \'tagFunction\' is not a \'function\' or \'undefined\'.');
    }

    if ((0, _isInteger2.default)(newLine) && newLine < 0) {
      throw new TypeError('ctor error: \'newLine\' is not a positive \'integer\' (' + newLine + ').');
    }

    /**
     * The string to prepend.
     * @type {string}
     * @private
     */
    this._prependString = prependString;

    /**
     * The accessor string describing the lookup operation.
     * @type {string}
     * @private
     */
    this._accessor = accessor;

    /**
     * The number of newlines characters to append.
     * @type {number}
     * @private
     */
    this._newLine = newLine;

    /**
     * A string to append to the end.
     * @type {string}
     * @private
     */
    this._appendString = appendString;

    /**
     * A template tag function to apply.
     * @type {Function}
     * @private
     */
    this._tagFunction = tagFunction;
  }

  /**
   * Returns the accessor string describing the lookup operation.
   * @returns {string}
   */


  (0, _createClass3.default)(SafeEntry, [{
    key: 'accessor',
    get: function get() {
      return this._accessor;
    }

    /**
     * Returns a string to append to the end if any.
     * @returns {string}
     */

  }, {
    key: 'appendString',
    get: function get() {
      return this._appendString;
    }

    /**
     * Returns the new line count.
     * @returns {number}
     */

  }, {
    key: 'newLine',
    get: function get() {
      return this._newLine;
    }

    /**
     * Returns the string to prepend.
     * @returns {string}
     */

  }, {
    key: 'prependString',
    get: function get() {
      return this._prependString;
    }

    /**
     * Returns a template tag function to apply if any.
     * @returns {Function}
     */

  }, {
    key: 'tagFunction',
    get: function get() {
      return this._tagFunction;
    }
  }]);
  return SafeEntry;
}();

module.exports = exports['default'];