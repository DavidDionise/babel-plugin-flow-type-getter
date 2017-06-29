const babylon = require('babylon');
const t = require('babel-types');
const fs = require('fs');
const { resolve } = require('path');
const acorn = require('acorn');
const { generate } = require('astring');

let class_names_list = [];
const customFunctionName = '__getFlowTypes';
const COMMENT_CONSTANT = '_____babel-plugin-flow-type-getter-marker-comment____'

const typeValueGenerator = (typeAnnotation) => {
  const { type, types, properties } = typeAnnotation;

  switch(type) {
    case 'NullableTypeAnnotation':
      return typeValueGenerator(typeAnnotation.typeAnnotation);
    case 'GenericTypeAnnotation':
      const { name } = typeAnnotation.id;
      if(name == 'Array') {
        const type_value = typeValueGenerator(typeAnnotation.typeParameters.params[0]);
        return {
          stringified : `Array<${type_value.stringified}>`,
          is_array : true,
          types : type_value.types
        };
      }
      else {
        return {
          stringified : name,
          is_array : false,
          types : [name]
        };
      }
    case 'UnionTypeAnnotation':
      const union_types_list = types.map(typeValueGenerator).map(val => val.stringified);
      return {
        stringified : union_types_list.join(' | '),
        is_array : false,
        types : union_types_list
      };

    default:
      const default_parsed_type = type.substr(0, type.indexOf('TypeAnnotation')).toLowerCase();
      return {
        stringified : default_parsed_type,
        is_array : false,
        types : [default_parsed_type]
      };
  }
}

const getTypesBodyGenerator = (class_types) => {
  return (
    t.blockStatement([
      t.returnStatement(
        t.objectExpression(
          Object.keys(class_types).map(key => {
            const { stringified, is_array, types } = class_types[key];
            return (
              t.objectProperty(
                t.identifier(key),
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('stringified'),
                    t.stringLiteral(stringified)
                  ),
                  t.objectProperty(
                    t.identifier('is_array'),
                    t.booleanLiteral(is_array)
                  ),
                  t.objectProperty(
                    t.identifier('types'),
                    t.arrayExpression(class_types[key].types.map(ct => t.stringLiteral(ct)))
                  )
                ])
              )
            )
          })
        )
      )
    ])
  )
}

const repeatedNode = (path) => {
  const parent = path.findParent(path => path.isReturnStatement());

  if(
    (parent != null) &&
    (Array.isArray(parent.node.leadingComments)) &&
    (parent.node.leadingComments[0].value == COMMENT_CONSTANT)
  ) {
    return true;
  }
  else {
    return false;
  }
}

const unaryExpressionGenerator = (expression) => {
  return `${expression} != null ? ${expression}.stringified : 'undefined'`;
}

const binaryExpressionGenerator = (expression, right_value) => {
  return `${expression} != null ? ${expression}.types.find(__type => __type == '${right_value}') != null : false`;
}

const arrayExpressionGenerator = (expression) => {
  return `${expression} != null ? ${expression}.is_array : false`;
}

const replacementGenerator = (path, replacement_case) => {
  const { node } = path;
  let expression, object_string, prop_name, code_expression;
  switch(replacement_case) {
    case 'unary':
      object_string = objectStringGenerator(node.argument.object);
      prop_name = node.argument.property.name;
      if(node.argument.computed) {
        if(t.isStringLiteral(node.argument.property)) {
          expression = unaryExpressionGenerator(`${object_string}.${customFunctionName}()['${node.argument.property.value}']`);
        }
        else {
          expression = unaryExpressionGenerator(`${object_string}.${customFunctionName}()[${prop_name}]`);
        }
      }
      else {
        expression = unaryExpressionGenerator(`${object_string}.${customFunctionName}().${prop_name}`);
      }
      code_expression = `typeof ${object_string}.${prop_name}`;
      break;
    case 'binary':
      const { left, right } = node;
      object_string = objectStringGenerator(left.argument.object);
      prop_name = left.argument.property.name;
      const right_value = right.value;
      if(/^Array<.*>$/.test(right_value)) {
        throw new Error(`Use 'Array.isArray' to check if the value is an array.`)
      }
      if(left.argument.computed) {
        if(t.isStringLiteral(left.argument.property)) {
          expression = binaryExpressionGenerator(`${object_string}.${customFunctionName}()['${left.argument.property.value}']`);
        }
        else {
          expression = binaryExpressionGenerator(`${object_string}.${customFunctionName}()[${prop_name}]`);
        }
      }
      else {
        expression = binaryExpressionGenerator(`${object_string}.${customFunctionName}().${prop_name}`);
      }
      code_expression = `typeof ${object_string}.${prop_name} == '${right_value}'`;
      break;
    case 'array':
      const argument = node.arguments[0];
      object_string = objectStringGenerator(argument.object);
      prop_name = argument.property.name;
      if(argument.computed) {
        if(t.isStringLiteral(argument.property)) {
          expression = arrayExpressionGenerator(`${object_string}.${customFunctionName}()['${argument.property.value}']`);
        }
        else {
          expression = arrayExpressionGenerator(`${object_string}.${customFunctionName}()[${prop_name}]`);
        }
      }
      else {
        expression = arrayExpressionGenerator(`${object_string}.${customFunctionName}().${prop_name}`);
      }
      code_expression = `Array.isArray(${object_string}.${prop_name})`;
      break;
    default:
      throw new Error(
        `Invalid argument passed in babel-plugin-flow-type-getter.
        Please report this issue at https://github.com/DavidDionise/babel-plugin-flow-type-getter/issues`
      );
      return;
  }

  return (
    babylon.parse(
      `(() => {
        if(${object_string}.__getFlowTypes != null) {
          return ${expression};
        }
        else {
          //${COMMENT_CONSTANT}
          return ${code_expression}
        }
      })()`
    ).program.body[0]
  )
}

const objectStringGenerator = (node) => {
  if(t.isMemberExpression(node)) {
  	if(node.computed) {
      if(t.isStringLiteral(node.property)) {
        return `${objectStringGenerator(node.object)}['${node.property.value}']`;
      }
      else {
        return `${objectStringGenerator(node.object)}[${node.property.name}]`;
      }
  	}
  	else {
  		return `${objectStringGenerator(node.object)}.${node.property.name}`;
  	}
  }
  else if(t.isIdentifier(node)) {
    return node.name;
  }
}

module.exports = ({ types : t }) => {
  return {
    visitor: {
      ClassDeclaration(path) {
        const { name } = path.node.id;
        const { body } = path.node.body;
        const found_types = body.filter(e => e.typeAnnotation != null);

        class_names_list.push(name);
        if(found_types.length != 0) {
          let class_types = {};

          found_types.forEach(body_element => {
            const { typeAnnotation } = body_element.typeAnnotation;
            const { name } = body_element.key;
            class_types[name] = typeValueGenerator(typeAnnotation);
          })

          const params = [];
          const getTypes_body = getTypesBodyGenerator(class_types);
          const new_node = t.classMethod(
            'method',
            t.identifier(customFunctionName),
            params,
            getTypes_body
          );
          new_node.static = true;
          path.node.body.body = [...path.node.body.body, new_node];
        }
      },

      UnaryExpression(path) {
        const { operator, argument } = path.node;

        if(
          !repeatedNode(path) &&
          !t.isBinaryExpression(path.parent, { operator : 'typeof' }) &&
          t.isMemberExpression(argument)
        ) {
          path.replaceWith(
            replacementGenerator(path, 'unary')
          )
        }
      },

      BinaryExpression(path) {
        const { left, right, operator } = path.node;
        if(
          !repeatedNode(path) &&
          t.isUnaryExpression(left, {operator : 'typeof'}) &&
          t.isMemberExpression(left.argument) &&
          right &&
          right.value
        ) {
          path.replaceWith(
            replacementGenerator(path, 'binary')
          )
        }
      },

      CallExpression(path) {
      	const { object, property } = path.node.callee;
        const { arguments } = path.node;

        if(
          !repeatedNode(path) &&
        	object && object.name &&
        	property && property.name &&
          object.name == 'Array' &&
          property.name == 'isArray' &&
          arguments &&
          arguments[0].object
        ) {
          path.replaceWith(
            replacementGenerator(path, 'array')
          )
        }
      }
    }
  };
}
