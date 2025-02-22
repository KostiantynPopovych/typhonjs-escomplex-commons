'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['', ''], ['', '']);

var _ObjectUtil = require('../../../utils/ObjectUtil');

var _ObjectUtil2 = _interopRequireDefault(_ObjectUtil);

var _ReportType = require('../../../types/ReportType');

var _ReportType2 = _interopRequireDefault(_ReportType);

var _StringUtil = require('../../../utils/StringUtil');

var _StringUtil2 = _interopRequireDefault(_StringUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides the base text format transform for ModuleReport / ProjectReport instances.
 */
var AbstractFormatText = function () {
   /**
    * Initializes instance storing default headers / keys.
    *
    * @param {object}   headers - An object hash of header entries formatted for `StringUtil.safeStringsObject`.
    *
    * @param {object}   keys - An object hash of key entries formatted for `StringUtil.safeStringsObject`.
    */
   function AbstractFormatText() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      (0, _classCallCheck3.default)(this, AbstractFormatText);

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


   (0, _createClass3.default)(AbstractFormatText, [{
      key: 'formatReport',
      value: function formatReport(report) {
         var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

         var localOptions = (0, _assign2.default)({}, this._keys, options);

         var output = void 0;

         switch (report.type) {
            case _ReportType2.default.CLASS:
               output = this._formatClass(report, localOptions).replace(/^[\n]/, '');
               break;

            case _ReportType2.default.CLASS_METHOD:
               output = this._formatMethod(report, localOptions, '', false).replace(/^[\n]/, '');
               break;

            case _ReportType2.default.MODULE_METHOD:
               output = this._formatMethod(report, localOptions).replace(/^[\n]/, '');
               break;

            case _ReportType2.default.MODULE:
               output = this._formatModule(report, localOptions);
               break;

            case _ReportType2.default.NESTED_METHOD:
               output = this._formatMethod(report, localOptions, '', false).replace(/^[\n]/, '');
               break;

            case _ReportType2.default.PROJECT:
               output = this._formatProject(report, localOptions);
               break;

            default:
               console.warn('formatReport \'' + this.name + '\' warning: unsupported report type \'' + report.type + '\'.');
               return '';
         }

         return output;
      }

      /**
       * Formats a class report.
       *
       * @param {ClassReport} classReport - A class report.
       *
       * @param {object}      options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}   classReport - An entry key found in the class report to output.
       * @property {string}   methodReport - An entry key found in the method report to output.
       *
       * @param {string}      prepend - (Optional) A string to prepend; default: `''`.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatClass',
      value: function _formatClass(classReport, options) {
         var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

         if (!Array.isArray(this._headers.classReport)) {
            return '';
         }

         var indent = typeof options.indent === 'boolean' && !options.indent ? '' : '   ';
         var indent2 = typeof options.indent === 'boolean' && !options.indent ? '' : '      ';

         // Must concatenate class methods so that the initial prepend isn't displayed twice.
         return '' + _StringUtil2.default.safeStringsPrependObject.apply(_StringUtil2.default, [prepend, classReport].concat((0, _toConsumableArray3.default)(this._headers.classReport), (0, _toConsumableArray3.default)(this._formatEntries(classReport, options.classReport, indent)))) + this._formatMethods(classReport.methods, options, indent2, false);
      }

      /**
       * Formats a module reports methods array.
       *
       * @param {Array<ClassReport>}   classReports - An array of ClassReport instances to format.
       *
       * @param {object}               options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}            classReport - An entry key found in the class report to output.
       * @property {string}            methodReport - An entry key found in the method report to output.
       *
       * @param {string}               prepend - (Optional) A string to prepend; default: `''`.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatClasses',
      value: function _formatClasses(classReports, options) {
         var _this = this;

         var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

         if (!Array.isArray(classReports)) {
            return '';
         }

         return classReports.reduce(function (formatted, classReport) {
            return '' + formatted + _this._formatClass(classReport, options, prepend);
         }, '');
      }

      /**
       * Formats entries for a given report based on an array of accessor entries.
       *
       * @param {object}         report - A class / method report.
       *
       * @param {Array<string>|Array<string|StringUtil.SafeEntry>}  entries - (Optional) One or more optional entries to
       *                                                                      format.
       *
       * @param {string}         prepend - (Optional) A string to prepend; default: `''`.
       *
       * @param {string}         parentPrepend - (Optional) The parent prepend string used for entries that are arrays with
       *                                         more than one entry; default: `''`.
       *
       * @returns {string|Array<string>}
       * @private
       */

   }, {
      key: '_formatEntries',
      value: function _formatEntries(report, entries) {
         var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
         var parentPrepend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

         if (!Array.isArray(entries)) {
            return '';
         }

         var entryPrepend = typeof this._headers.entryPrepend === 'string' ? this._headers.entryPrepend : '';

         var entryTag = typeof this._headers.entryTemplateTag === 'function' ? this._headers.entryTemplateTag : void 0;

         var output = [];

         // Admittedly the following block is a bit obtuse.
         entries.forEach(function (entry) {
            // Obtain the accessor field for SafeEntry or accept the bare entry.
            var accessor = entry instanceof _StringUtil2.default.SafeEntry ? entry.accessor : entry;

            // Use the accessor to access to value in the report. If accessor is not a string `undefined` is returned.
            var value = _ObjectUtil2.default.safeAccess(report, accessor);

            // Early out if the value is not retrieved.
            if (typeof value === 'undefined') {
               return;
            }

            // Convert all values to an array.
            value = Array.isArray(value) ? value : [value];

            var result = '';

            // Skip any arrays that have no entries.
            if (value.length > 0) {
               // Provides a temporary object to store each array entry via the given accessor.
               var temp = {};

               value.forEach(function (valueEntry, index) {
                  // An array with more than one entry must add the parent prepend string to maintain alignment.
                  if (index > 0) {
                     result += parentPrepend;
                  }

                  // The abbreviated / minimal transform formats will only contain strings defining the accessor lookup
                  // so this accessor key is used as the description.
                  if (typeof entry === 'string') {
                     result += '' + prepend + entryPrepend + entry + ': ' + valueEntry + '\n';
                  } else {
                     // Store the entry via the given accessor which is then dereferenced by `safeStringsPrependObject`.
                     _ObjectUtil2.default.safeSet(temp, accessor, valueEntry);

                     result += _StringUtil2.default.safeStringsPrependObject('' + prepend + entryPrepend, temp, entry);
                  }
               });
            }

            // Apply entry template tag if it is defined.
            result = entryTag ? entryTag(_templateObject, result) : result;

            if (result !== '') {
               output.push(result);
            }
         });

         return output;
      }

      /**
       * Formats a method report.
       *
       * @param {MethodReport}   methodReport - A method report.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      methodReport - An entry key found in the method report to output.
       *
       * @param {string}         prepend - (Optional) A string to prepend; default: `''`.
       *
       * @param {boolean}        isModule - (Optional) Indicates module scope; default: `true`.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatMethod',
      value: function _formatMethod(methodReport, options) {
         var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
         var isModule = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

         // Skip processing if there are no headers.
         if (!Array.isArray(this._headers.classMethod) || !Array.isArray(this._headers.moduleMethod)) {
            return '';
         }

         var indent = typeof options.indent === 'boolean' && !options.indent ? '' : '   ';

         return _StringUtil2.default.safeStringsPrependObject.apply(_StringUtil2.default, [prepend, methodReport].concat((0, _toConsumableArray3.default)(isModule ? this._headers.moduleMethod : this._headers.classMethod), (0, _toConsumableArray3.default)(this._formatEntries(methodReport, options.methodReport, indent, prepend))));
      }

      /**
       * Formats a module reports methods array.
       *
       * @param {Array<ClassMethodReport|ClassMethodReport>}  methodReports - An array of method report instances to
       *                                                                      format.
       *
       * @param {object}               options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}            methodReport - An entry key found in the method report to output.
       *
       * @param {string}               prepend - (Optional) A string to prepend; default: `''`.
       *
       * @param {boolean}              isModule - (Optional) Indicates module scope; default: `true`.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatMethods',
      value: function _formatMethods(methodReports, options) {
         var _this2 = this;

         var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
         var isModule = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

         if (!Array.isArray(methodReports)) {
            return '';
         }

         return methodReports.reduce(function (formatted, methodReport) {
            return '' + formatted + _this2._formatMethod(methodReport, options, prepend, isModule);
         }, '');
      }

      /**
       * Formats a module report as plain text.
       *
       * @param {ModuleReport}   report - A module report.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      classReport - An entry key found in the class report to output.
       * @property {string}      methodReport - An entry key found in the method report to output.
       * @property {string}      moduleReport - An entry key found in the module report to output.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatModule',
      value: function _formatModule(report, options) {
         var output = '';

         // Add / remove a temporary entries for the current module index.
         try {
            report.___modulecntr___ = 0;
            report.___modulecntrplus1___ = 1;

            output = this._formatModuleReport(report, true, options);
         } finally {
            delete report.___modulecntr___;
            delete report.___modulecntrplus1___;
         }

         // For reports remove any existing new line at the beginning.
         return output.replace(/^[\n]/, '');
      }

      /**
       * Formats a module report.
       *
       * @param {ModuleReport}   moduleReport - A module report.
       *
       * @param {boolean}        reportsAvailable - Indicates that the report metric data is available.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      classReport - Entry keys found in the class report to output.
       * @property {string}      methodReport - Entry keys found in the method report to output.
       * @property {string}      moduleReport - Entry keys found in the module report to output.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatModuleReport',
      value: function _formatModuleReport(moduleReport, reportsAvailable, options) {
         // Skip processing if there are no headers.
         if (!Array.isArray(this._headers.moduleReport)) {
            return '';
         }

         var indent = typeof options.indent === 'boolean' && !options.indent ? '' : '   ';

         if (reportsAvailable) {
            return _StringUtil2.default.safeStringsObject.apply(_StringUtil2.default, [moduleReport].concat((0, _toConsumableArray3.default)(this._headers.moduleReport), (0, _toConsumableArray3.default)(this._formatEntries(moduleReport, options.moduleReport, indent)), [this._formatMethods(moduleReport.methods, options, indent, true), this._formatClasses(moduleReport.classes, options, indent)]));
         } else {
            return _StringUtil2.default.safeStringsObject.apply(_StringUtil2.default, [moduleReport].concat((0, _toConsumableArray3.default)(this._headers.moduleReport)));
         }
      }

      /**
       * Formats a project report as plain text.
       *
       * @param {ProjectReport}  projectReport - A project report.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      classReport - An entry key found in the class report to output.
       * @property {string}      methodReport - An entry key found in the method report to output.
       * @property {string}      moduleReport - An entry key found in the module report to output.
       *
       * @returns {string}
       * @protected
       */

   }, {
      key: '_formatProject',
      value: function _formatProject(projectReport, options) {
         var _this3 = this;

         var reportsAvailable = projectReport.getSetting('serializeModules', false);

         return projectReport.modules.reduce(function (formatted, moduleReport, index) {
            var current = '';

            // Add / remove a temporary entries for the current module index.
            try {
               moduleReport.___modulecntr___ = index;
               moduleReport.___modulecntrplus1___ = index + 1;

               current = '' + formatted + _this3._formatModuleReport(moduleReport, reportsAvailable, options);
            } finally {
               delete moduleReport.___modulecntr___;
               delete moduleReport.___modulecntrplus1___;
            }

            return current;
         }, '' + this._formatProjectReport(projectReport, options));
      }

      /**
       * Formats a project report.
       *
       * @param {ProjectReport}  projectReport - A project report.
       *
       * @param {object}         options - (Optional) One or more optional parameters passed to the formatter.
       * @property {string}      projectReport - Entry keys found in the ProjectReport to output.
       *
       * @returns {string}
       * @private
       */

   }, {
      key: '_formatProjectReport',
      value: function _formatProjectReport(projectReport, options) {
         // Skip processing if there are no headers.
         if (!Array.isArray(this._headers.projectReport)) {
            return '';
         }

         var indent = typeof options.indent === 'boolean' && !options.indent ? '' : '   ';

         return _StringUtil2.default.safeStringsObject.apply(_StringUtil2.default, [projectReport].concat((0, _toConsumableArray3.default)(this._headers.projectReport), (0, _toConsumableArray3.default)(this._formatEntries(projectReport, options.projectReport, indent))));
      }
   }]);
   return AbstractFormatText;
}();

exports.default = AbstractFormatText;
module.exports = exports['default'];