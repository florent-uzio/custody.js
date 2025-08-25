import { KeypairService } from "./keypair.service.js"

// Example: Generate and use secp256r1 keypair
async function secp256r1Example() {
  console.log("🔐 Secp256r1 Keypair Example")
  console.log("=".repeat(40))

  // 1. Generate secp256r1 keypair
  const secp256r1Service = new KeypairService("secp256r1")
  const keypair = secp256r1Service.generate()

  console.log("✅ Generated secp256r1 keypair:")
  console.log("Private Key (PEM):", keypair.privateKey.substring(0, 50) + "...")
  console.log("Public Key (Base64):", keypair.publicKey.substring(0, 50) + "...")
  console.log()

  // 2. Sign a message
  const message = '{"action": "transfer", "amount": "100", "currency": "XRP"}'
  const signature = secp256r1Service.sign(keypair.privateKey, message)

  console.log("✅ Signed message:")
  console.log("Message:", message)
  console.log("Signature (Base64):", signature)
  console.log()

  // 3. Detect key type
  const detectedType = KeypairService.detectKeyType(keypair.privateKey)
  console.log("✅ Detected key type:", detectedType)

  return { keypair, signature, detectedType }
}

// Run the example
secp256r1Example()
  .then((result) => {
    console.log("\n🎉 Secp256r1 example completed successfully!")
    console.log("Key type detected:", result.detectedType)
  })
  .catch((error) => {
    console.error("❌ Error:", error.message)
  })
