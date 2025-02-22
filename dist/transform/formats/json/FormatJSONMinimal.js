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
 * Provides a format transform for ESComplex ModuleReport / ProjectReport instances converting them to JSON with
 * minimal metrics.
 */
var FormatJSONMinimal = function () {
   /**
    * Initializes format.
    *
    * @param {object}   keys - Defines the keys to include in a minimal JSON representation of class / class method /
    *                          module method / module / project reports.
    */
   function FormatJSONMinimal() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : s_DEFAULT_KEYS;
      (0, _classCallCheck3.default)(this, FormatJSONMinimal);

      this._keys = keys;
   }

   /**
    * Formats a report as a JSON string with minimal metrics.
    *
    * @param {ClassReport|MethodReport|ModuleReport|ProjectReport} report - A report to format.
    *
    * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
    * @property {number}      spacing - (Optional) An integer defining the JSON output spacing.
    *
    * @returns {string}
    */


   (0, _createClass3.default)(FormatJSONMinimal, [{
      key: 'formatReport',
      value: function formatReport(report) {
         var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

         var localOptions = (0, _assign2.default)({}, this._keys, options);

         var output = void 0;

         switch (report.type) {
            case _ReportType2.default.CLASS:
               output = this._formatClass(report, localOptions);
               break;

            case _ReportType2.default.CLASS_METHOD:
            case _ReportType2.default.MODULE_METHOD:
            case _ReportType2.default.NESTED_METHOD:
               output = this._formatMethod(report, localOptions);
               break;

            case _ReportType2.default.MODULE:
               output = this._formatModule(report, true, localOptions);
               break;

            case _ReportType2.default.PROJECT:
               output = this._formatProject(report, localOptions);
               break;

            default:
               console.warn('formatReport \'' + this.name + '\' warning: unsupported report type \'' + report.type + '\'.');
               return '';
         }

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
            case _ReportType2.default.CLASS:
            case _ReportType2.default.CLASS_METHOD:
            case _ReportType2.default.MODULE_METHOD:
            case _ReportType2.default.MODULE:
            case _ReportType2.default.NESTED_METHOD:
            case _ReportType2.default.PROJECT:
               return true;

            default:
               return false;
         }
      }

      /**
       * Formats a module reports methods array.
       *
       * @param {ClassReport} classReport - A ClassReport instance to format.
       *
       * @param {object}      options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}   classReport - An entry key found in the class report to output.
       * @property {string}   methodReport - An entry key found in the method report to output.
       *
       * @returns {object}
       */

   }, {
      key: '_formatClass',
      value: function _formatClass(classReport, options) {
         var _this = this;

         var entry = {};

         if (classReport.name) {
            entry.name = classReport.name;
         }
         if (classReport.lineStart) {
            entry.lineStart = classReport.lineStart;
         }
         if (classReport.lineEnd) {
            entry.lineEnd = classReport.lineEnd;
         }

         if (Array.isArray(options.classReport)) {
            options.classReport.forEach(function (classEntry) {
               var entryValue = _ObjectUtil2.default.safeAccess(classReport, classEntry);
               if (entryValue) {
                  _ObjectUtil2.default.safeSet(entry, classEntry, entryValue);
               }
            });
         }

         entry.methods = classReport.methods.map(function (methodReport) {
            return _this._formatMethod(methodReport, options);
         });

         return entry;
      }

      /**
       * Formats a module or class reports methods array.
       *
       * @param {MethodReport}   methodReport - A method report instance to format.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      methodReport - An entry key found in the method report to output.
       *
       * @returns {object}
       */

   }, {
      key: '_formatMethod',
      value: function _formatMethod(methodReport, options) {
         var entry = {};

         if (methodReport.name) {
            entry.name = methodReport.name;
         }
         if (methodReport.lineStart) {
            entry.lineStart = methodReport.lineStart;
         }
         if (methodReport.lineEnd) {
            entry.lineEnd = methodReport.lineEnd;
         }

         if (Array.isArray(options.methodReport)) {
            options.methodReport.forEach(function (methodEntry) {
               var entryValue = _ObjectUtil2.default.safeAccess(methodReport, methodEntry);
               if (entryValue) {
                  _ObjectUtil2.default.safeSet(entry, methodEntry, entryValue);
               }
            });
         }

         return entry;
      }

      /**
       * Formats a module report.
       *
       * @param {ModuleReport}   report - A module report.
       *
       * @param {boolean}        reportsAvailable - Indicates that the report metric data is available.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      classReport - An entry key found in the class report to output.
       * @property {string}      methodReport - An entry key found in the method report to output.
       * @property {string}      moduleReport - An entry key found in the module report to output.
       *
       * @returns {object}
       */

   }, {
      key: '_formatModule',
      value: function _formatModule(report, reportsAvailable, options) {
         var _this2 = this;

         var output = {};

         if (reportsAvailable) {
            if (report.filePath) {
               output.filePath = report.filePath;
            }
            if (report.srcPath) {
               output.srcPath = report.srcPath;
            }
            if (report.srcPathAlias) {
               output.srcPathAlias = report.srcPathAlias;
            }
            if (report.lineStart) {
               output.lineStart = report.lineStart;
            }
            if (report.lineEnd) {
               output.lineEnd = report.lineEnd;
            }

            if (Array.isArray(options.moduleReport)) {
               options.moduleReport.forEach(function (moduleEntry) {
                  var entryValue = _ObjectUtil2.default.safeAccess(report, moduleEntry);
                  if (entryValue) {
                     _ObjectUtil2.default.safeSet(output, moduleEntry, entryValue);
                  }
               });
            }

            output.classes = report.classes.map(function (classReport) {
               return _this2._formatClass(classReport, options);
            });
            output.methods = report.methods.map(function (methodReport) {
               return _this2._formatMethod(methodReport, options);
            });
         } else {
            if (report.filePath) {
               output.filePath = report.filePath;
            }
            if (report.srcPath) {
               output.srcPath = report.srcPath;
            }
            if (report.srcPathAlias) {
               output.srcPathAlias = report.srcPathAlias;
            }
            if (report.lineStart) {
               output.lineStart = report.lineStart;
            }
            if (report.lineEnd) {
               output.lineEnd = report.lineEnd;
            }

            output.classes = [];
            output.methods = [];
         }

         return output;
      }

      /**
       * Formats a project report with minimal metrics.
       *
       * @param {ProjectReport}     report - A project report.
       *
       * @param {object}            options - (Optional) One or more optional parameters passed to the formatter.
       * @property {Array<string>}  classReport - An array of entry keys found in the class report to output.
       * @property {Array<string>}  methodReport - An array of entry keys found in the method report to output.
       * @property {Array<string>}  moduleReport - An array of entry keys found in the module report to output.
       * @property {Array<string>}  projectReport - An array of entry keys found in the project report to output.
       *
       * @returns {object}
       */

   }, {
      key: '_formatProject',
      value: function _formatProject(report, options) {
         var _this3 = this;

         var output = {};

         if (Array.isArray(options.projectReport)) {
            options.projectReport.forEach(function (projectEntry) {
               var entryValue = _ObjectUtil2.default.safeAccess(report, projectEntry);
               if (entryValue) {
                  _ObjectUtil2.default.safeSet(output, projectEntry, entryValue);
               }
            });
         }

         output.modules = [];

         var reportsAvailable = report.getSetting('serializeModules', false);

         report.modules.forEach(function (report) {
            output.modules.push(_this3._formatModule(report, reportsAvailable, options));
         });

         return output;
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
         return 'json-minimal';
      }

      /**
       * Gets the format type.
       *
       * @returns {string}
       */

   }, {
      key: 'type',
      get: function get() {
         return 'minimal';
      }
   }]);
   return FormatJSONMinimal;
}();

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Defines the default keys to include in a minimal JSON representation of class / class method/ module method /
 * module / project reports.
 * @type {{classReport: string[], methodReport: string[], moduleReport: string[]}}
 * @ignore
 */


exports.default = FormatJSONMinimal;
var s_DEFAULT_KEYS = {
   classReport: ['maintainability', 'errors'],
   methodReport: ['cyclomatic', 'halstead.difficulty', 'errors'],
   moduleReport: ['maintainability', 'errors'],
   projectReport: ['changeCost', 'errors']
};
module.exports = exports['default'];