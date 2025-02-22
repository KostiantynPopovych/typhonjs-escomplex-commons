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

var _ASTState = require('./ASTState');

var _ASTState2 = _interopRequireDefault(_ASTState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `ASTGenerator` is a fork of `Astring`. The original author is David Bonnet and `Astring` is released under an MIT
 * license. This version is only available by the MPLv2.0 license. Please see the original source.
 * @see  https://github.com/davidbonnet/astring.git
 *
 * Eventually once ASTGenerator is feature complete for Babylon & ESTree AST and further modularized it will be released
 * as a separate NPM module supporting plugins.
 *
 * Please note that not all of the Babylon AST nodes are currently supported. `astParser` is currently only used by
 * `typhonjs-escomplex` for realizing computed method names and associated Halstead operands and operators.
 */
var ASTGenerator = function () {
   function ASTGenerator() {
      (0, _classCallCheck3.default)(this, ASTGenerator);
   }

   (0, _createClass3.default)(ASTGenerator, null, [{
      key: 'parse',

      /**
       * ASTGenerator returns an instance of ParserData containing a string representing the rendered code of the provided
       * AST `node`. In addition Halstead operators and operands are available via ParserData.
       *
       * @param {object|Array<object>} node - An ESTree or Babylon AST node.
       *
       * @param {object}               options - Optional parameters for source code formatting.
       * @property {string}            indent - A string to use for indentation (defaults to `\t`)
       * @property {string}            lineEnd - A string to use for line endings (defaults to `\n`)
       * @property {number}            startingIndentLevel - indent level to start from (default to `0`)
       *
       * @returns {ASTData}
       */
      value: function parse(node, options) {
         var state = new _ASTState2.default(options);

         // Travel through the AST node and generate the code.
         if (Array.isArray(node)) {
            node.forEach(function (entry) {
               state.generator[entry.type](entry, state);
            });
         } else if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object') {
            try {
               state.generator[node.type](node, state);
            } catch (err) {
               console.log('Handling of node type ' + node.type + ' not implemented yet.');
            }
         } else {
            throw new TypeError('parse error: \'node\' is not an \'object\' or an \'array\'.');
         }

         return state.output;
      }

      /**
       * ASTGenerator returns an instance of ParserData containing a string representing the rendered code of the provided
       * AST `nodes`. In addition Halstead operators and operands are available via ParserData.
       *
       * @param {Array<object>}  nodes - An array of ESTree or Babylon AST nodes to parse.
       *
       * @param {object}         options - Optional parameters for source code formatting.
       * @property {string}      indent - A string to use for indentation (defaults to `\t`)
       * @property {string}      lineEnd - A string to use for line endings (defaults to `\n`)
       * @property {number}      startingIndentLevel - indent level to start from (default to `0`)
       *
       * @returns {ASTData}
       */

   }, {
      key: 'parseNodes',
      value: function parseNodes(nodes, options) {
         if (!Array.isArray(nodes)) {
            throw new TypeError('parseNodes error: \'nodes\' is not an \'array\'.');
         }

         var state = new _ASTState2.default(options);

         nodes.forEach(function (node) {
            // Travel through the AST node and generate the code.
            if (Array.isArray(node)) {
               node.forEach(function (entry) {
                  state.generator[entry.type](entry, state);
               });
            } else if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object') {
               try {
                  state.generator[node.type](node, state);
               } catch (err) {
                  console.log('Handling of node type ' + node.type + ' not implemented yet.');
               }
            } else {
               throw new TypeError('parse error: \'node\' is not an \'object\' or an \'array\'.');
            }
         });

         return state.output;
      }
   }]);
   return ASTGenerator;
}();

exports.default = ASTGenerator;
module.exports = exports['default'];