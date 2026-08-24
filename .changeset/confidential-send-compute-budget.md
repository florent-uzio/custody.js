---
"@florent-uzio/custody": patch
---

Give `xrpl.buildConfidentialSend` a compute budget that survives concurrency: the parameters computation now defaults to 40 attempts 3s apart (two minutes) instead of the 10 attempts 3s apart (thirty seconds) it inherited from the generic polling defaults.

Several `buildConfidentialSend` calls issued at once commonly failed, while the same calls made one after another succeeded. The cause is not a race in the SDK — it is the budget. A confidential parameters computation is queued and processed server-side, so N concurrent sends do not each take as long as one send does: the last one picked up waits behind all the others. Thirty seconds is a comfortable budget for a single compute and a tight one for the third or fourth in a burst, which is why the failure looked load-dependent and intermittent rather than deterministic.

The budget was always configurable through `options.polling` — the defaults were applied by `waitForParametersCompute`, not missing — but the failure gave the caller nothing to act on. It surfaced as `Confidential send computation for account … did not complete (status: Pending)`, which reads like the computation was rejected rather than still running. The error now names the budget it exhausted and says what to do about it:

```
Confidential send computation for account <id> (<address>) did not complete
(status: Pending) after 40 attempts 3000ms apart. A non-terminal status here
means the computation is still running — raise `options.polling.maxRetries`.
```

Only `buildConfidentialSend`'s default moves. `accounts.initiateParametersComputeAndWait` and every other `custody.xrpl` poll keep their 10-attempt default, and an explicit `options.polling` still wins field by field — passing `{ maxRetries: 100 }` alone keeps the 3s interval rather than resetting it.
