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
 * Provides a wrapper around a data object hash which should contain an `identifier` field and potentially a `filter`
 * field which is a function. The identifier can be a function or string or an array of functions / strings.
 */
var TraitHalstead = function () {
   /**
    * Initializes the Halstead trait.
    *
    * @param {string}   metric - The name of Halstead metric being stored.
    * @param {object}   data - The data field to be wrapped.
    */
   function TraitHalstead(metric, data) {
      (0, _classCallCheck3.default)(this, TraitHalstead);

      /* istanbul ignore if */
      if (typeof metric !== 'string') {
         throw new TypeError('ctor error: metric is not a `string`.');
      }

      /* istanbul ignore if */
      if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) !== 'object') {
         throw new TypeError('ctor error: data is not an `object`.');
      }

      /* istanbul ignore if */
      if (Array.isArray(data.identifier)) {
         data.identifier.forEach(function (element, index) {
            if (element !== 'function' && typeof element !== 'string') {
               throw new TypeError('ctor error: data.identifier array is not a \'function\' or \'string\' at index: ' + index + '.');
            }
         });
      } else {
         /* istanbul ignore if */
         if (typeof data.identifier !== 'function' && typeof data.identifier !== 'string') {
            throw new TypeError('ctor error: data.identifier is not a `function` or `string`.');
         }
      }

      /* istanbul ignore if */
      if (typeof data.filter !== 'undefined' && typeof data.filter !== 'function') {
         throw new TypeError('ctor error: data.filter is not a `function`.');
      }

      /**
       * Stores the data to wrap.
       * @type {*}
       * @private
       */
      this._data = data;

      /**
       * Stores the Halstead metric type.
       * @type {string}
       * @private
       */
      this._metric = metric;
   }

   /**
    * Returns the value of the `filter` field of the wrapped data. If the wrapped `filter` field is a function it
    * is invoked with the given `params` otherwise the data is returned directly. If `filter` is not defined then
    * `true` is returned.
    *
    * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function. Normally
    *                      `params` should be the `current AST node, parent AST node, ... optional data`.
    *
    * @returns {boolean}
    */


   (0, _createClass3.default)(TraitHalstead, [{
      key: 'filter',
      value: function filter() {
         var _data;

         return typeof this._data.filter === 'function' ? (_data = this._data).filter.apply(_data, arguments) : true;
      }

      /**
       * Returns the associated metric type.
       *
       * @returns {string}
       */

   }, {
      key: 'valueOf',


      /**
       * Returns the value of the `identifier` field of the wrapped data. If the wrapped `identifier` field is a function
       * it is invoked with the given `params` otherwise the data is returned directly.
       *
       * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function.
       *
       * @returns {*|Array<*>}
       */
      value: function valueOf() {
         var _data2;

         for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
         }

         if (Array.isArray(this._data.identifier)) {
            return this._data.identifier.map(function (entry) {
               return typeof entry === 'function' ? entry.apply(undefined, params) : entry;
            });
         }

         return typeof this._data.identifier === 'function' ? (_data2 = this._data).identifier.apply(_data2, params) : this._data.identifier;
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
   return TraitHalstead;
}();

exports.default = TraitHalstead;
module.exports = exports['default'];