import { effect } from "../effect";
import { reactivity } from "../reactivity";

describe('effect', () => {
  it('effect should get', () => {
    const obj = {foo: 1}
    let original
    effect(() => {
      original = obj.foo + 1
    })
    expect(original).toBe(2)

  });
  it('effect should set', () => {
    const obj = reactivity({foo: 1})
    let original
    effect(() => {
      original = obj.foo + 1
    })
    expect(original).toBe(2)
    obj.foo++
    expect(original).toBe(3)
  })
});