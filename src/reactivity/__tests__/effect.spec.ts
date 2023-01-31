import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
  it('should observe basic properties', () => {
    const obj = {foo: 1}
    let original
    effect(() => {
      original = obj.foo + 1
    })
    expect(original).toBe(2)

  });

  it('should observe multiple properties', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

    expect(dummy).toBe(0)
    counter.num1 = counter.num2 = 7
    expect(dummy).toBe(21)
  })


  it('effect should set', () => {
    const obj = reactive({foo: 1})
    let original
    effect(() => {
      original = obj.foo + 1
    })
    expect(original).toBe(2)
    obj.foo++
    expect(original).toBe(3)
  })

  it('should observe delete operations', () => {
    let dummy
    const obj = reactive({ prop: 'value' })
    effect(() => (dummy = obj.prop))

    expect(dummy).toBe('value')
    delete obj.prop
    expect(dummy).toBe(undefined)
  })

  
  it('should discover new branches when running manually', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner: any = effect(() => {
      dummy = obj.prop + 1
      return 'result'
    })
    expect(dummy).toBe(2)
    let b = runner()
    expect(b).toBe('result')
    obj.prop++
    expect(dummy).toBe(3)
  })

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner: any = effect(() => {
      dummy = obj.prop
    })

    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)
    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
});