import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v__isReative',
  IS_READONLY = '__v__isReadonly',
  RAW = "__v_raw",
}

export function reactive(raw: any){
  return new Proxy(raw, mutableHandlers)
}


export function readonly(raw: any){
  return new Proxy(raw, readonlyHandlers)
}

export function isReactive(value){
  return value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value){
  return value[ReactiveFlags.IS_READONLY]
}

export function toRaw(value){
  if (!value[ReactiveFlags.RAW]) {
    return value;
  }
  return value[ReactiveFlags.RAW]
}