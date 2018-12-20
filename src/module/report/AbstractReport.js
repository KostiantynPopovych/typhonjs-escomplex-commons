import TransformFormat  from '../../transform/TransformFormat';

/**
 * Provides several helper methods to work with method oriented data stored as `this.aggregate` in `ClassReport` /
 * `ModuleReport` and directly in `ClassMethodReport` / `ModuleMethodReport`.
 */
export default class AbstractReport
{
   /**
    * If given assigns the method report to an internal variable. This is used by `ClassReport` and `ModuleReport`
    * which stores a `AggregateMethodReport` respectively in `this.aggregate`.
    *
    * @param {AggregateMethodReport}   aggregateMethodReport - An AggregateMethodReport to associate with this report.
    */
   constructor(aggregateMethodReport = void 0)
   {
      /**
       * Stores any associated `AggregateMethodReport`.
       * @type {AggregateMethodReport}
       */
      this.aggregate = aggregateMethodReport;
   }

   /**
    * Returns the associated `AggregateMethodReport` or `this`. Both ClassReport and ModuleReport have an
    * `methodAggregate` AggregateMethodReport.
    *
    * @returns {AggregateMethodReport}
    */
   get aggregateReport() { return typeof this.aggregate !== 'undefined' ? this.aggregate : this; }

   /**
    * Formats this report given the type.
    *
    * @param {string}   name - The name of formatter to use.
    *
    * @param {object}   options - (Optional) One or more optional parameters to pass to the formatter.
    *
    * @returns {string}
    */
   toFormat(name, options = void 0)
   {
      return TransformFormat.format(this, name, options);
   }
}
