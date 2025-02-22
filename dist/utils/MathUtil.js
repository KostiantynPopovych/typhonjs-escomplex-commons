'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _ObjectUtil = require('./ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides common math utilities.
 */
var MathUtil = function () {
   function MathUtil() {
      (0, _classCallCheck3.default)(this, MathUtil);
   }

   (0, _createClass3.default)(MathUtil, null, [{
      key: 'compactMatrix',

      /**
       * Compacts a 2D matrix testing entries against a testValue with a default value of `1` for inclusion. The resulting
       * compacted array only has object hash entries for rows that contain column entries that pass the test. Each entry
       * has a `row` entry as a number corresponding to a row index and a `cols` entry which is an array of numbers
       * representing all column indexes that pass the test. This works well for large sparse matrices.
       *
       * @param {Array<Array<number>>} matrix - A matrix to compact / compress.
       * @param {*}                    testValue - A value to test strict equality to include entry for compaction.
       *
       * @returns {Array<{row: number, cols: Array<number>}>}
       */
      value: function compactMatrix(matrix) {
         var testValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

         var compacted = [];

         matrix.forEach(function (rowEntry, row) {
            var cols = [];

            rowEntry.forEach(function (colEntry, colIndex) {
               if (colEntry === testValue) {
                  cols.push(colIndex);
               }
            });

            if (cols.length > 0) {
               compacted.push({ row: row, cols: cols });
            }
         });

         return compacted;
      }

      /**
       * Creates an 2-dimensional array of the given length.
       *
       * @param {number}   length - Array length for x / y dimensions.
       * @param {number}   value - Default value.
       *
       * @return {Array<Array<number>>}
       */

   }, {
      key: 'create2DArray',
      value: function create2DArray() {
         var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
         var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

         var array = new Array(length);

         for (var cntr = 0; cntr < length; cntr++) {
            array[cntr] = new Array(length);
         }

         for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
               array[i][j] = value;
            }
         }

         return array;
      }

      /**
       * Returns the median / middle value from the given array after sorting numerically. If values length is odd the
       * middle value in the array is returned otherwise if even two middle values are summed then divided by 2.
       *
       * @param {Array<number>}  values - An Array of numerical values.
       *
       * @returns {number}
       */

   }, {
      key: 'getMedian',
      value: function getMedian(values) {
         // Sort by number.
         values.sort(function (lhs, rhs) {
            return lhs - rhs;
         });

         // Checks of values.length is odd.
         if (values.length % 2) {
            return values[(values.length - 1) / 2];
         }

         return (values[(values.length - 2) / 2] + values[values.length / 2]) / 2;
      }

      /**
       * Returns the percent of a given value and limit.
       *
       * @param {number}   value - A `value` to calculate the percentage against the given `limit`.
       * @param {number}   limit - A base `limit` that constrains the `value`.
       *
       * @returns {number}
       */

   }, {
      key: 'getPercent',
      value: function getPercent(value, limit) {
         return limit === 0 ? 0 : value / limit * 100;
      }

      /**
       * Performs a naive depth traversal of an object / array. The data structure _must not_ have circular references.
       * The result of the `toFixed` method is invoked for each leaf or array entry modifying any floating point number
       * in place.
       *
       * @param {object}   data - An object or array.
       *
       * @returns {*}
       */

   }, {
      key: 'toFixedTraverse',
      value: function toFixedTraverse(data) {
         return _ObjectUtil2.default.depthTraverse(data, MathUtil.toFixed, true);
      }

      /**
       * Converts floating point numbers to a fixed decimal length of 3. This saves space and avoids precision
       * issues with serializing / deserializing.
       *
       * @param {*}  val - Any value; only floats are processed.
       *
       * @returns {*}
       */

   }, {
      key: 'toFixed',
      value: function toFixed(val) {
         return typeof val === 'number' && !(0, _isInteger2.default)(val) ? Math.round(val * 1000) / 1000 : val;
      }
   }]);
   return MathUtil;
}();

exports.default = MathUtil;
module.exports = exports['default'];