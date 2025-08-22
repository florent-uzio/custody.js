import { describe, expect, it } from "vitest"
import {
  isBoolean,
  isDate,
  isFunction,
  isNumber,
  isObject,
  isString,
  isStringifiedObject,
  isUndefined,
  isUUID,
} from "./typeof-fns"

describe("isFunction", () => {
  it("correctly identifies functions", () => {
    // non-functions
    expect(isFunction(undefined)).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction("")).toBe(false)
    expect(isFunction(true)).toBe(false)
    expect(isFunction(false)).toBe(false)
    expect(isFunction(200)).toBe(false)
    expect(isFunction([])).toBe(false)
    expect(isFunction({})).toBe(false)
    // functions
    expect(
      isFunction(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      }),
    ).toBe(true)
    expect(isFunction(Array.from)).toBe(true)
    expect(isFunction(isNumber)).toBe(true)
  })
})

describe("isNumber", () => {
  it("correctly identifies numbers", () => {
    // non-numbers
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber("")).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(false)).toBe(false)
    expect(isNumber([])).toBe(false)
    expect(isNumber({})).toBe(false)
    expect(
      isNumber(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      }),
    ).toBe(false)
    expect(isNumber(Array.from)).toBe(false)
    // numbers
    expect(isNumber(200)).toBe(true)
    expect(isNumber(0.5)).toBe(true)
    // should return `false` for `NaN`
    expect(isNumber(+"hello")).toBe(false)
  })
})

describe("isString", () => {
  it("correctly identifies strings", () => {
    // non-strings
    expect(isString(undefined)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(false)).toBe(false)
    expect(isString([])).toBe(false)
    expect(isString({})).toBe(false)
    expect(
      isString(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      }),
    ).toBe(false)
    expect(isString(Array.from)).toBe(false)
    expect(isString(200)).toBe(false)
    // strings
    expect(isString("")).toBe(true)
    expect(isString("test")).toBe(true)
  })
})

describe("isUndefined", () => {
  it('correctly identifies "undefined"', () => {
    // defined
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(true)).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined([])).toBe(false)
    expect(isUndefined({})).toBe(false)
    expect(
      isUndefined(() => {
        return
      }),
    ).toBe(false)
    expect(isUndefined(Array.from)).toBe(false)
    expect(isUndefined(200)).toBe(false)
    expect(isUndefined("")).toBe(false)
    // undefined
    expect(isUndefined(undefined)).toBe(true)
  })
})

describe("isObject", () => {
  it("correctly identifies objects", () => {
    // things we do not want to consider objects
    expect(isObject(undefined)).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(false)).toBe(false)
    expect(isObject([])).toBe(false)
    expect(
      isObject(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      }),
    ).toBe(false)
    expect(isObject(Array.from)).toBe(false)
    expect(isObject(200)).toBe(false)
    expect(isObject("")).toBe(false)
    // object
    expect(isObject({})).toBe(true)
  })
})

describe("isBoolean", () => {
  it("correctly identifies a boolean", () => {
    // Things which are not a boolean
    expect(isBoolean(undefined)).toBe(false)
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean("1")).toBe(false)
    expect(isBoolean("")).toBe(false)
    expect(isBoolean([])).toBe(false)
    expect(isBoolean({})).toBe(false)
    expect(isBoolean(Array.from)).toBe(false)

    // Boolean
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })
})

describe("isDate", () => {
  it("correctly identifies a date", () => {
    // Things which are not a date
    expect(isDate(undefined)).toBe(false)
    expect(isDate(1)).toBe(false)
    expect(isDate("1")).toBe(false)
    expect(isDate("not a date")).toBe(false)
    expect(isDate("")).toBe(false)
    expect(isDate([])).toBe(false)
    expect(isDate({})).toBe(false)
    expect(isDate(Array.from)).toBe(false)

    // Date
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date("1/1/2001"))).toBe(true)
  })
})

describe("isUUID", () => {
  it("correctly identifies valid UUIDs", () => {
    // Valid UUIDs (RFC 4122 compliant)
    expect(isUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true)
    expect(isUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true)
    expect(isUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true)
    expect(isUUID("6ba7b811-9dad-11d1-80b4-00c04fd430c8")).toBe(true)
    expect(isUUID("6ba7b812-9dad-11d1-80b4-00c04fd430c8")).toBe(true)
    expect(isUUID("6ba7b814-9dad-11d1-80b4-00c04fd430c8")).toBe(true)
    expect(isUUID("6ba7b815-9dad-11d1-80b4-00c04fd430c8")).toBe(true)

    // UUIDs with uppercase letters (should be case-insensitive)
    expect(isUUID("123E4567-E89B-12D3-A456-426614174000")).toBe(true)
    expect(isUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true)

    // Mixed case UUIDs
    expect(isUUID("123e4567-E89b-12D3-a456-426614174000")).toBe(true)
  })

  it("correctly rejects invalid UUIDs", () => {
    // Non-string values
    expect(isUUID(undefined as any)).toBe(false)
    expect(isUUID(null as any)).toBe(false)
    expect(isUUID(123 as any)).toBe(false)
    expect(isUUID({} as any)).toBe(false)
    expect(isUUID([] as any)).toBe(false)
    expect(isUUID(true as any)).toBe(false)
    expect(isUUID(false as any)).toBe(false)

    // Invalid string formats
    expect(isUUID("")).toBe(false)
    expect(isUUID("not-a-uuid")).toBe(false)
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Missing version digit
    expect(isUUID("12345678-1234-1234-1234-12345678901")).toBe(false) // Too short
    expect(isUUID("12345678-1234-1234-1234-1234567890123")).toBe(false) // Too long

    // Invalid version numbers (must be 1-5)
    expect(isUUID("12345678-1234-0234-1234-123456789012")).toBe(false) // Version 0
    expect(isUUID("12345678-1234-6234-1234-123456789012")).toBe(false) // Version 6
    expect(isUUID("12345678-1234-7234-1234-123456789012")).toBe(false) // Version 7
    expect(isUUID("12345678-1234-8234-1234-123456789012")).toBe(false) // Version 8
    expect(isUUID("12345678-1234-9234-1234-123456789012")).toBe(false) // Version 9
    expect(isUUID("12345678-1234-a234-1234-123456789012")).toBe(false) // Version a
    expect(isUUID("12345678-1234-b234-1234-123456789012")).toBe(false) // Version b
    expect(isUUID("12345678-1234-c234-1234-123456789012")).toBe(false) // Version c
    expect(isUUID("12345678-1234-d234-1234-123456789012")).toBe(false) // Version d
    expect(isUUID("12345678-1234-e234-1234-123456789012")).toBe(false) // Version e
    expect(isUUID("12345678-1234-f234-1234-123456789012")).toBe(false) // Version f

    // Invalid variant bits (must be 8, 9, a, or b)
    expect(isUUID("12345678-1234-1234-0234-123456789012")).toBe(false) // Variant 0
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Variant 1
    expect(isUUID("12345678-1234-1234-2234-123456789012")).toBe(false) // Variant 2
    expect(isUUID("12345678-1234-1234-3234-123456789012")).toBe(false) // Variant 3
    expect(isUUID("12345678-1234-1234-4234-123456789012")).toBe(false) // Variant 4
    expect(isUUID("12345678-1234-1234-5234-123456789012")).toBe(false) // Variant 5
    expect(isUUID("12345678-1234-1234-6234-123456789012")).toBe(false) // Variant 6
    expect(isUUID("12345678-1234-1234-7234-123456789012")).toBe(false) // Variant 7
    expect(isUUID("12345678-1234-1234-c234-123456789012")).toBe(false) // Variant c
    expect(isUUID("12345678-1234-1234-d234-123456789012")).toBe(false) // Variant d
    expect(isUUID("12345678-1234-1234-e234-123456789012")).toBe(false) // Variant e
    expect(isUUID("12345678-1234-1234-f234-123456789012")).toBe(false) // Variant f

    // Malformed UUIDs
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Missing hyphens
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Extra hyphens
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Wrong positions
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Invalid characters
  })

  it("handles edge cases correctly", () => {
    // Edge cases
    expect(isUUID("00000000-0000-1000-8000-000000000000")).toBe(true) // All zeros with valid version/variant
    expect(isUUID("ffffffff-ffff-5fff-bfff-ffffffffffff")).toBe(true) // All f's with valid version/variant
    expect(isUUID("12345678-1234-1234-1234-123456789012")).toBe(false) // Almost valid but wrong variant

    // Real-world examples from the codebase
    expect(isUUID("36993320-745e-41b9-b04c-1513d8219fcf")).toBe(true)
    expect(isUUID("9017fe9e-1de8-44bb-a5f2-fe98c19aa65d")).toBe(true)
  })
})

describe("isStringifiedObject", () => {
  it("correctly identifies valid stringified objects", () => {
    // Simple objects
    expect(isStringifiedObject("{}")).toBe(true)
    expect(isStringifiedObject('{"key": "value"}')).toBe(true)
    expect(isStringifiedObject('{"number": 123}')).toBe(true)
    expect(isStringifiedObject('{"boolean": true}')).toBe(true)
    expect(isStringifiedObject('{"null": null}')).toBe(true)

    // Complex objects
    expect(isStringifiedObject('{"nested": {"key": "value"}}')).toBe(true)
    expect(isStringifiedObject('{"array": [1, 2, 3]}')).toBe(true)
    expect(
      isStringifiedObject('{"mixed": {"string": "test", "number": 42, "boolean": false}}'),
    ).toBe(true)

    // Objects with special characters
    expect(isStringifiedObject('{"key": "value with spaces"}')).toBe(true)
    expect(isStringifiedObject('{"key": "value with \\"quotes\\""}')).toBe(true)
    expect(isStringifiedObject('{"key": "value with \\n newlines"}')).toBe(true)
    expect(isStringifiedObject('{"key": "value with unicode: 🚀"}')).toBe(true)

    // Objects with various data types
    expect(
      isStringifiedObject(
        '{"string": "test", "number": 42, "boolean": true, "null": null, "array": [], "object": {}}',
      ),
    ).toBe(true)
  })

  it("correctly rejects non-stringified objects", () => {
    // Non-string values
    expect(isStringifiedObject(undefined as any)).toBe(false)
    expect(isStringifiedObject(null as any)).toBe(false)
    expect(isStringifiedObject(123 as any)).toBe(false)
    expect(isStringifiedObject(true as any)).toBe(false)
    expect(isStringifiedObject(false as any)).toBe(false)
    expect(isStringifiedObject({} as any)).toBe(false)
    expect(isStringifiedObject([] as any)).toBe(false)
    expect(isStringifiedObject((() => {}) as any)).toBe(false)

    // Strings that don't start/end with braces
    expect(isStringifiedObject("")).toBe(false)
    expect(isStringifiedObject("not an object")).toBe(false)
    expect(isStringifiedObject("{}extra")).toBe(false)
    expect(isStringifiedObject("extra{}")).toBe(false)
    expect(isStringifiedObject("{not closed")).toBe(false)
    expect(isStringifiedObject("not opened}")).toBe(false)

    // Invalid JSON strings
    expect(isStringifiedObject("{")).toBe(false)
    expect(isStringifiedObject("}")).toBe(false)
    expect(isStringifiedObject('{"key":}')).toBe(false) // Missing value
    expect(isStringifiedObject('{"key": "value",}')).toBe(false) // Trailing comma
    expect(isStringifiedObject('{"key": "value", "another":}')).toBe(false) // Missing value
    expect(isStringifiedObject('{"key": "value" "another": "value"}')).toBe(false) // Missing comma

    // Strings that are not objects
    expect(isStringifiedObject('"just a string"')).toBe(false)
    expect(isStringifiedObject("123")).toBe(false)
    expect(isStringifiedObject("true")).toBe(false)
    expect(isStringifiedObject("false")).toBe(false)
    expect(isStringifiedObject("null")).toBe(false)
    expect(isStringifiedObject("[1, 2, 3]")).toBe(false) // Arrays are not objects
    expect(isStringifiedObject('["string", 123, true]')).toBe(false) // Arrays are not objects
  })

  it("handles edge cases correctly", () => {
    // Edge cases
    expect(isStringifiedObject("{}")).toBe(true) // Empty object
    expect(isStringifiedObject('{"": ""}')).toBe(true) // Empty key
    expect(isStringifiedObject('{"key": ""}')).toBe(true) // Empty value
    expect(isStringifiedObject('{"key": "   "}')).toBe(true) // Whitespace value
    expect(isStringifiedObject('{"   ": "value"}')).toBe(true) // Whitespace key

    // Objects with special JSON characters
    expect(isStringifiedObject('{"key": "value with \\"escaped quotes\\""}')).toBe(true)
    expect(isStringifiedObject('{"key": "value with \\\\ backslashes"}')).toBe(true)
    expect(isStringifiedObject('{"key": "value with \\n \\t \\r"}')).toBe(true)

    // Objects with unicode
    expect(isStringifiedObject('{"key": "🚀 rocket"}')).toBe(true)
    expect(isStringifiedObject('{"🚀": "value"}')).toBe(true)
    expect(isStringifiedObject('{"key": "café"}')).toBe(true)
    expect(isStringifiedObject('{"key": "测试"}')).toBe(true)

    // Objects with numbers as keys
    expect(isStringifiedObject('{"123": "value"}')).toBe(true)
    expect(isStringifiedObject('{"0": "value"}')).toBe(true)

    // Objects with boolean/null values
    expect(isStringifiedObject('{"key": true}')).toBe(true)
    expect(isStringifiedObject('{"key": false}')).toBe(true)
    expect(isStringifiedObject('{"key": null}')).toBe(true)
    expect(isStringifiedObject('{"true": "value"}')).toBe(true)
    expect(isStringifiedObject('{"false": "value"}')).toBe(true)
    expect(isStringifiedObject('{"null": "value"}')).toBe(true)
  })

  it("handles real-world examples from the codebase", () => {
    // Examples similar to what might be used in the Ripple Custody API
    const intentRequest =
      '{"author":{"id":"fb42b7dc-401a-458e-bc17-6815be91edf6","domainId":"73dbd185-f66f-454a-bc24-633da4176860"},"expiryAt":"2025-09-21T10:48:11.910Z","targetDomainId":"0c560752-672b-486b-a743-e4398b22f352","id":"2afe022a-e91f-4a4f-b47c-909c12c7194e","payload":{"id":"65edd09d-f1eb-4834-b424-62ab253527d1","accountId":"bf9a7faa-a768-4235-800b-4e6fc274a88d","tickerId":"d9a3b9e4-b9f9-4844-a7d2-518a43eff2ba","outputs":[{"amount":"100","destination":{"accountId":"4d911c86-410e-4296-9c3e-a9e9bacd99dd","type":"Account"}}],"customProperties":{},"feeStrategy":"Low","type":"v0_CreateTransferOrder","description":"SDK"},"customProperties":{},"type":"Propose"}'

    expect(isStringifiedObject(intentRequest)).toBe(true)

    // Canonicalized version (sorted keys)
    const canonicalizedRequest =
      '{"author":{"domainId":"2ff463fe-0fcb-40cf-b1ee-6389d237256f","id":"29023174-83a7-46d9-ba6f-bf562343438d"},"customProperties":{},"expiryAt":"2025-09-21T10:48:11.910Z","id":"43064342-22e2-41ac-a884-793fb4f45c1c","payload":{"accountId":"7dc3fa14-0dfe-4d17-b4f3-e8040426e53d","customProperties":{},"description":"SDK","feeStrategy":"Low","id":"bd028e19-69b4-434a-bded-00f1ba59e941","outputs":[{"amount":"100","destination":{"accountId":"852fa38a-82d8-41d3-97c1-5ec3698cd54c","type":"Account"}}],"tickerId":"c9092abe-4de8-43bc-bfa2-6ce9a078d34a","type":"v0_CreateTransferOrder"},"targetDomainId":"1ed4d8e3-b1c6-4044-aa43-aa0634dc3fe5","type":"Propose"}'

    expect(isStringifiedObject(canonicalizedRequest)).toBe(true)
  })
})
