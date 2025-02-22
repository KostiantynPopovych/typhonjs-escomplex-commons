'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides a wrapper around a data field which may be an array, function or other primitive value.
 */
var Trait = function () {
  /**
   * Initializes trait data.
   *
   * @param {string}   metric - The name of Halstead metric being stored.
   * @param {*}        data - Data to wrap.
   */
  function Trait(metric, data) {
    (0, _classCallCheck3.default)(this, Trait);

    /* istanbul ignore if */
    if (typeof metric !== 'string') {
      throw new TypeError('ctor error: metric is not a `string`.');
    }

    /**
     * Stores the data to wrap.
     * @type {*}
     * @private
     */
    this._data = data;

    /**
     * Stores the Trait metric type.
     * @type {string}
     * @private
     */
    this._metric = metric;
  }

  /**
   * Returns the associated metric type.
   *
   * @returns {string}
   */


  (0, _createClass3.default)(Trait, [{
    key: 'valueOf',


    /**
     * Returns the value of the given data. If the wrapped data is a function it is invoked with the given `params`
     * otherwise the data is returned directly. If the wrapped data is an array a mapped version is returned
     * with each entry that is a function being invoked with the given `params`.
     *
     * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function. Normally
     *                      `params` should be the `current AST node, parent AST node, ... optional data`.
     *
     * @returns {*}
     */
    value: function valueOf() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      if (Array.isArray(this._data)) {
        return this._data.map(function (entry) {
          return typeof entry === 'function' ? entry.apply(undefined, params) : entry;
        });
      }

      return typeof this._data === 'function' ? this._data.apply(this, params) : this._data;
    }
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
  return Trait;
}();

exports.default = Trait;
module.exports = exports['default'];