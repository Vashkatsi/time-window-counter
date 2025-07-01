import { TimeWindowEventCounter, ThresholdHandler } from '../src'

const mockHandler = (): [jest.Mock, ThresholdHandler] => {
  const fn = jest.fn()
  return [fn, fn]
}

describe('TimeWindowEventCounter', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('fires exactly at threshold', () => {
    const [mock, handler] = mockHandler()
    const c = new TimeWindowEventCounter('e', handler, { threshold: 3, windowMs: 1000 })
    c.record()
    c.record()
    expect(mock).not.toHaveBeenCalled()
    c.record()
    expect(mock).toHaveBeenCalledWith('e', 3, 1000)
  })

  it('respects window boundaries', () => {
    const [mock, handler] = mockHandler()
    const c = new TimeWindowEventCounter('e', handler, { threshold: 3, windowMs: 1000 })
    c.record()
    c.record()
    jest.advanceTimersByTime(1001)
    c.record()
    expect(mock).not.toHaveBeenCalled()
  })

  it('handles bursting twice', () => {
    const [mock, handler] = mockHandler()
    const c = new TimeWindowEventCounter('e', handler, { threshold: 2, windowMs: 10000 })
    c.record()
    c.record()
    c.record()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})