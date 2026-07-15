import type { EDS_ChannelCreate } from "@florent-uzio/custody"
import { RippleCustody } from "@florent-uzio/custody"

/**
 * Example: Create a webhook channel on Ripple Custody
 *
 * Ripple Custody delivers events to a webhook channel by POSTing them to the
 * `url` you register here. The URL must be publicly reachable from the Custody
 * service — for local development, expose your local server with a tunnel
 * (e.g. `ngrok http 3030`) and use the forwarded HTTPS URL below.
 *
 * Custody does not sign or otherwise authenticate webhook deliveries, so the
 * `token` query param below is a secret you choose yourself; the paired
 * `../receive-events/index.ts` example verifies it on receipt with
 * `verifyWebhookSecret`.
 *
 * Pair this example with `../receive-events/index.ts`, which runs a Hono
 * server on port 3030 and prints each delivered event.
 */
const createWebhookChannel = async () => {
  try {
    // Initialize the Ripple Custody client with API endpoints and authentication keys
    // The private and public keys should be securely stored in environment variables
    const custody = new RippleCustody({
      apiUrl: "https://custody-api-url",
      authUrl: "https://custody-auth-url/token",
      privateKey: process.env.PRIVATE_KEY ?? "",
      publicKey: process.env.PUBLIC_KEY ?? "",
    })

    // Retrieve the domain ID and the current user ID — `createdBy` must be a
    // user that exists in the domain
    const me = await custody.users.me()
    const domain = me.domains[0]
    if (!domain) throw new Error("No domain found for this user")
    const domainId = domain.id
    const createdBy = domain.userReference.id

    const body: EDS_ChannelCreate = {
      // Generate a fresh UUID for each channel; reusing one will conflict
      id: "0d6b3b4a-3a7e-4d4c-8e8a-2a3a3b3c3d3e",
      name: "My webhook channel",
      type: "WEBHOOK",
      // Replace with your publicly reachable HTTPS URL (e.g. an ngrok forward)
      // pointing at the `/webhook` route exposed by `../receive-events`, with
      // a secret `token` of your own choosing appended as a query param
      url: `https://<your-ngrok-subdomain>.ngrok-free.app/webhook?token=${process.env.WEBHOOK_SECRET ?? ""}`,
      // Subscribe to the event variants you care about. `Core_HarmonizeEventPayload["type"]`
      // is auto-completed by TypeScript — narrow it to just the events your
      // webhook handler is built to process.
      supportedEventTypes: ["TransactionCreated", "TransactionUpdated"],
      createdBy,
    }

    const channel = await custody.channels.create({ domainId }, body)

    // The created channel is returned with its server-assigned fields
    console.dir(channel, { depth: null })

    // Optional: ask Custody to send a test event to verify the URL is reachable
    if (channel.id) {
      await custody.channels.test({ domainId, channelId: channel.id })
    }
  } catch (error) {
    console.log(error)
  }
}
