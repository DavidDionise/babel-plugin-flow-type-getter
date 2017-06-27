const babylon = require('babylon');
const t = require('babel-types');
const fs = require('fs');
const { resolve } = require('path');

let class_names_list = [];
const customFunctionName = '__getFlowTypes';

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
    case 'ObjectTypeAnnotation':
      const parsed_object = properties.map(({key, value}) => {
        const { optional, static } = value;
        return `${key.name} :${optional ? '?' : ''}${static ? 'static ' : ''} ${typeValueGenerator(value).stringified}`;
      }).join(', ');

      return {
        stringified : '{ ' + parsed_object + ' }',
        is_array : false,
        types : ['{ ' + parsed_object + ' }']
      };
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

const unaryTypeofReplacementGenerator = (node) => {
  const obj_name = node.argument.object.name;
  const prop_name = node.argument.property.name;
  const expression = `${obj_name}.${customFunctionName}().${prop_name}.stringified`;
  const parsed_function = babylon.parse(expression).program.body[0];

  return parsed_function;
}

const binaryTypeofReplacementGenerator = (left, right) => {
  const obj_name = left.argument.object.name;
  const prop_name = left.argument.property.name;
  const right_value = right.name;
  const expression =
    `${obj_name}.${customFunctionName}().
    ${prop_name}.types.find(__type => __type == ${right_value}) != null`;
  const parsed_function = babylon.parse(expression).program.body[0];

  return parsed_function;
}

const isArrayReplacementGenerator = (argument) => {
  const obj_name = argument.object.name;
  const prop_name = argument.property.name;
  const expression = `${obj_name}.${customFunctionName}().${prop_name}.is_array`;
  const parsed_function = babylon.parse(expression).program.body[0];

  return parsed_function;
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
          path.parent.type != 'BinaryExpression' &&
          operator == 'typeof' &&
          argument.type == 'MemberExpression' &&
          class_names_list.find(c => c == argument.object.name) != null
        ) {
          path.replaceWith(
            unaryTypeofReplacementGenerator(path.node)
          )
        }
      },

      BinaryExpression(path) {
        const { left, right, operator } = path.node;
        // console.log('bool check : ',
        //   left.type == 'UnaryExpression',
        //   left.operator != null,
        //   left.operator == 'typeof',
        //   left.argument != null,
        //   left.argument.type == 'MemberExpression',
        //   (left.operator == '==' || left.operator == '==='),
        //   class_names_list.find(cn => cn == left.argument.object.name) != null,
        //   right != null,
        //   right.name != null
        // )
        if(
          left.type == 'UnaryExpression' &&
          left.operator &&
          left.operator == 'typeof' &&
          left.argument &&
          left.argument.type == 'MemberExpression' &&
          (operator == '==' || operator == '===') &&
          class_names_list.find(cn => cn == left.argument.object.name) != null &&
          right &&
          right.name
        ) {

          path.replaceWith(
            binaryTypeofReplacementGenerator(left, right)
          )
        }
      },

      CallExpression(path) {
        const obj_name = path.node.callee.object.name;
        const prop_name = path.node.callee.property.name;
        const { arguments } = path.node;

        if(
          obj_name == 'Array' &&
          prop_name == 'isArray' &&
          arguments &&
          class_names_list.find(cn => cn == arguments[0].object.name) != null
        ) {
          path.replaceWith(
            isArrayReplacementGenerator(arguments[0])
          )
        }
      }
    }
  };
}
