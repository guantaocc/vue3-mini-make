export let activeEffect = void 0;

const targetMap = new Map()


export function track(target, key){
   // 收集依赖
   let depsMap = targetMap.get(target)
   if(!depsMap){
     depsMap = new Map()
     targetMap.set(target, depsMap)
   }

   let dep = depsMap.get(key)
   if(!dep){
     dep = new Set()
     depsMap.set(key, dep)
   }

   if (!dep.has(activeEffect)) {
     dep.add(activeEffect);
   }
}

export function trigger(target, key){
  // 触发依赖
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  dep.forEach((effect: any) => {
    // dep => activeEffect
    effect.run()
  })
}

class ReactiveEffect {
  public _fn: any;
  constructor(fn: any, scheduler?: any){
    this._fn = fn
  }
  run(){
    activeEffect = this as any
    const result = this._fn()
    return result
  }
}




export function effect(fn: any){
  let _effect = new ReactiveEffect(fn)
  _effect.run()
}