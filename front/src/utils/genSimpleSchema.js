import SimpleSchema from 'simpl-schema';

export function generateSimpleSchema(parsedPolitic) {
    console.log(parsedPolitic)
  const schema = parsedPolitic.reduce((all, { fields }) => {
    const newSchemaPart =  fields.reduce((stepFields, field) => {
      if (typeof field === "string") return { ...stepFields, [field]: String };
      const { type, values, name } = field;
      // no type so we assume that it's a string
      if (!type && !values) return { ...stepFields, [name]: String };
      if (type === 'Text') return { ...stepFields,  [name]: String };
      if (!type) return { ...stepFields, [name]: {type: String, allowedValues: values} };
      if (type === 'Number') return { ...stepFields, [name]: {type: Number, allowedValues: values} };
      if (type === 'String') return { ...stepFields, [name]: {type: String, allowedValues: values} };
      return stepFields
    }, {});
    return {...all, ...newSchemaPart}
  }, {});
  console.log(new SimpleSchema(schema))
  return new SimpleSchema(schema)
}
