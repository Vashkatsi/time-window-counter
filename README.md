# Time Window Counter

Lightweight sliding-window counter that calls **your** handler when event
frequency crosses a threshold.

```ts
import { TimeWindowEventCounter } from '@vashkatsi/time-window-counter'

// Create a simple handler function
const logHandler = (name, count, windowMs) => {
  console.log(`Alert: ${name} occurred ${count} times within ${windowMs}ms window`)
}

const counter = new TimeWindowEventCounter(
  'High latency',
  logHandler,
  { threshold: 10, windowMs: 5000 },
)

counter.record() // call wherever the event occurs
```

## Examples

```ts
// Default: Alert on 10+ events in 10s
const counter1 = new TimeWindowEventCounter(
  "High latency detected",
  logHandler
);

// Alert on 10+ events in 1s (10/s rate)
const counter2 = new TimeWindowEventCounter(
  "A lot of errors",
  logHandler,
  { threshold: 10, windowMs: 1000 }
);

// Alert on 5+ events in 30s
const counter3 = new TimeWindowEventCounter(
  "Too slow proxies",
  logHandler,
  { threshold: 5, windowMs: 30000 }
);
```

## API

| param | type | default | description |
|-------|------|---------|-------------|
| eventName | string | – | label sent to the handler |
| onThreshold | (name,count,windowMs)=>void | – | invoked when count ≥ threshold |
| threshold | number | 10 | events required to trigger handler |
| windowMs | number | 10000 | sliding-window length in milliseconds |
| cleanupThreshold | number | 100 | array trim point for memory safety |

BSD 3-Clause License © Vashkatsi
