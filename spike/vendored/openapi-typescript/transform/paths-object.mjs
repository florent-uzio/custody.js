import ts from "typescript-printer"

import { tsPropertyIndex, oapiRef, addJSDocComment } from "../lib/ts.mjs"
import { getEntries, createRef } from "../lib/utils.mjs"
import transformPathItemObject from "./path-item-object.mjs"

function transformPathsObject(pathsObject, ctx) {
  const type = []
  for (const [url, pathItemObject] of getEntries(pathsObject)) {
    if (!pathItemObject || typeof pathItemObject !== "object") {
      continue
    }
    if ("$ref" in pathItemObject) {
      const property = ts.factory.createPropertySignature(
        void 0,
        tsPropertyIndex(url),
        void 0,
        oapiRef(pathItemObject.$ref),
      )
      addJSDocComment(pathItemObject, property)
      type.push(property)
    } else {
      const pathItemType = transformPathItemObject(pathItemObject, {
        path: createRef(["paths", url]),
        ctx,
      })
      type.push(
        ts.factory.createPropertySignature(void 0, tsPropertyIndex(url), void 0, pathItemType),
      )
    }
  }
  return ts.factory.createTypeLiteralNode(type)
}

export { transformPathsObject as default }
