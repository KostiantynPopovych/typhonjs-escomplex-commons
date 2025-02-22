'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _ObjectUtil = require('../../../utils/ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

var _ReportType = require('../../../types/ReportType');

var _ReportType2 = _interopRequireDefault(_ReportType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides the base text format transform for ProjectReport matrix list entries.
 */
var AbstractTextMatrix = function () {
   /**
    * Initializes instance storing default headers / keys.
    *
    * @param {object}      headers - An object hash containing the following entries.
    * @property {string}   entryPrepend - A string to prepend all entries.
    * @property {string}   entryWrapper - A string to wrap output entries between.
    * @property {string}   textHeader - A string to prepend output providing a leading header.
    *
    * @param {object}      keys - An object hash containing the following entries.
    * @property {boolean}  matrixFilePath - If true the module `filePath` is serialized.
    * @property {string}   matrixList - An entry key to lookup a given matrix list in a ProjectReport.
    * @property {boolean}  zeroIndex - If true module report indexes are zero indexed.
    */
   function AbstractTextMatrix() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      (0, _classCallCheck3.default)(this, AbstractTextMatrix);

      this._headers = headers;
      this._keys = keys;
   }

   /**
    * Formats a report as plain text.
    *
    * @param {ClassReport|MethodReport|ModuleReport|ProjectReport} report - A report to format.
    *
    * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
    * @property {number}      spacing - (Optional) An integer defining the JSON output spacing.
    *
    * @returns {string}
    */


   (0, _createClass3.default)(AbstractTextMatrix, [{
      key: 'formatReport',
      value: function formatReport(report) {
         var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

         switch (report.type) {
            case _ReportType2.default.PROJECT:
               return this._formatProject(report, options);

            default:
               console.warn('formatReport \'' + this.name + '\' warning: unsupported report type \'' + report.type + '\'.');
               return '';
         }
      }

      /**
       * Returns whether a given ReportType is supported by this format transform.
       *
       * @param {ReportType}  reportType - A given report type.
       *
       * @returns {boolean}
       */

   }, {
      key: 'isSupported',
      value: function isSupported(reportType) {
         switch (reportType) {
            case _ReportType2.default.PROJECT:
               return true;

            default:
               return false;
         }
      }

      /**
       * Formats a matrix list stored in a ProjectReport.
       *
       * @param {ProjectReport}  projectReport - A project report.
       *
       * @param {object}      options - (Optional) An object hash containing the following entries.
       * @property {boolean}  matrixFilePath - If true the module `filePath` is serialized.
       * @property {string}   matrixList - An entry key to lookup a given matrix list in a ProjectReport.
       * @property {boolean}  zeroIndex - If true module report indexes are zero indexed.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatProject',
      value: function _formatProject(projectReport) {
         var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

         var localOptions = (0, _assign2.default)({}, this._keys, options);

         var matrixList = _ObjectUtil2.default.safeAccess(projectReport, localOptions.matrixList);

         /* istanbul ignore if */
         if (!Array.isArray(matrixList)) {
            throw new TypeError('formatProject error: could not locate matrixList \'' + localOptions.matrixList + '\'.');
         }

         /* istanbul ignore if */
         if (!Array.isArray(projectReport.modules)) {
            throw new TypeError('formatProject error: could not locate \'projectReport.modules\'.');
         }

         /* istanbul ignore if */
         if (typeof this._headers.entryPrepend !== 'string') {
            throw new TypeError('formatProject error: \'this._headers.entryPrepend\' is not a \'string\'.');
         }

         /* istanbul ignore if */
         if (typeof this._headers.entryWrapper !== 'string') {
            throw new TypeError('formatProject error: \'this._headers.entryWrapper\' is not a \'string\'.');
         }

         var output = '';

         // Add any defined text header.
         if (typeof this._headers.textHeader === 'string') {
            output += this._headers.textHeader;
         }

         output += this._formatMatrixList(projectReport, matrixList, localOptions);

         return output;
      }

      /**
       * Returns a string representing the adjacency relationships by printing out the report index followed by
       * dependent ModuleReport indices / `srcPaths`.
       *
       * @param {ProjectReport}                          projectReport - A project report containing the matrix list.
       *
       * @param {Array<{row: number, cols: number[]}>}   matrixList - The matrix list to be serialized.
       *
       * @param {object}                                 options - (Optional) An object hash of options.
       * @property {boolean}                             zeroIndex - If true module report indexes are zero indexed.
       * @property {boolean}                             matrixFilePath - If true the module `filePath` is serialized.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatMatrixList',
      value: function _formatMatrixList(projectReport, matrixList, options) {
         var output = '';

         var plus1 = typeof options.zeroIndex === 'boolean' && options.zeroIndex ? 0 : 1;
         var path = typeof options.matrixFilePath === 'boolean' && options.matrixFilePath ? 'filePath' : 'srcPath';

         var entryPrepend = this._headers.entryPrepend;
         var entryWrapper = this._headers.entryWrapper;

         matrixList.forEach(function (entry) {
            output += '' + entryPrepend + (entry.row + plus1) + ':\t' + entryWrapper + _ObjectUtil2.default.safeAccess(projectReport.modules[entry.row], path, 'unknown') + entryWrapper + '\n';

            entry.cols.forEach(function (colIndex) {
               output += '\t' + entryPrepend + (colIndex + plus1) + ':\t' + entryWrapper + _ObjectUtil2.default.safeAccess(projectReport.modules[colIndex], path, 'unknown') + entryWrapper + '\n';
            });

            output += '\n';
         });

         return output;
      }
   }]);
   return AbstractTextMatrix;
}();

exports.default = AbstractTextMatrix;
module.exports = exports['default'];