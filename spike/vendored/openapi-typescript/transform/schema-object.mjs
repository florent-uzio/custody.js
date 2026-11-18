import ts from "typescript-printer"

import {
  NEVER,
  UNKNOWN,
  oapiRef,
  tsLiteral,
  tsUnion,
  NULL,
  tsIntersection,
  tsIsPrimitive,
  tsRecord,
  STRING,
  tsNullable,
  NUMBER,
  BOOLEAN,
  QUESTION_TOKEN,
  tsModifiers,
  tsPropertyIndex,
  addJSDocComment,
  tsWithRequired,
  tsOmit,
} from "../lib/ts.mjs"
import { createRef, createDiscriminatorProperty, getEntries } from "../lib/utils.mjs"

// Keywords the bundled specs never use. Upstream handles them; we fail loudly so
// a future spec cannot be silently mistyped by the pruned generator.
const UNSUPPORTED_KEYWORDS = ["anyOf", "const", "patternProperties", "prefixItems", "$defs", "not"]

function transformSchemaObject(schemaObject, options) {
  if (!schemaObject) {
    return NEVER
  }
  if (schemaObject === true) {
    return UNKNOWN
  }
  if (Array.isArray(schemaObject) || typeof schemaObject !== "object") {
    throw new Error(
      `Expected SchemaObject, received ${Array.isArray(schemaObject) ? "Array" : typeof schemaObject} at ${options.path}`,
    )
  }
  if ("$ref" in schemaObject) {
    return oapiRef(schemaObject.$ref)
  }
  for (const keyword of UNSUPPORTED_KEYWORDS) {
    if (keyword in schemaObject) {
      throw new Error(`Unsupported schema keyword "${keyword}" at ${options.path}`)
    }
  }
  if (Array.isArray(schemaObject.type) || Array.isArray(schemaObject.items)) {
    throw new Error(`Unsupported type array / tuple at ${options.path}`)
  }
  if (
    Array.isArray(schemaObject.enum) &&
    (!("type" in schemaObject) || schemaObject.type !== "object") &&
    !("properties" in schemaObject) &&
    !("additionalProperties" in schemaObject)
  ) {
    const enumType = schemaObject.enum.map(tsLiteral)
    if (schemaObject.nullable) {
      enumType.push(NULL)
    }
    return tsUnion(enumType)
  }
  function collectOneOfCompositions(items) {
    const output = []
    for (const [index, item] of items.entries()) {
      output.push(
        transformSchemaObject(item, {
          ...options,
          path: createRef([options.path, "oneOf", String(index)]),
        }),
      )
    }
    return output
  }
  function collectAllOfCompositions(items, required) {
    const output = []
    for (const item of items) {
      let itemType
      if ("$ref" in item) {
        itemType = transformSchemaObject(item, options)
        const resolved = options.ctx.resolve(item.$ref)
        if (
          resolved &&
          typeof resolved === "object" &&
          "properties" in resolved && // we have already handled this item (discriminator property was already added as required)
          !options.ctx.discriminators.refsHandled.includes(item.$ref)
        ) {
          const validRequired = (required ?? []).filter((key) => !!resolved.properties?.[key])
          if (validRequired.length) {
            itemType = tsWithRequired(itemType, validRequired, options.ctx.injectFooter)
          }
        }
      } else {
        const itemRequired = [...(required ?? [])]
        if (typeof item === "object" && Array.isArray(item.required)) {
          itemRequired.push(...item.required)
        }
        itemType = transformSchemaObject({ ...item, required: itemRequired }, options)
      }
      const discriminator =
        ("$ref" in item && options.ctx.discriminators.objects[item.$ref]) || item.discriminator
      if (discriminator) {
        output.push(tsOmit(itemType, [discriminator.propertyName]))
      } else {
        output.push(itemType)
      }
    }
    return output
  }
  let finalType
  const coreObjectType = transformSchemaObjectCore(schemaObject, options)
  const allOfType = collectAllOfCompositions(schemaObject.allOf ?? [], schemaObject.required)
  if (coreObjectType || allOfType.length) {
    const allOf = allOfType.length ? tsIntersection(allOfType) : void 0
    finalType = tsIntersection([
      ...(coreObjectType ? [coreObjectType] : []),
      ...(allOf ? [allOf] : []),
    ])
  }
  const oneOfType = collectOneOfCompositions(schemaObject.oneOf || [])
  if (oneOfType.length) {
    if (oneOfType.every(tsIsPrimitive)) {
      finalType = tsUnion([...(finalType ? [finalType] : []), ...oneOfType])
    } else {
      finalType = tsIntersection([...(finalType ? [finalType] : []), tsUnion(oneOfType)])
    }
  }
  if (!finalType) {
    if ("type" in schemaObject) {
      finalType = tsRecord(STRING, NEVER)
    } else {
      finalType = UNKNOWN
    }
  }
  if (finalType !== UNKNOWN && schemaObject.nullable) {
    finalType = tsNullable([finalType])
  }
  return finalType
}
function transformSchemaObjectCore(schemaObject, options) {
  if ("type" in schemaObject && schemaObject.type) {
    if (schemaObject.type === "null") {
      return NULL
    }
    if (schemaObject.type === "string") {
      return STRING
    }
    if (schemaObject.type === "number" || schemaObject.type === "integer") {
      return NUMBER
    }
    if (schemaObject.type === "boolean") {
      return BOOLEAN
    }
    if (schemaObject.type === "array") {
      let itemType = UNKNOWN
      if (schemaObject.items) {
        if (hasKey(schemaObject.items, "type") && schemaObject.items.type === "array") {
          itemType = ts.factory.createArrayTypeNode(
            transformSchemaObject(schemaObject.items, options),
          )
        } else {
          itemType = transformSchemaObject(schemaObject.items, options)
        }
      }
      return ts.isTupleTypeNode(itemType) || ts.isArrayTypeNode(itemType)
        ? itemType
        : ts.factory.createArrayTypeNode(itemType)
    }
  }
  const coreObjectType = []
  if (schemaObject.allOf) {
    const discriminator =
      !schemaObject.discriminator &&
      !options.ctx.discriminators.refsHandled.includes(options.path ?? "") &&
      options.ctx.discriminators.objects[options.path ?? ""]
    if (discriminator) {
      coreObjectType.unshift(
        createDiscriminatorProperty(discriminator, { path: options.path ?? "" }),
      )
    }
  }
  if (
    ("properties" in schemaObject &&
      schemaObject.properties &&
      Object.keys(schemaObject.properties).length) ||
    ("additionalProperties" in schemaObject && schemaObject.additionalProperties)
  ) {
    for (const [k, v] of getEntries(schemaObject.properties ?? {})) {
      if ((typeof v !== "object" && typeof v !== "boolean") || Array.isArray(v)) {
        throw new Error(
          `${options.path}: invalid property ${k}. Expected Schema Object or boolean, got ${Array.isArray(v) ? "Array" : typeof v}`,
        )
      }
      const { $ref, readOnly, hasDefault } =
        typeof v === "object"
          ? {
              $ref: "$ref" in v && v.$ref,
              readOnly: "readOnly" in v && v.readOnly,
              hasDefault: "default" in v && v.default !== void 0,
            }
          : {}
      const optional =
        schemaObject.required?.includes(k) ||
        (hasDefault &&
          !options.path?.includes("parameters") &&
          !options.path?.includes("requestBody") &&
          !options.path?.includes("requestBodies"))
          ? void 0
          : QUESTION_TOKEN
      const type = $ref
        ? oapiRef($ref)
        : transformSchemaObject(v, { ...options, path: createRef([options.path, k]) })
      const property = ts.factory.createPropertySignature(
        /* modifiers     */
        tsModifiers({ readonly: readOnly }),
        /* name          */
        tsPropertyIndex(k),
        /* questionToken */
        optional,
        /* type          */
        type,
      )
      addJSDocComment(v, property)
      coreObjectType.push(property)
    }
    const hasExplicitAdditionalProperties =
      typeof schemaObject.additionalProperties === "object" &&
      Object.keys(schemaObject.additionalProperties).length
    const hasImplicitAdditionalProperties =
      schemaObject.additionalProperties === true ||
      (typeof schemaObject.additionalProperties === "object" &&
        Object.keys(schemaObject.additionalProperties).length === 0)
    const stringIndexTypes = []
    if (hasExplicitAdditionalProperties) {
      stringIndexTypes.push(transformSchemaObject(schemaObject.additionalProperties, options))
    }
    if (hasImplicitAdditionalProperties) {
      stringIndexTypes.push(UNKNOWN)
    }
    if (stringIndexTypes.length === 0) {
      return coreObjectType.length ? ts.factory.createTypeLiteralNode(coreObjectType) : void 0
    }
    return tsIntersection([
      ...(coreObjectType.length ? [ts.factory.createTypeLiteralNode(coreObjectType)] : []),
      ts.factory.createTypeLiteralNode([
        ts.factory.createIndexSignature(
          /* modifiers  */
          void 0,
          /* parameters */
          [
            ts.factory.createParameterDeclaration(
              /* modifiers      */
              void 0,
              /* dotDotDotToken */
              void 0,
              /* name           */
              ts.factory.createIdentifier("key"),
              /* questionToken  */
              void 0,
              /* type           */
              STRING,
            ),
          ],
          /* type       */
          tsUnion(stringIndexTypes),
        ),
      ]),
    ])
  }
  return coreObjectType.length ? ts.factory.createTypeLiteralNode(coreObjectType) : void 0
}
function hasKey(possibleObject, key) {
  return typeof possibleObject === "object" && possibleObject !== null && key in possibleObject
}

export { transformSchemaObject as default }
