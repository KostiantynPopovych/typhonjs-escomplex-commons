'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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
 * Provides a format transform for ESComplex ModuleReport / ProjectReport instances converting them to JSON that
 * corresponds to the XML checkstyle format.
 *
 * The checkstyle XML format outputs error elements for each file / module. This format depends on the output of
 * `FormatJSONCheckstyle`. The implementation below outputs a `file` array that contains an `error` array entries.
 *
 * There is a corresponding `FormatXMLCheckstyle` format loaded when `escomplex-plugin-formats-xml` during plugin
 * loading which converts the JSON output of this format transform to the official XML checkstyle format.
 *
 * @see http://checkstyle.sourceforge.net/
 * @see https://github.com/checkstyle/checkstyle
 * @see https://github.com/checkstyle/checkstyle/blob/master/src/main/java/com/puppycrawl/tools/checkstyle/XMLLogger.java
 */
var FormatJSONCheckstyle = function () {
   /**
    * Initializes
    *
    * @param {object} thresholds - Defines thresholds.
    */
   function FormatJSONCheckstyle() {
      var thresholds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : s_DEFAULT_THRESHOLDS;
      (0, _classCallCheck3.default)(this, FormatJSONCheckstyle);

      this._thresholds = thresholds;
   }

   /**
    * Formats a module report as JSON / checkstyle.
    *
    * @param {ModuleReport|ProjectReport} report - A module or project report to format.
    *
    * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
    * @property {number}      spacing - (Optional) An integer defining the JSON output spacing.
    *
    * @returns {string}
    */


   (0, _createClass3.default)(FormatJSONCheckstyle, [{
      key: 'formatReport',
      value: function formatReport(report) {
         var _this = this;

         var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

         var reports = void 0,
             reportsAvailable = void 0;

         switch (report.type) {
            case _ReportType2.default.MODULE:
               reports = [report];
               reportsAvailable = true;
               break;

            case _ReportType2.default.PROJECT:
               reports = report.modules;
               reportsAvailable = report.getSetting('serializeModules', false);
               break;

            default:
               console.warn('formatReport \'' + this.name + '\' warning: unsupported report type \'' + report.type + '\'.');
               return '';
         }

         var localOptions = (0, _assign2.default)({}, this._thresholds, options);

         var output = { version: '7.0', file: [] };

         reports.forEach(function (report) {
            output.file.push(_this._formatModule(report, reportsAvailable, localOptions));
         });

         return (typeof localOptions === 'undefined' ? 'undefined' : (0, _typeof3.default)(localOptions)) === 'object' && (0, _isInteger2.default)(localOptions.spacing) ? (0, _stringify2.default)(output, void 0, localOptions.spacing) : (0, _stringify2.default)(output);
      }

      /**
       * Gets the file extension.
       *
       * @returns {string}
       */

   }, {
      key: 'isSupported',


      /**
       * Returns whether a given ReportType is supported by this format transform.
       *
       * @param {ReportType}  reportType - A given report type.
       *
       * @returns {boolean}
       */
      value: function isSupported(reportType) {
         switch (reportType) {
            case _ReportType2.default.MODULE:
            case _ReportType2.default.PROJECT:
               return true;

            default:
               return false;
         }
      }

      /**
       * Formats a module report.
       *
       * @param {ModuleReport}   report - A module report.
       *
       * @param {boolean}        reportsAvailable - Indicates that the report metric data is available.
       *
       * @param {object}         options - (Optional) One or more optional entries defining threshold parameters.
       *
       * @returns {object}
       */

   }, {
      key: '_formatModule',
      value: function _formatModule(report, reportsAvailable, options) {
         var output = {};

         output.name = report.filePath ? report.filePath : '<unknown>';

         output.error = [];

         if (reportsAvailable) {
            if ((0, _typeof3.default)(options.moduleReport) === 'object') {
               this._parseErrors(report, options.moduleReport, output.error);
            }

            for (var cntr = 0; cntr < report.methods.length; cntr++) {
               if ((0, _typeof3.default)(options.methodReport) === 'object') {
                  this._parseErrors(report.methods[cntr], options.methodReport, output.error);
               }
            }

            for (var _cntr = 0; _cntr < report.classes.length; _cntr++) {
               var classReport = report.classes[_cntr];

               if ((0, _typeof3.default)(options.classReport) === 'object') {
                  this._parseErrors(classReport, options.classReport, output.error);
               }

               for (var cntr2 = 0; cntr2 < classReport.methods.length; cntr2++) {
                  if ((0, _typeof3.default)(options.methodReport) === 'object') {
                     this._parseErrors(classReport.methods[cntr2], options.methodReport, output.error);
                  }
               }
            }
         }

         return output;
      }

      /**
       * Parses errors from report
       *
       * @param {object}   sourceObject - A report object
       * @param {object}   options - Options
       * @param {Array}    errors - An array to accumulate errors.
       * @private
       */

   }, {
      key: '_parseErrors',
      value: function _parseErrors(sourceObject, options, errors) {
         for (var key in options) {
            if (!options.hasOwnProperty(key)) {
               continue;
            }

            var sourceObjectValue = _ObjectUtil2.default.safeAccess(sourceObject, key);

            if (typeof sourceObjectValue === 'number') {
               var severity = undefined;
               var mapEntryValue = void 0;
               var testSign = void 0;

               var map = options[key];

               for (var entryKey in map) {
                  if (!map.hasOwnProperty(entryKey)) {
                     continue;
                  }

                  // Skip `_test` entry.
                  if (entryKey === '_test') {
                     continue;
                  }

                  switch (map._test) {
                     case '<':
                        if (sourceObjectValue < map[entryKey]) {
                           severity = entryKey;
                           mapEntryValue = map[entryKey];
                           testSign = ' < ';
                        }
                        break;

                     case '<=':
                        if (sourceObjectValue <= map[entryKey]) {
                           severity = entryKey;
                           mapEntryValue = map[entryKey];
                           testSign = ' <= ';
                        }
                        break;

                     case '>=':
                        if (sourceObjectValue >= map[entryKey]) {
                           severity = entryKey;
                           mapEntryValue = map[entryKey];
                           testSign = ' >= ';
                        }
                        break;

                     default:
                        if (sourceObjectValue > map[entryKey]) {
                           severity = entryKey;
                           mapEntryValue = map[entryKey];
                           testSign = ' > ';
                        }
                        break;
                  }
               }

               if (typeof severity === 'string') {
                  var sourceName = sourceObject.getName();

                  errors.push({
                     line: sourceObject.lineStart,
                     severity: severity,
                     message: key + ': ' + sourceObjectValue + testSign + mapEntryValue,
                     source: sourceObject.type.description + ' ' + (sourceName !== '' ? '- ' + sourceName : '')
                  });
               }
            }
         }
      }
   }, {
      key: 'extension',
      get: function get() {
         return 'json';
      }

      /**
       * Gets the format name.
       *
       * @returns {string}
       */

   }, {
      key: 'name',
      get: function get() {
         return 'json-checkstyle';
      }

      /**
       * Gets the format type.
       *
       * @returns {string}
       */

   }, {
      key: 'type',
      get: function get() {
         return 'checkstyle';
      }
   }]);
   return FormatJSONCheckstyle;
}();

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Defines default thresholds for severity levels matching the XML checkstyle format.
 * error levels: info, warning, error
 *
 * Entries may include `classReport`, `methodReport`, `moduleReport` that each define an object hash of threshold
 * object hashes. The key of each threshold hash is the entry key to compare against the `info, warning, error` values.
 * By default the order flows left to right using greater than comparisons. An optional entry is `_test` which is a
 * string defining the comparison operations with the following supported options, `<`, `<=`, `>`, and `>=`.
 *
 * @type {{classReport: {maintainability: {_test: string, info: number, warning: number, error: number}}, methodReport: {cyclomatic: {info: number, warning: number, error: number}, [halstead.difficulty]: {info: number, warning: number, error: number}}, moduleReport: {maintainability: {_test: string, info: number, warning: number, error: number}}}}
 * @ignore
 */


exports.default = FormatJSONCheckstyle;
var s_DEFAULT_THRESHOLDS = {
   classReport: {
      maintainability: { _test: '<', info: 115, warning: 100, error: 90 }
   },
   methodReport: {
      'cyclomatic': { info: 3, warning: 7, error: 12 },
      'halstead.difficulty': { info: 8, warning: 13, error: 20 }
   },
   moduleReport: {
      maintainability: { _test: '<', info: 115, warning: 100, error: 90 }
   }
};
module.exports = exports['default'];