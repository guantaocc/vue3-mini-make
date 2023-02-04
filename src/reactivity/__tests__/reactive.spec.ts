import { isReactive, isReadonly, reactive, readonly } from "../reactive";

describe('reactivity', () => {
  it('happy path', () => {
    const obj = {foo: 1}
    const proxyObj = reactive(obj)
    expect(obj).not.toBe(proxyObj)
    expect(proxyObj.foo).toBe(1)
    proxyObj.foo++
    expect(proxyObj.foo).toBe(2)
  });

  it('obj is readonly', () => {
    console.warn = jest.fn()
    let dummy = readonly({ foo: 1})
    expect(dummy.foo).toBe(1)
    dummy.foo = 2
    expect(console.warn).toBeCalled()
  });

  it('is reactive', () => {
    let dummy = reactive({ foo: 1})
    expect(isReactive(dummy)).toBe(true)
  });

  it('should is readonly', () => {
    let dummy = readonly({foo: 1})
    expect(isReadonly(dummy)).toBe(true)
  });
});