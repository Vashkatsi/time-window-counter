// @ts-ignore
import {ThresholdHandler, TimeWindowEventCounter} from "../src";

const mockHandler = (): [jest.Mock, ThresholdHandler] => {
    const fn = jest.fn()
    return [fn, fn]
}

describe('TimeWindowEventCounter', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it('fires exactly at threshold', () => {
        const [mock, handler] = mockHandler()
        const c = new TimeWindowEventCounter(handler, {threshold: 3, windowMs: 1000})
        c.record()
        c.record()
        expect(mock).not.toHaveBeenCalled()
        c.record()
        expect(mock).toHaveBeenCalledWith(3, 1000)
    })

    it('respects window boundaries', () => {
        const [mock, handler] = mockHandler()
        const c = new TimeWindowEventCounter(handler, {threshold: 3, windowMs: 1000})
        c.record()
        c.record()
        jest.advanceTimersByTime(1001)
        c.record()
        expect(mock).not.toHaveBeenCalled()
    })

    it('handles bursting twice', () => {
        const [mock, handler] = mockHandler()
        const c = new TimeWindowEventCounter(handler, {threshold: 2, windowMs: 10000})
        c.record()
        c.record()
        c.record()
        expect(mock).toHaveBeenCalledTimes(2)
    })

    it('cleans up old timestamps when exceeding cleanupThreshold', () => {
        const [mock, handler] = mockHandler()
        const c = new TimeWindowEventCounter(handler, {
            threshold: 2,
            windowMs: 1000,
            cleanupThreshold: 3
        })

        for (let i = 0; i < 4; i++) {
            c.record()
        }

        jest.advanceTimersByTime(1001)

        c.record()

        c.record()
        expect(mock).toHaveBeenCalledWith(2, 1000)
    })

    it('uses default values when options are not provided', () => {
        const [mock, handler] = mockHandler()
        const c = new TimeWindowEventCounter(handler)

        for (let i = 0; i < 10; i++) {
            c.record()
        }

        expect(mock).toHaveBeenCalledWith(10, 10000)
    })
})
