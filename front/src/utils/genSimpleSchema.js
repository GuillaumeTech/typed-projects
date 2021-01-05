import SimpleSchema from 'simpl-schema';

export function generateSimpleSchema(parsedPolitic) {
    console.log(parsedPolitic)
  const schema = parsedPolitic.reduce((all, { fields }) => {
    const newSchemaPart =  fields.reduce((stepFields, field) => {
      if (typeof field === "string") return { ...stepFields, [field]:{type: String, optional: true }};
      const { type, values, name } = field;
      // no type so we assume that it's a string
      if (!type && !values) return { ...stepFields, [name]:{type: String, optional: true } };
      if (type === 'Text') return { ...stepFields,  [name]: {type: String, optional: true }  };
      if (!type) return { ...stepFields, [name]: {type: String, allowedValues: values,  optional: true} };
      if (type === 'Number') return { ...stepFields, [name]: {type: Number, allowedValues: values,  optional: true} };
      if (type === 'String') return { ...stepFields, [name]: {type: String, allowedValues: values,  optional: true} };
      return stepFields
    }, {});
    return {...all, ...newSchemaPart}
  }, {});
  console.log(new SimpleSchema(schema, {optional: true}))
  return new SimpleSchema(schema)
}
