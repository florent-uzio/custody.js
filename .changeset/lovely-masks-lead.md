---
"custody": patch
---

The generated EDS_WebhookChannelCreate collapsed to never because the spec's discriminator carries no mapping, so openapi-typescript injects type: "EDS_WebhookChannelCreate" and intersects it with the allOf branch's type?: "WEBHOOK". Compose the type from the generated EDS_ChannelCreate base instead, dropping the poisoned type field and re-pinning it to "WEBHOOK".
