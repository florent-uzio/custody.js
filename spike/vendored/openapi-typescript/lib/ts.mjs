import ts from "typescript-printer"

import { parseRef } from "./ref-utils.mjs"

const JS_PROPERTY_INDEX_RE = /^[A-Za-z_$][A-Za-z_$0-9]*$/
const BOOLEAN = ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
const FALSE = ts.factory.createLiteralTypeNode(ts.factory.createFalse())
const NEVER = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull())
const NUMBER = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
const QUESTION_TOKEN = ts.factory.createToken(ts.SyntaxKind.QuestionToken)
const STRING = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
const TRUE = ts.factory.createLiteralTypeNode(ts.factory.createTrue())
const UNKNOWN = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
const LB_RE = /\r?\n/g
const COMMENT_RE = /\*\//g
function addJSDocComment(schemaObject, node) {
  if (!schemaObject || typeof schemaObject !== "object" || Array.isArray(schemaObject)) {
    return
  }
  const output = []
  if (schemaObject.title) {
    output.push(schemaObject.title.trim().replace(LB_RE, "\n *     "))
  }
  if (schemaObject.summary) {
    output.push(schemaObject.summary.trim().replace(LB_RE, "\n *     "))
  }
  if (schemaObject.format) {
    output.push(`Format: ${schemaObject.format}`)
  }
  if (schemaObject.deprecated) {
    output.push("@deprecated")
  }
  const supportedJsDocTags = ["description", "default", "example"]
  for (const field of supportedJsDocTags) {
    const allowEmptyString = field === "default" || field === "example"
    if (schemaObject[field] === void 0) {
      continue
    }
    if (schemaObject[field] === "" && !allowEmptyString) {
      continue
    }
    const serialized =
      typeof schemaObject[field] === "object"
        ? JSON.stringify(schemaObject[field], null, 2)
        : schemaObject[field]
    output.push(`@${field} ${String(serialized).trim().replace(LB_RE, "\n *     ")}`)
  }
  if (Array.isArray(schemaObject.examples)) {
    for (const example of schemaObject.examples) {
      const serialized = typeof example === "object" ? JSON.stringify(example, null, 2) : example
      output.push(`@example ${String(serialized).trim().replace(LB_RE, "\n *     ")}`)
    }
  }
  if ("const" in schemaObject) {
    output.push("@constant")
  }
  if (schemaObject.enum) {
    let type = "unknown"
    if (Array.isArray(schemaObject.type)) {
      type = schemaObject.type.join("|")
    } else if (typeof schemaObject.type === "string") {
      type = schemaObject.type
    }
    output.push(`@enum {${type}${schemaObject.nullable ? "|null" : ""}}`)
  }
  if (output.length) {
    const hasMultiLineContent = output.some((item) => item.includes("\n"))
    let text =
      output.length === 1 && !hasMultiLineContent
        ? `* ${output.join("\n")} `
        : `*
 * ${output.join("\n * ")}
 `
    text = text.replace(COMMENT_RE, "*\\/")
    ts.addSyntheticLeadingComment(
      /* node               */
      node,
      /* kind               */
      ts.SyntaxKind.MultiLineCommentTrivia,
      // note: MultiLine just refers to a "/* */" comment
      /* text               */
      text,
      /* hasTrailingNewLine */
      true,
    )
  }
}
function isOasRef(obj) {
  return Boolean(obj.$ref)
}
function isParameterObject(obj) {
  return Boolean(obj && !isOasRef(obj) && obj.in)
}
function addIndexedAccess(node, ...segments) {
  return segments.reduce((acc, segment) => {
    return ts.factory.createIndexedAccessTypeNode(
      acc,
      ts.factory.createLiteralTypeNode(
        typeof segment === "number"
          ? ts.factory.createNumericLiteral(segment)
          : ts.factory.createStringLiteral(segment),
      ),
    )
  }, node)
}
function oapiRef(path, resolved) {
  const { pointer } = parseRef(path)
  if (pointer.length === 0) {
    throw new Error(`Error parsing $ref: ${path}. Is this a valid $ref?`)
  }
  const parametersObject = isParameterObject(resolved)
  const initialSegment = pointer[0]
  const leadingSegments = pointer.slice(1, 3)
  const restSegments = pointer.slice(3)
  const leadingType = addIndexedAccess(
    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(String(initialSegment))),
    ...leadingSegments,
  )
  return restSegments.reduce((acc, segment, index, original) => {
    if (segment === "properties") {
      return acc
    }
    if (parametersObject && index === original.length - 1) {
      return addIndexedAccess(acc, resolved.in, resolved.name)
    }
    return addIndexedAccess(acc, segment)
  }, leadingType)
}
function astToString(ast, options) {
  const sourceFile = ts.createSourceFile(
    options?.fileName ?? "openapi-ts.ts",
    options?.sourceText ?? "",
    ts.ScriptTarget.ESNext,
    false,
    ts.ScriptKind.TS,
  )
  sourceFile.statements = ts.factory.createNodeArray(Array.isArray(ast) ? ast : [ast])
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
    ...options?.formatOptions,
  })
  return printer.printFile(sourceFile)
}
function stringToAST(source) {
  return ts.createSourceFile(
    /* fileName        */
    "stringInput",
    /* sourceText      */
    source,
    /* languageVersion */
    ts.ScriptTarget.ESNext,
    /* setParentNodes  */
    void 0,
    /* scriptKind      */
    void 0,
  ).statements
}
function tsDedupe(types) {
  const encounteredTypes = /* @__PURE__ */ new Set()
  const filteredTypes = []
  for (const t of types) {
    if (!("text" in (t.literal ?? t))) {
      const { kind } = t.literal ?? t
      if (encounteredTypes.has(kind)) {
        continue
      }
      if (tsIsPrimitive(t)) {
        encounteredTypes.add(kind)
      }
    }
    filteredTypes.push(t)
  }
  return filteredTypes
}
function tsIntersection(types) {
  if (types.length === 0) {
    return NEVER
  }
  if (types.length === 1) {
    return types[0]
  }
  return ts.factory.createIntersectionTypeNode(tsDedupe(types))
}
function tsIsPrimitive(type) {
  if (!type) {
    return true
  }
  return (
    ts.SyntaxKind[type.kind] === "BooleanKeyword" ||
    ts.SyntaxKind[type.kind] === "NeverKeyword" ||
    ts.SyntaxKind[type.kind] === "NullKeyword" ||
    ts.SyntaxKind[type.kind] === "NumberKeyword" ||
    ts.SyntaxKind[type.kind] === "StringKeyword" ||
    ts.SyntaxKind[type.kind] === "UndefinedKeyword" ||
    ("literal" in type && tsIsPrimitive(type.literal))
  )
}
function tsLiteral(value) {
  if (typeof value === "string") {
    return ts.factory.createIdentifier(JSON.stringify(value))
  }
  if (typeof value === "number") {
    const literal =
      value < 0
        ? ts.factory.createPrefixUnaryExpression(
            ts.SyntaxKind.MinusToken,
            ts.factory.createNumericLiteral(Math.abs(value)),
          )
        : ts.factory.createNumericLiteral(value)
    return ts.factory.createLiteralTypeNode(literal)
  }
  if (typeof value === "boolean") {
    return value === true ? TRUE : FALSE
  }
  if (value === null) {
    return NULL
  }
  throw new Error(`Unsupported literal value: ${JSON.stringify(value)}`)
}
function tsModifiers(modifiers) {
  const typeMods = []
  if (modifiers.export) {
    typeMods.push(ts.factory.createModifier(ts.SyntaxKind.ExportKeyword))
  }
  if (modifiers.readonly) {
    typeMods.push(ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword))
  }
  return typeMods
}
function tsNullable(types) {
  return ts.factory.createUnionTypeNode([...types, NULL])
}
function tsOmit(type, keys) {
  return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Omit"), [
    type,
    ts.factory.createUnionTypeNode(keys.map((k) => tsLiteral(k))),
  ])
}
function tsRecord(key, value) {
  return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("Record"), [key, value])
}
function tsPropertyIndex(index) {
  if (
    (typeof index === "number" && !(index < 0)) ||
    (typeof index === "string" && String(Number(index)) === index && index[0] !== "-")
  ) {
    return ts.factory.createNumericLiteral(index)
  }
  return typeof index === "string" && JS_PROPERTY_INDEX_RE.test(index)
    ? ts.factory.createIdentifier(index)
    : ts.factory.createStringLiteral(String(index))
}
function tsUnion(types) {
  if (types.length === 0) {
    return NEVER
  }
  if (types.length === 1) {
    return types[0]
  }
  return ts.factory.createUnionTypeNode(tsDedupe(types))
}
function tsWithRequired(type, keys, injectFooter) {
  if (keys.length === 0) {
    return type
  }
  if (
    !injectFooter.some(
      (node) => ts.isTypeAliasDeclaration(node) && node?.name?.escapedText === "WithRequired",
    )
  ) {
    const helper = stringToAST(
      "type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };",
    )[0]
    injectFooter.push(helper)
  }
  return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier("WithRequired"), [
    type,
    tsUnion(keys.map((k) => tsLiteral(k))),
  ])
}

export {
  BOOLEAN,
  NEVER,
  NULL,
  NUMBER,
  QUESTION_TOKEN,
  STRING,
  UNKNOWN,
  addJSDocComment,
  astToString,
  oapiRef,
  stringToAST,
  tsIntersection,
  tsIsPrimitive,
  tsLiteral,
  tsModifiers,
  tsNullable,
  tsOmit,
  tsPropertyIndex,
  tsRecord,
  tsUnion,
  tsWithRequired,
}
