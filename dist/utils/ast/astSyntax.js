'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _ASTUtil = require('./ASTUtil');

var _ASTUtil2 = _interopRequireDefault(_ASTUtil);

var _expressionPrecedence = require('./expressionPrecedence');

var _expressionPrecedence2 = _interopRequireDefault(_expressionPrecedence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable eqeqeq */
var ArrayExpression = void 0,
    BinaryExpression = void 0,
    ForInStatement = void 0,
    FunctionDeclaration = void 0,
    Property = void 0,
    RestElement = void 0;

exports.default = {
   Program: function Program(node, state) {
      var lineEnd = state.lineEnd,
          output = state.output;

      var indent = state.indent.repeat(state.indentLevel);
      var statements = node.body;

      for (var i = 0; i < statements.length; i++) {
         var statement = statements[i];

         output.write(indent);

         this[statement.type](statement, state);

         output.write(lineEnd);
      }
   },
   BlockStatement: function BlockStatement(node, state) {
      var lineEnd = state.lineEnd,
          output = state.output;

      var indent = state.indent.repeat(state.indentLevel++);
      var statementIndent = indent + state.indent;

      output.write('{');

      var statements = node.body;

      if (statements != null && statements.length > 0) {
         output.write(lineEnd);

         for (var i = 0; i < statements.length; i++) {
            var statement = statements[i];

            output.write(statementIndent);

            this[statement.type](statement, state);

            output.write(lineEnd);
         }
         output.write(indent);
      }

      output.write('}');
      state.indentLevel--;
   },
   EmptyStatement: function EmptyStatement(node, state) {
      state.output.write(';');
   },
   ExpressionStatement: function ExpressionStatement(node, state) {
      var output = state.output;

      var precedence = _expressionPrecedence2.default[node.expression.type];

      if (precedence === 17 || precedence === 3 && node.expression.left.type[0] === 'O') {
         // Should always have parentheses or is an AssignmentExpression to an ObjectPattern
         output.write('(');
         this[node.expression.type](node.expression, state);
         output.write(')');
      } else {
         this[node.expression.type](node.expression, state);
      }

      output.write(';');
   },
   IfStatement: function IfStatement(node, state) {
      var output = state.output;


      output.write('if (');
      output.operators.push('if');

      this[node.test.type](node.test, state);

      output.write(') ');

      this[node.consequent.type](node.consequent, state);

      if (node.alternate != null) {
         output.write(' else ');
         output.operators.push('else');

         this[node.alternate.type](node.alternate, state);
      }
   },
   LabeledStatement: function LabeledStatement(node, state) {
      this[node.label.type](node.label, state);
      state.output.write(': ');
      this[node.body.type](node.body, state);
   },
   BreakStatement: function BreakStatement(node, state) {
      var output = state.output;


      output.write('break');
      output.operators.push('break');

      if (node.label) {
         output.write(' ');
         this[node.label.type](node.label, state);
      }
      output.write(';');
   },
   ContinueStatement: function ContinueStatement(node, state) {
      var output = state.output;


      output.write('continue');
      output.operators.push('continue');

      if (node.label) {
         output.write(' ');
         this[node.label.type](node.label, state);
      }

      output.write(';');
   },
   WithStatement: function WithStatement(node, state) {
      var output = state.output;


      output.write('with (');
      output.operators.push('with');

      this[node.object.type](node.object, state);

      output.write(') ');

      this[node.body.type](node.body, state);
   },
   SwitchStatement: function SwitchStatement(node, state) {
      var lineEnd = state.lineEnd,
          output = state.output;

      var indent = state.indent.repeat(state.indentLevel++);

      state.indentLevel++;

      var caseIndent = indent + state.indent;
      var statementIndent = caseIndent + state.indent;

      output.write('switch (');
      output.operators.push('switch');

      this[node.discriminant.type](node.discriminant, state);

      output.write(') {' + lineEnd);

      var occurences = node.cases;
      var occurencesCount = occurences.length;


      for (var i = 0; i < occurencesCount; i++) {
         var occurence = occurences[i];

         if (occurence.test) {
            output.write(caseIndent + 'case ');
            output.operators.push('case');

            this[occurence.test.type](occurence.test, state);

            output.write(':' + lineEnd);
         } else {
            output.write(caseIndent + 'default:' + lineEnd);
            output.operators.push('default');
         }

         var consequent = occurence.consequent;
         var consequentCount = consequent.length;


         for (var j = 0; j < consequentCount; j++) {
            var statement = consequent[j];

            output.write(statementIndent);

            this[statement.type](statement, state);

            output.write(lineEnd);
         }
      }

      state.indentLevel -= 2;

      output.write(indent + '}');
   },
   ReturnStatement: function ReturnStatement(node, state) {
      var output = state.output;


      output.write('return');
      output.operators.push('return');

      if (node.argument) {
         output.write(' ');

         this[node.argument.type](node.argument, state);
      }

      output.write(';');
   },
   ThrowStatement: function ThrowStatement(node, state) {
      var output = state.output;


      output.write('throw ');
      output.operators.push('throw');

      this[node.argument.type](node.argument, state);

      output.write(';');
   },
   TryStatement: function TryStatement(node, state) {
      var output = state.output;


      output.write('try ');
      output.operators.push('try');

      this[node.block.type](node.block, state);

      if (node.handler) {
         var handler = node.handler;


         output.write(' catch (');
         output.operators.push('catch');

         this[handler.param.type](handler.param, state);

         output.write(') ');

         this[handler.body.type](handler.body, state);
      }

      if (node.finalizer) {
         output.write(' finally ');
         output.operators.push('finally');

         this[node.finalizer.type](node.finalizer, state);
      }
   },
   WhileStatement: function WhileStatement(node, state) {
      var output = state.output;


      output.operators.push('while');
      output.write('while (');

      this[node.test.type](node.test, state);

      output.write(') ');

      this[node.body.type](node.body, state);
   },
   DoWhileStatement: function DoWhileStatement(node, state) {
      var output = state.output;


      output.operators.push('dowhile');
      output.write('do ');

      this[node.body.type](node.body, state);

      output.write(' while (');

      this[node.test.type](node.test, state);

      output.write(');');
   },
   ForStatement: function ForStatement(node, state) {
      var output = state.output;


      output.write('for (');
      output.operators.push('for');

      if (node.init != null) {
         state.noTrailingSemicolon = true;

         this[node.init.type](node.init, state);

         state.noTrailingSemicolon = false;
      }

      output.write('; ');

      if (node.test) {
         this[node.test.type](node.test, state);
      }

      output.write('; ');

      if (node.update) {
         this[node.update.type](node.update, state);
      }

      output.write(') ');

      this[node.body.type](node.body, state);
   },


   ForInStatement: ForInStatement = function ForInStatement(node, state) {
      var output = state.output;


      output.write('for (');

      var left = node.left,
          type = left.type;

      state.noTrailingSemicolon = true;

      this[type](left, state);

      state.noTrailingSemicolon = false;

      // Identifying whether node.type is `ForInStatement` or `ForOfStatement`
      output.write(node.type[3] === 'I' ? ' in ' : ' of ');
      output.operators.push(node.type[3] === 'I' ? 'forin' : 'forof');

      this[node.right.type](node.right, state);

      output.write(') ');

      this[node.body.type](node.body, state);
   },

   ForOfStatement: ForInStatement,

   DebuggerStatement: function DebuggerStatement(node, state) {
      state.output.write('debugger;' + state.lineEnd);
   },


   FunctionDeclaration: FunctionDeclaration = function FunctionDeclaration(node, state) {
      var output = state.output;


      output.write(node.generator ? 'function* ' : 'function ');
      output.operators.push(node.generator ? 'function*' : 'function');

      if (node.id) {
         output.write(node.id.name);
         output.operands.push(node.id.name);
      }

      _ASTUtil2.default.formatSequence(node.params, state, this);

      output.write(' ');

      this[node.body.type](node.body, state);
   },

   FunctionExpression: FunctionDeclaration,

   VariableDeclaration: function VariableDeclaration(node, state) {
      var output = state.output;
      var declarations = node.declarations;


      output.write(node.kind + ' ');
      output.operators.push(node.kind);

      var length = declarations.length;


      if (length > 0) {
         this.VariableDeclarator(declarations[0], state);

         for (var i = 1; i < length; i++) {
            output.write(', ');

            this.VariableDeclarator(declarations[i], state);
         }
      }

      if (state.noTrailingSemicolon !== true) {
         output.write(';');
      }
   },
   VariableDeclarator: function VariableDeclarator(node, state) {
      var output = state.output;


      this[node.id.type](node.id, state);

      if (node.init != null) {
         output.write(' = ');
         output.operators.push('=');

         this[node.init.type](node.init, state);
      }
   },
   ClassDeclaration: function ClassDeclaration(node, state) {
      var output = state.output;


      output.write('class ');
      output.operators.push('class');

      if (node.id) {
         output.write(node.id.name + ' ');
      }

      if (node.superClass) {
         output.write('extends ');
         output.operators.push('extends');

         this[node.superClass.type](node.superClass, state);

         output.write(' ');
      }

      this.BlockStatement(node.body, state);
   },
   ImportDeclaration: function ImportDeclaration(node, state) {
      var output = state.output;


      output.write('import ');
      output.operators.push('import');

      var specifiers = node.specifiers;
      var length = specifiers.length;


      if (length > 0) {
         var i = 0,
             specifier = void 0;
         while (i < length) {
            if (i > 0) {
               output.write(', ');
            }

            specifier = specifiers[i];
            var type = specifier.type[6];

            if (type === 'D') {
               output.write(specifier.local.name); // ImportDefaultSpecifier
               i++;
            } else if (type === 'N') {

               output.write('* as ' + specifier.local.name); // ImportNamespaceSpecifier
               i++;
            } else {
               break; // ImportSpecifier
            }
         }

         if (i < length) {
            output.write('{');

            for (;;) {
               specifier = specifiers[i];
               var name = specifier.imported.name;


               output.write(name);

               if (name !== specifier.local.name) {
                  output.write(' as ' + specifier.local.name);
               }

               if (++i < length) {
                  output.write(', ');
               } else {
                  break;
               }
            }

            output.write('}');
         }

         output.write(' from ');
         output.operators.push('from');
      }

      this.Literal(node.source, state);

      output.write(';');
   },
   ExportDefaultDeclaration: function ExportDefaultDeclaration(node, state) {
      var output = state.output;


      output.write('export default ');
      output.operators.push('export');
      output.operators.push('default');

      this[node.declaration.type](node.declaration, state);

      // All expression nodes except `FunctionExpression`
      if (_expressionPrecedence2.default[node.declaration.type] && node.declaration.type[0] !== 'F') {
         output.write(';');
      }
   },
   ExportNamedDeclaration: function ExportNamedDeclaration(node, state) {
      var output = state.output;


      output.write('export ');
      output.operators.push('export');

      if (node.declaration) {
         this[node.declaration.type](node.declaration, state);
      } else {
         output.write('{');
         output.operators.push('{}');

         var specifiers = node.specifiers,
             length = specifiers.length;

         if (length > 0) {
            for (var i = 0;;) {
               var specifier = specifiers[i];
               var name = specifier.local.name;


               output.write(name);

               if (name !== specifier.exported.name) {
                  output.write(' as ' + specifier.exported.name);
               }

               if (++i < length) {
                  output.write(', ');
               } else {
                  break;
               }
            }
         }

         output.write('}');

         if (node.source) {
            output.write(' from ');

            this.Literal(node.source, state);
         }

         output.write(';');
      }
   },
   ExportAllDeclaration: function ExportAllDeclaration(node, state) {
      var output = state.output;


      output.write('export * from ');
      output.operators.push('export');
      output.operators.push('*');

      this.Literal(node.source, state);

      output.write(';');
   },
   MethodDefinition: function MethodDefinition(node, state) {
      var output = state.output;


      if (node.static) {
         output.write('static ');
         output.operators.push('static');
      }

      switch (node.kind[0]) {
         case 'g': // `get`
         case 's':
            // `set`
            output.write(node.kind + ' ');
            output.operators.push(node.kind);
            break;
      }

      if (node.value.generator) {
         output.write('*');
      }

      if (node.computed) {
         output.write('[');

         this[node.key.type](node.key, state);

         output.write(']');
      } else {
         this[node.key.type](node.key, state);
      }

      _ASTUtil2.default.formatSequence(node.value.params, state, this);

      output.write(' ');

      this[node.value.body.type](node.value.body, state);
   },
   ClassExpression: function ClassExpression(node, state) {
      this.ClassDeclaration(node, state);
   },
   ArrowFunctionExpression: function ArrowFunctionExpression(node, state) {
      var output = state.output;
      var params = node.params;


      if (params != null) {
         // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is
         // `Identifier`
         if (params.length === 1 && params[0].type[0] === 'I') {
            output.write(params[0].name);
         } else {
            _ASTUtil2.default.formatSequence(node.params, state, this);
         }
      }

      output.write(' => ');
      output.operators.push('function=>');

      if (node.body.type[0] === 'O') {
         output.write('(');

         this.ObjectExpression(node.body, state);

         output.write(')');
      } else {
         this[node.body.type](node.body, state);
      }
   },
   ThisExpression: function ThisExpression(node, state) {
      state.output.write('this');
      state.output.operators.push('this');
   },
   Super: function Super(node, state) {
      state.output.write('super');
      state.output.operators.push('super');
   },


   RestElement: RestElement = function RestElement(node, state) {
      state.output.write('...');
      state.output.operators.push('... (rest)');

      this[node.argument.type](node.argument, state);
   },

   SpreadElement: function SpreadElement(node, state) {
      state.output.write('...');
      state.output.operators.push('... (spread)');

      this[node.argument.type](node.argument, state);
   },
   YieldExpression: function YieldExpression(node, state) {
      var output = state.output;


      output.write(node.delegate ? 'yield*' : 'yield');
      output.operators.push(node.delegate ? 'yield*' : 'yield');

      if (node.argument) {
         output.write(' ');

         this[node.argument.type](node.argument, state);
      }
   },
   TemplateLiteral: function TemplateLiteral(node, state) {
      var output = state.output;
      var quasis = node.quasis,
          expressions = node.expressions;
      var length = expressions.length;


      output.write('`');

      for (var i = 0; i < length; i++) {
         var expression = expressions[i];

         output.write(quasis[i].value.raw);
         output.write('${');

         this[expression.type](expression, state);

         output.write('}');
      }

      output.write(quasis[quasis.length - 1].value.raw);
      output.write('`');
   },
   TaggedTemplateExpression: function TaggedTemplateExpression(node, state) {
      this[node.tag.type](node.tag, state);
      this[node.quasi.type](node.quasi, state);
   },


   ArrayExpression: ArrayExpression = function ArrayExpression(node, state) {
      var output = state.output;


      output.operators.push('[]');
      output.write('[');

      if (node.elements.length > 0) {
         var elements = node.elements,
             length = elements.length;

         for (var i = 0;;) {
            var element = elements[i];

            if (element != null) {
               this[element.type](element, state);
            }

            if (++i < length) {
               output.write(', ');
               output.operators.push(',');
            } else {
               if (element == null) {
                  output.write(', ');
                  output.operators.push(',');
               }
               break;
            }
         }
      }

      output.write(']');
   },

   ArrayPattern: ArrayExpression,

   ObjectExpression: function ObjectExpression(node, state) {
      var lineEnd = state.lineEnd,
          output = state.output;

      var indent = state.indent.repeat(state.indentLevel++);
      var propertyIndent = indent + state.indent;

      output.operators.push('{}');
      output.write('{');

      if (node.properties.length > 0) {
         output.write(lineEnd);

         var comma = ',' + lineEnd,
             properties = node.properties,
             length = properties.length;

         for (var i = 0;;) {
            var property = properties[i];

            output.write(propertyIndent);

            this.Property(property, state);

            if (++i < length) {
               output.write(comma);
            } else {
               break;
            }
         }

         output.write(lineEnd);
         output.write(indent + '}');
      } else {
         output.write('}');
      }

      state.indentLevel--;
   },


   Property: Property = function Property(node, state) {
      if (node.method || node.kind && node.kind[0] !== 'i') {
         this.MethodDefinition(node, state); // Either a method or of kind `set` or `get` (not `init`)
      } else {
         var output = state.output;


         if (!node.shorthand) {
            if (node.computed) {
               output.operators.push('[]');
               output.write('[');

               this[node.key.type](node.key, state);

               output.write(']');
            } else {
               this[node.key.type](node.key, state);
            }

            output.operators.push(':');
            output.write(': ');
         }

         this[node.value.type](node.value, state);
      }
   },

   ObjectPattern: function ObjectPattern(node, state) {
      var output = state.output;


      output.operators.push('{}');
      output.write('{');

      if (node.properties.length > 0) {
         var properties = node.properties,
             length = properties.length;

         for (var i = 0;;) {
            this[properties[i].type](properties[i], state);

            if (++i < length) {
               output.write(', ');
            } else {
               break;
            }
         }
      }
      output.write('}');
   },
   SequenceExpression: function SequenceExpression(node, state) {
      _ASTUtil2.default.formatSequence(node.expressions, state, this);
   },
   UnaryExpression: function UnaryExpression(node, state) {
      var output = state.output;


      output.operators.push(node.operator + ' (' + (node.prefix ? 'pre' : 'post') + 'fix)');

      if (node.prefix) {
         output.write(node.operator);

         if (node.operator.length > 1) {
            output.write(' ');
         }

         if (_expressionPrecedence2.default[node.argument.type] < _expressionPrecedence2.default.UnaryExpression) {
            output.write('(');

            this[node.argument.type](node.argument, state);

            output.write(')');
         } else {
            this[node.argument.type](node.argument, state);
         }
      } else {
         // FIXME: This case never occurs
         this[node.argument.type](node.argument, state);

         state.output.write(node.operator);
      }
   },
   UpdateExpression: function UpdateExpression(node, state) {
      // Always applied to identifiers or members, no parenthesis check needed
      state.output.operators.push(node.operator + ' (' + (node.prefix ? 'pre' : 'post') + 'fix)');

      if (node.prefix) {
         state.output.write(node.operator);

         this[node.argument.type](node.argument, state);
      } else {
         this[node.argument.type](node.argument, state);

         state.output.write(node.operator);
      }
   },
   AssignmentExpression: function AssignmentExpression(node, state) {
      this[node.left.type](node.left, state);

      state.output.write(' ' + node.operator + ' ');

      this[node.right.type](node.right, state);

      state.output.operators.push(node.operator);
   },
   AssignmentPattern: function AssignmentPattern(node, state) {
      this[node.left.type](node.left, state);

      state.output.write(' = ');

      this[node.right.type](node.right, state);

      state.output.operators.push('=');
   },


   BinaryExpression: BinaryExpression = function BinaryExpression(node, state) {
      var output = state.output;


      output.operators.push(node.operator);

      if (node.operator === 'in') {
         // Avoids confusion in `for` loops initializers
         output.write('(');

         _ASTUtil2.default.formatBinaryExpressionPart(node.left, node, false, state, this);

         output.write(' ' + node.operator + ' ');

         _ASTUtil2.default.formatBinaryExpressionPart(node.right, node, true, state, this);

         output.write(')');
      } else {
         _ASTUtil2.default.formatBinaryExpressionPart(node.left, node, false, state, this);

         output.write(' ' + node.operator + ' ');

         _ASTUtil2.default.formatBinaryExpressionPart(node.right, node, true, state, this);
      }
   },

   LogicalExpression: BinaryExpression,

   ConditionalExpression: function ConditionalExpression(node, state) {
      var output = state.output;


      if (_expressionPrecedence2.default[node.test.type] > _expressionPrecedence2.default.ConditionalExpression) {
         this[node.test.type](node.test, state);
      } else {
         output.operators.push('()');
         output.write('(');

         this[node.test.type](node.test, state);

         output.write(')');
      }

      output.write(' ? ');

      this[node.consequent.type](node.consequent, state);

      output.write(' : ');

      this[node.alternate.type](node.alternate, state);

      output.operators.push(':?');
   },
   NewExpression: function NewExpression(node, state) {
      var output = state.output;


      output.write('new ');
      output.operators.push('new');

      if (_expressionPrecedence2.default[node.callee.type] < _expressionPrecedence2.default.CallExpression || _ASTUtil2.default.hasCallExpression(node.callee)) {
         output.write('(');

         this[node.callee.type](node.callee, state);

         output.write(')');

         output.operators.push('()');
      } else {
         this[node.callee.type](node.callee, state);
      }

      _ASTUtil2.default.formatSequence(node['arguments'], state, this);
   },
   CallExpression: function CallExpression(node, state) {
      var output = state.output;


      if (_expressionPrecedence2.default[node.callee.type] < _expressionPrecedence2.default.CallExpression) {
         output.write('(');

         this[node.callee.type](node.callee, state);

         output.write(')');
         output.operators.push('()');
      } else {
         this[node.callee.type](node.callee, state);
      }

      _ASTUtil2.default.formatSequence(node['arguments'], state, this);
   },
   MemberExpression: function MemberExpression(node, state) {
      var output = state.output;


      if (_expressionPrecedence2.default[node.object.type] < _expressionPrecedence2.default.MemberExpression) {
         output.write('(');

         this[node.object.type](node.object, state);

         output.write(')');
         output.operators.push('()');
      } else {
         this[node.object.type](node.object, state);
      }

      if (node.computed) {
         output.write('[');

         this[node.property.type](node.property, state);

         output.write(']');

         output.operators.push('[]');
      } else {
         output.write('.');
         output.operators.push('.');

         this[node.property.type](node.property, state);
      }
   },
   MetaProperty: function MetaProperty(node, state) {
      state.output.write(node.meta.name + '.' + node.property.name);

      state.output.operators.push('.');
      state.output.operands.push(node.meta.name);
      state.output.operands.push(node.property.name);
   },
   Identifier: function Identifier(node, state) {
      state.output.write(node.name);
      state.output.operands.push(node.name);
   },
   Literal: function Literal(node, state) {
      if (node.raw != null) {
         state.output.write(node.raw);
         state.output.operands.push(node.raw);
      } else if (node.regex != null) {
         this.RegExpLiteral(node, state);
      } else {
         state.output.write((0, _stringify2.default)(node.value));
      }
   },
   RegExpLiteral: function RegExpLiteral(node, state) {
      var regex = node.regex;


      state.output.write('new RegExp(' + (0, _stringify2.default)(regex.pattern) + ', ' + (0, _stringify2.default)(regex.flags) + ')');
   },


   // Babylon AST nodes ---------------------------------------------------------------------------------------------

   ObjectProperty: Property,

   RestProperty: RestElement,

   BooleanLiteral: function BooleanLiteral(node, state) {
      state.output.write(node.value);
      state.output.operands.push((0, _stringify2.default)(node.value));
   },
   DirectiveLiteral: function DirectiveLiteral(node, state) {
      state.output.write(node.value);
      state.output.operands.push((0, _stringify2.default)(node.value));
   },
   NullLiteral: function NullLiteral(node, state) {
      state.output.write('null');
      state.output.operands.push('null');
   },
   NumericLiteral: function NumericLiteral(node, state) {
      state.output.write(node.value);
      state.output.operands.push((0, _stringify2.default)(node.value));
   },
   StringLiteral: function StringLiteral(node, state) {
      if (node.extra != null && node.extra.raw != null) {
         state.output.write(node.extra.raw);
         state.output.operands.push(node.extra.raw);
      } else {
         state.output.write((0, _stringify2.default)(node.value));
         state.output.operands.push((0, _stringify2.default)(node.value));
      }
   }
};
module.exports = exports['default'];