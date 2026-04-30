import type { components, operations } from "../../models/custody-types.js"
import type { Prettify } from "../../type-utils/index.js"

// Path-param types
export type GetChannelsPathParams = operations["getAllChannels"]["parameters"]["path"]
export type GetChannelPathParams = operations["getChannel"]["parameters"]["path"]
export type CreateChannelPathParams = operations["createChannel"]["parameters"]["path"]
export type UpdateChannelPathParams = operations["updateChannel"]["parameters"]["path"]
export type DeleteChannelPathParams = operations["deleteChannel"]["parameters"]["path"]
export type TestChannelPathParams = operations["testChannel"]["parameters"]["path"]
export type GetChannelEventsPathParams = operations["getAllChannelEvents"]["parameters"]["path"]
export type GetChannelEventPathParams = operations["getEvent"]["parameters"]["path"]
export type GetAllChannelsEventsPathParams = operations["getAllEvents"]["parameters"]["path"]

// Response / body types
export type EDS_Channel = components["schemas"]["EDS_Channel"]
export type EDS_Event = components["schemas"]["EDS_Event"]
export type EDS_ChannelUpdate = components["schemas"]["EDS_ChannelUpdate"]
// The generated `components["schemas"]["EDS_WebhookChannelCreate"]` is uninhabited:
// the spec's discriminator has no `mapping`, so openapi-typescript injects
// `type: "EDS_WebhookChannelCreate"` and intersects it with the allOf branch's
// `type?: "WEBHOOK"`, collapsing `type` to `never`. Compose from the generated
// base instead.
export type EDS_WebhookChannelCreate = Omit<components["schemas"]["EDS_ChannelCreate"], "type"> & {
  type: "WEBHOOK"
  url: string
}

/**
 * Request body for `channels.create`. Modeled as a discriminated union so new
 * channel types (e.g. non-WEBHOOK) can be added without a breaking change.
 */
export type EDS_ChannelCreate = Prettify<EDS_WebhookChannelCreate>
