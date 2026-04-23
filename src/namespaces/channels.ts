import { URLs } from "../constants/urls.js"
import type {
  EDS_Channel,
  EDS_Event,
  GetAllChannelsEventsPathParams,
  GetChannelEventPathParams,
  GetChannelEventsPathParams,
  GetChannelPathParams,
  GetChannelsPathParams,
} from "../services/channels/channels.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createChannels(t: TypedTransport) {
  return {
    list: (params: GetChannelsPathParams): Promise<EDS_Channel[]> => t.get(URLs.channels, params),

    get: (params: GetChannelPathParams): Promise<EDS_Channel> => t.get(URLs.channel, params),

    listEvents: (params: GetChannelEventsPathParams): Promise<EDS_Event[]> =>
      t.get(URLs.channelEvents, params),

    getEvent: (params: GetChannelEventPathParams): Promise<EDS_Event> =>
      t.get(URLs.channelEvent, params),

    listAllEvents: (params: GetAllChannelsEventsPathParams): Promise<EDS_Event[]> =>
      t.get(URLs.channelsEvents, params),
  } as const
}
