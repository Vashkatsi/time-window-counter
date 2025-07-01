# Time Window Counter

[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vashkatsi/time-window-counter)
[![npm](https://img.shields.io/npm/dm/@vashkatsi/time-window-counter.svg)](https://www.npmjs.com/package/@vashkatsi/time-window-counter)

Lightweight sliding-window counter that calls **your** handler when event
frequency crosses a threshold.

```ts
import { TimeWindowEventCounter } from '@vashkatsi/time-window-counter'

// Create a simple handler function
const logHandler = (count, windowMs) => {
  console.log(`Alert: Event occurred ${count} times within ${windowMs}ms window`)
}

const counter = new TimeWindowEventCounter(
  logHandler,
  { threshold: 10, windowMs: 5000 },
)

counter.record() // call wherever the event occurs
```

## Examples

```ts
// Default: Alert on 10+ events in 10s
const counter1 = new TimeWindowEventCounter(
  logHandler
);

// Alert on 10+ events in 1s (10/s rate)
const counter2 = new TimeWindowEventCounter(
  logHandler,
  { threshold: 10, windowMs: 1000 }
);

// Alert on 5+ events in 30s
const counter3 = new TimeWindowEventCounter(
  logHandler,
  { threshold: 5, windowMs: 30000 }
);
```

## API

| param | type | default | description |
|-------|------|---------|-------------|
| onThreshold | (count,windowMs)=>void | – | invoked when count ≥ threshold |
| threshold | number | 10 | events required to trigger handler |
| windowMs | number | 10000 | sliding-window length in milliseconds |
| cleanupThreshold | number | 100 | array trim point for memory safety |

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Submit a pull request

### Publishing

To publish the package to npm, you need to set up an NPM_TOKEN secret in the GitHub repository. See [SETUP_NPM_TOKEN.md](SETUP_NPM_TOKEN.md) for instructions.

BSD 3-Clause License © Vashkatsi
