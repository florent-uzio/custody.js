import { URLs } from "../constants/urls.js"
import type { TypedTransport } from "../transport/index.js"
import type {
  Core_EventsCollection,
  GetEventsPathParams,
  GetEventsQueryParams,
} from "./events.types.js"

export function createEvents(t: TypedTransport) {
  return {
    list: (
      params: GetEventsPathParams,
      query?: GetEventsQueryParams,
    ): Promise<Core_EventsCollection> => t.get(URLs.events, params, query),
  } as const
}
