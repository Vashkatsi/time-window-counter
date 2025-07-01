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

## API

| param | type | default | description |
|-------|------|---------|-------------|
| eventName | string | – | label sent to the handler |
| onThreshold | (name,count,windowMs)=>void | – | invoked when count ≥ threshold |
| threshold | number | 10 | events required to trigger handler |
| windowMs | number | 10000 | sliding-window length in milliseconds |
| cleanupThreshold | number | 100 | array trim point for memory safety |

MIT © Your Name
