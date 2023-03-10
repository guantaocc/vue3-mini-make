import { isObject } from "../shared"
import { track, trigger } from "./effect"

import { ReactiveFlags, reactive } from "./reactive"

export function createGetter(isReadOnly = false){
  return function(target, key){
    const res = Reflect.get(target, key)
    if(key === ReactiveFlags.IS_REACTIVE){
      return !isReadOnly
    }
    if(key === ReactiveFlags.IS_READONLY){
      return isReadOnly
    }
    if(key === ReactiveFlags.RAW){
      return target
    }
    if(isObject(target[key])){
      return reactive(target[key])
    }
    
    if(!isReadOnly){
      track(target, key)
    }
    return res
  }
}

export function createSetter(){
  return function (target, key, value){
    const res =  Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)


export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value){
    console.warn(`${target} is not to be set`)
    return true
  }
}