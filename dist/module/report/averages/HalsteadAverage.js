"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides all the averaged Halstead metric data.
 * @see https://en.wikipedia.org/wiki/Halstead_complexity_measures
 */
var HalsteadAverage =
/**
 * Initializes the default Halstead data.
 */
function HalsteadAverage() {
  (0, _classCallCheck3.default)(this, HalsteadAverage);

  /**
   * Measures an estimate for the number of potential errors.
   * @type {number}
   */
  this.bugs = 0;

  /**
   * Measures the difficulty of the program to write or understand.
   * @type {number}
   */
  this.difficulty = 0;

  /**
   * Measures the maintenance effort of the program.
   * @type {number}
   */
  this.effort = 0;

  /**
   * Defines the number of operands and operators.
   * @type {number}
   */
  this.length = 0;

  /**
   * Measures potential coding time.
   * @type {number}
   */
  this.time = 0;

  /**
   * Defines the unique number of operands and operators.
   * @type {number}
   */
  this.vocabulary = 0;

  /**
   * Measures how much information a reader of the code potential has to absorb to understand its meaning.
   * @type {number}
   */
  this.volume = 0;

  /**
   * In general an operand participates in actions associated with operators. A distinct and total count of
   * identifiers.
   * @type {{distinct: number, total: number}}
   */
  this.operands = { distinct: 0, total: 0 };

  /**
   * In general an operator carries out an action. A distinct and total count of identifiers.
   * @type {{distinct: number, total: number}}
   */
  this.operators = { distinct: 0, total: 0 };
};

exports.default = HalsteadAverage;
module.exports = exports["default"];