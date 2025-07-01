export type ThresholdHandler = (
    eventName: string,
    count: number,
    windowMs: number,
) => void

export interface CounterOptions {
    threshold?: number
    windowMs?: number
    cleanupThreshold?: number
}

/**
 * Tracks events in a time window and logs fatal errors when frequency exceeds threshold.
 *
 * Default: 10 events in 10s window (1/s) triggers fatal log.
 *
 * Examples:
 * ```
 * // Default: Alert on 10+ events in 10s
 * const counter = new TimeWindowEventCounter("High latency detected", logHandler);
 *
 * // Alert on 10+ events in 1s (10/s rate)
 * const counter = new TimeWindowEventCounter("A lot of errors", logHandler, { threshold: 10, windowMs: 1000 });
 *
 * // Alert on 5+ events in 30s
 * const counter = new TimeWindowEventCounter("Too slow proxies", logHandler, { threshold: 5, windowMs: 30000 });
 * ```
 */
export class TimeWindowEventCounter {
    private timestamps: number[] = []
    private startIndex = 0

    private readonly threshold: number
    private readonly windowMs: number
    private readonly cleanupThreshold: number

    constructor(
        private readonly eventName: string,
        private readonly onThreshold: ThresholdHandler,
        opts: CounterOptions = {},
    ) {
        this.threshold = opts.threshold ?? 10
        this.windowMs = opts.windowMs ?? 10_000
        this.cleanupThreshold = opts.cleanupThreshold ?? 100
    }

    record(): void {
        const now = Date.now()
        this.timestamps.push(now)

        while (
            this.startIndex < this.timestamps.length &&
            now - this.timestamps[this.startIndex] > this.windowMs
            )
            this.startIndex++

        const inWindow = this.timestamps.length - this.startIndex
        if (inWindow >= this.threshold)
            this.onThreshold(this.eventName, inWindow, this.windowMs)

        if (this.startIndex > this.cleanupThreshold) {
            this.timestamps = this.timestamps.slice(this.startIndex)
            this.startIndex = 0
        }
    }
}
