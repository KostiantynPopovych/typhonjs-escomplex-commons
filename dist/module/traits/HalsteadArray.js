'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _TraitHalstead = require('./TraitHalstead');

var _TraitHalstead2 = _interopRequireDefault(_TraitHalstead);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides a wrapper around an array of Halstead property object hashes which should contain an
 * `identifier` field and potentially a `filter` field.
 */
var HalsteadArray = function () {
  /**
   * Initializes HalsteadArray by normalizing any Halstead properties converting them into TraitHalstead instances.
   *
   * @param {string}               metric - The name of Halstead metric being stored.
   * @param {Array<object|string>} data - An array of Halstead properties.
   */
  function HalsteadArray(metric, data) {
    (0, _classCallCheck3.default)(this, HalsteadArray);

    /* istanbul ignore if */
    if (typeof metric !== 'string') {
      throw new TypeError('ctor error: metric is not a `string`.');
    }

    /* istanbul ignore if */
    if (!Array.isArray(data)) {
      throw new TypeError('ctor error: data is not an `Array`.');
    }

    /**
     * Stores an array of normalized Halstead property data to an object hash that has an `identifier` entry.
     * @type {Array<TraitHalstead>}
     * @private
     */
    this._data = data.map(function (property) {
      return property && typeof property.identifier !== 'undefined' ? new _TraitHalstead2.default(metric, property) : new _TraitHalstead2.default(metric, { identifier: property });
    });

    /**
     * Stores the Halstead metric type.
     * @type {string}
     * @private
     */
    this._metric = metric;
  }

  /**
   * Allows custom processing of TraitHalstead data.
   *
   * @param {function} callback - A custom method to process each TraitHalstead data.
   * @param {object}   thisArg - The this `this` scope to run callback with.
   */


  (0, _createClass3.default)(HalsteadArray, [{
    key: 'forEach',
    value: function forEach(callback, thisArg) {
      this._data.forEach(callback, thisArg);
    }

    /**
     * Returns a TraitHalstead entry at the given index.
     *
     * @param {number}   index - Index to access.
     *
     * @returns {TraitHalstead}
     */

  }, {
    key: 'get',
    value: function get(index) {
      return this._data[index];
    }

    /**
     * Returns the length of wrapped TraitHalstead data.
     *
     * @returns {number}
     */

  }, {
    key: 'valueOf',


    /**
     * Returns an array of evaluated TraitHalstead data as the value of the `identifier` field of the wrapped data.
     * Additionally the TraitHalstead filter function is invoked with the given parameters removing any values that
     * fail the filter test.
     *
     * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function. Normally
     *                      `params` should be the `current AST node, parent AST node, ... optional data`.
     *
     * @returns {Array<string>}
     */
    value: function valueOf() {
      var _ref;

      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var filtered = this._data.filter(function (traitHalstead) {
        return typeof traitHalstead.valueOf.apply(traitHalstead, params) !== 'undefined' && traitHalstead.filter.apply(traitHalstead, params);
      });

      // Map all TraitHalstead data and flatten any array of identifiers returned from `valueOf` and finally convert
      // all flattened identifier entries to strings as necessary.
      return (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(filtered.map(function (traitHalstead) {
        return traitHalstead.valueOf.apply(traitHalstead, params);
      }))).map(function (entry) {
        // Convert any `undefined` entry to a text string. This should only occur when a TraitHalstead defined
        // as a function returns an array containing `undefined`; in this case there is an issue with a syntax trait
        // definition not properly verifying data.

        /* istanbul ignore if */
        if (entry === void 0) {
          console.warn('HalsteadArray valueOf warning: undefined TraitHalstead item entry converted to a \'string\'.');
          entry = 'undefined';
        }

        // Convert any entries to strings as necessary.
        return typeof entry !== 'string' ? (0, _stringify2.default)(entry) : entry;
      });
    }
  }, {
    key: 'length',
    get: function get() {
      return this._data.length;
    }

    /**
     * Returns the associated metric type.
     *
     * @returns {string}
     */

  }, {
    key: 'metric',
    get: function get() {
      return this._metric;
    }

    /**
     * Returns the typeof data being wrapped.
     *
     * @returns {string}
     */

  }, {
    key: 'type',
    get: function get() {
      return (0, _typeof3.default)(this._data);
    }
  }]);
  return HalsteadArray;
}();

exports.default = HalsteadArray;
module.exports = exports['default'];