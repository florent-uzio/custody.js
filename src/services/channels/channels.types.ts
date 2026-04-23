import type { components, operations } from "../../models/custody-types.js"

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
export type EDS_WebhookChannelCreate = components["schemas"]["EDS_WebhookChannelCreate"]
