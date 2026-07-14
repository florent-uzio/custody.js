import type { components, operations } from "../models/custody-types.js"

// Request types
export type GetEventsPathParams = operations["getEvents"]["parameters"]["path"]
export type GetEventsQueryParams = operations["getEvents"]["parameters"]["query"]

// Response types
export type Core_EventsCollection = components["schemas"]["Core_EventsCollection"]
export type Core_HarmonizeEvent = components["schemas"]["Core_HarmonizeEvent"]
export type Core_HarmonizeEventPayload = components["schemas"]["Core_HarmonizeEventPayload"]
export type Core_EventScope = components["schemas"]["Core_EventScope"]
