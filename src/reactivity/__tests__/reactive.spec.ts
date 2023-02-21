import { isReactive, isReadonly, reactive, readonly, toRaw } from "../reactive";

describe('reactivity', () => {
  it('happy path', () => {
    const obj = {foo: 1}
    const proxyObj = reactive(obj)
    expect(obj).not.toBe(proxyObj)
    expect(proxyObj.foo).toBe(1)
    proxyObj.foo++
    expect(proxyObj.foo).toBe(2)
  });

  it("nested reactives", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
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

  test("toRaw", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(toRaw(observed)).toBe(original);
    expect(toRaw(original)).toBe(original);
  });
});