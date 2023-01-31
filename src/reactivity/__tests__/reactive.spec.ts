import { reactive } from "../reactive";

describe('reactivity', () => {
  it('happy path', () => {
    const obj = {foo: 1}
    const proxyObj = reactive(obj)
    expect(obj).not.toBe(proxyObj)
    
    expect(proxyObj.foo).toBe(1)

    proxyObj.foo++
    expect(proxyObj.foo).toBe(2)
  });
});