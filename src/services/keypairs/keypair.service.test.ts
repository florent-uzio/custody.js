import { describe, expect, it } from "vitest"
import { KeypairService } from "./keypair.service.js"

// Helper to create a PEM string with a given OID hex in the DER
function makePemWithOidHex(oidHex: string): string {
  // Minimal DER: SEQUENCE (0x30), length, OID (0x06), length, OID bytes
  const der = Buffer.from("300906" + oidHex, "hex")
  const b64 = der.toString("base64")
  return `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----`
}

type DetectKeyTypeTestCase = {
  name: string
  input: string | Buffer
  expected: string
}

// Test cases
const cases: DetectKeyTypeTestCase[] = [
  {
    name: "detects ed25519 from PEM string",
    input: makePemWithOidHex("2b6570"),
    expected: "ed25519",
  },
  {
    name: "detects secp256k1 from PEM string",
    input: makePemWithOidHex("2b8104000a"),
    expected: "secp256k1",
  },
  {
    name: "detects secp256r1 from PEM string",
    input: makePemWithOidHex("2a8648ce3d030107"),
    expected: "secp256r1",
  },
  {
    name: "returns unknown for PEM with unknown OID",
    input: makePemWithOidHex("deadbeef"),
    expected: "unknown",
  },
  {
    name: "detects ed25519 from Buffer",
    input: Buffer.from("3009062b6570", "hex"),
    expected: "ed25519",
  },
  {
    name: "returns unknown for random Buffer",
    input: Buffer.from("abcdef", "hex"),
    expected: "unknown",
  },
  {
    name: "handles PEM with whitespace and newlines",
    input: `-----BEGIN PRIVATE KEY-----
        ${Buffer.from("3009062b8104000a", "hex").toString("base64")}
        -----END PRIVATE KEY-----`,
    expected: "secp256k1",
  },
  {
    name: "detects secp256r1 from openssl PEM", // openssl ecparam -genkey -name secp256r1 -noout -out privateKey.pem
    input: `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIKaEnzmvCj7efkhRnX+tcTNdMBA+V4/n1+vq8iDgX9X7oAoGCCqGSM49
AwEHoUQDQgAEDnaJMM2b1f4X2Gk0IFSlaU6X2WduqZTwAfpBRN9vSlb96uS/p2l0
LXN2trScpqESIYJymzovHplo8jK5JHH0yw==
-----END EC PRIVATE KEY-----`,
    expected: "secp256r1",
  },
  {
    name: "detects secp256k1 from openssl PEM", // openssl ecparam -genkey -name secp256k1 -noout -out privateKey.pem
    input: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEICoQZ6WGYkdmH4zRC4CnAf2fhS36U2B+P+/4yNOLpZ8xoAcGBSuBBAAK
oUQDQgAEU86mZlGS0vrDnensRZP+j/f1a5ABdpMwUuujLf1V0xyDnya6JNQpCbAT
Q/HLcTaKv66DhgCXAOsr7ynIy17X9g==
-----END EC PRIVATE KEY-----`,
    expected: "secp256k1",
  },
  {
    name: "detects ed25519 from openssl PEM", // openssl genpkey -algorithm Ed25519 -out privateKey.pem
    input: `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOrNTK/ChGQUdwitzdtwnhxfaBgRhR7vQaUxwXWTptnL
-----END PRIVATE KEY-----`,
    expected: "ed25519",
  },
]

describe("KeypairService.detectKeyType", () => {
  cases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(KeypairService.detectKeyType(input)).toBe(expected)
    })
  })
})
