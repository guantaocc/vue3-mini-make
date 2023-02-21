import { hasChanged } from "../shared"
import { createDep } from "./dep"
import { trackEffects, triggerEffects } from "./effect"


class RefImpl {
  private _value: any
  public dep
  _rawValue: any
  constructor(value){
    this._value = value
    this._rawValue = value
    this.dep = createDep()
  }
  // get操作
  // 收集 effect 依赖
  get value(){
    trackRefValue(this)
    return this._value
  }
  // set操作
  // 触发依赖
  set value(newValue){
    if(hasChanged(newValue, this._rawValue)){
      this._value = newValue
      this._rawValue = newValue
      triggerRefValue(this)
    }
  }
}

export function trackRefValue(ref){
  // 需要判断是否 已经收集了依赖
  trackEffects(ref.dep)
}

export function triggerRefValue(ref){
  triggerEffects(ref.dep)
}

export function ref(value){
  return new RefImpl(value)
}