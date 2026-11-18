import ts from "typescript-printer"

import { oapiRef, tsPropertyIndex, addJSDocComment, QUESTION_TOKEN, NEVER } from "../lib/ts.mjs"
import { createRef } from "../lib/utils.mjs"
import transformParameterObject from "./parameter-object.mjs"

function transformParametersArray(parametersArray, options) {
  const type = []
  const workingParameters = parametersArray
  const paramType = []
  for (const paramIn of ["query", "header", "path", "cookie"]) {
    const paramLocType = []
    const operationParameters = workingParameters.map((param) => ({
      original: param,
      resolved: "$ref" in param ? options.ctx.resolve(param.$ref) : param,
    }))
    for (const { original, resolved } of operationParameters) {
      if (resolved?.in !== paramIn) {
        continue
      }
      let optional
      if (paramIn !== "path" && !resolved.required) {
        optional = QUESTION_TOKEN
      }
      const subType =
        "$ref" in original
          ? oapiRef(original.$ref, resolved)
          : transformParameterObject(resolved, {
              ...options,
              path: createRef([options.path, "parameters", resolved.in, resolved.name]),
            })
      const property = ts.factory.createPropertySignature(
        /* modifiers     */
        void 0,
        /* name          */
        tsPropertyIndex(resolved?.name),
        /* questionToken */
        optional,
        /* type          */
        subType,
      )
      addJSDocComment(resolved, property)
      paramLocType.push(property)
    }
    const allOptional = paramLocType.every((node) => !!node.questionToken)
    paramType.push(
      ts.factory.createPropertySignature(
        /* modifiers     */
        void 0,
        /* name          */
        tsPropertyIndex(paramIn),
        /* questionToken */
        allOptional || !paramLocType.length ? QUESTION_TOKEN : void 0,
        /* type          */
        paramLocType.length ? ts.factory.createTypeLiteralNode(paramLocType) : NEVER,
      ),
    )
  }
  type.push(
    ts.factory.createPropertySignature(
      /* modifiers     */
      void 0,
      /* name          */
      tsPropertyIndex("parameters"),
      /* questionToken */
      !paramType.length ? QUESTION_TOKEN : void 0,
      /* type          */
      paramType.length ? ts.factory.createTypeLiteralNode(paramType) : NEVER,
    ),
  )
  return type
}

export { transformParametersArray }
