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