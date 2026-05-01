// @ts-expect-error - hono is not a dependency of the SDK; install it in your project to run this example
import { serve } from "@hono/node-server"
// @ts-expect-error - hono is not a dependency of the SDK; install it in your project to run this example
import { Hono } from "hono"
import type { EDS_WebhookEvent } from "../../../src/services/channels/channels.types"

/**
 * Example: Receive webhook events from Ripple Custody with Hono
 *
 * Custody delivers each event as an `EDS_WebhookEvent` envelope:
 *   {
 *     traceId: string,            // W3C traceparent for correlation
 *     msg: Core_HarmonizeEvent    // payload is already a parsed object
 *   }
 *
 * NOTE: The URL registered on the channel must be reachable from the Custody
 * service. For local testing, run `ngrok http 3030` and register the
 * forwarded HTTPS URL (with the `/webhook` path) when calling
 * `custody.channels.create` — see `../create-channel/index.ts`.
 *
 * Run this file (e.g. `npx tsx examples/webhooks/receive-events/index.ts`),
 * then create the channel and trigger an intent to see events arrive.
 */
const app = new Hono()

// @ts-expect-error - hono types are unavailable here; `c` is implicitly any
app.post("/webhook", async (c) => {
  // @ts-expect-error - generic argument lands on an untyped `c.req.json` call without hono's types
  const event = await c.req.json<EDS_WebhookEvent>()

  console.dir(event, { depth: null })

  // Switch on the event variant — TypeScript narrows `payload` from the
  // `Core_HarmonizeEventPayload` union by its `type` discriminator.
  switch (event.msg.payload.type) {
    case "Core_IntentExecuted":
      console.log("Intent executed:", event.msg.payload)
      break
    case "Core_IntentClosed":
      console.log("Intent closed:", event.msg.payload)
      break
    default:
      console.log("Other event:", event.msg.payload.type)
  }

  return c.json({ received: true })
})

// @ts-expect-error - hono types are unavailable here; `info` is implicitly any
serve({ fetch: app.fetch, port: 3030 }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
