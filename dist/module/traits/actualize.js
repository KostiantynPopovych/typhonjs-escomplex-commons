'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var lloc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var cyclomatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var operators = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : void 0;
  var operands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : void 0;
  var ignoreKeys = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : void 0;
  var newScope = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : void 0;
  var dependencies = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : void 0;

  // Do not wrap ignoreKeys in an array if it is `null` or a `function`. For functions this allows Trait evaluation
  // via `Trait->valueOf` to return `null` and not `null` wrapped in an `array`.
  var ignoreKeysPassthru = ignoreKeys === null || typeof ignoreKeys === 'function';

  return {
    lloc: new _Trait2.default('lloc', lloc),
    cyclomatic: new _Trait2.default('cyclomatic', cyclomatic),
    operators: new _HalsteadArray2.default('operators', _TraitUtil2.default.safeArray(operators)),
    operands: new _HalsteadArray2.default('operands', _TraitUtil2.default.safeArray(operands)),
    ignoreKeys: new _Trait2.default('ignoreKeys', ignoreKeysPassthru ? ignoreKeys : _TraitUtil2.default.safeArray(ignoreKeys)),
    newScope: new _Trait2.default('newScope', newScope),
    dependencies: new _Trait2.default('dependencies', dependencies)
  };
};

var _HalsteadArray = require('./HalsteadArray');

var _HalsteadArray2 = _interopRequireDefault(_HalsteadArray);

var _Trait = require('./Trait');

var _Trait2 = _interopRequireDefault(_Trait);

var _TraitUtil = require('./TraitUtil');

var _TraitUtil2 = _interopRequireDefault(_TraitUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];

/**
 * Provides a helper method to format core traits for escomplex processing.
 *
 * @param {function|number}         lloc - Logical lines of code
 * @param {function|number}         cyclomatic - The number of linearly independent paths through source code.
 * @param {function|string|Array}   operators - An operator carries out an action.
 * @param {function|string|Array}   operands - An operand participates in such an action (operator).
 * @param {function|string|Array}   ignoreKeys - Provides a list of AST node children keys to skip traversal.
 * @param {function|object}         newScope - Creates a new `class` or `method` scope for report generation.
 * @param {function|object|Array}   dependencies - An import / require dependency.
 *
 * @returns {{lloc: Trait, cyclomatic: Trait, operators: HalsteadArray, operands: HalsteadArray, ignoreKeys: Trait, newScope: Trait, dependencies: Trait}}
 */