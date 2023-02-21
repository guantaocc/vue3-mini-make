export let activeEffect: any;

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

   trackEffects(dep)
}

export function trackEffects(dep){
  if (!dep.has(activeEffect) && activeEffect) {
    // 在effect上挂载 deps进行删除
    dep.add(activeEffect);
    (activeEffect as any).deps.push(dep);
  }
}


export function triggerEffects(dep) {
  // 执行收集到的所有的 effect 的 run 方法
  for (const effect of dep) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}


export function trigger(target, key){
  // 触发依赖
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function stop(runner: any){
  runner.effect.stop()
}

// 将要清除的effect依赖进行删除
function cleanupEffect(effect){
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}


class ReactiveEffect {
  public _fn: any;
  deps = [];
  constructor(fn: any, public scheduler?: any){
    this._fn = fn
    this.scheduler = scheduler
  }
  run(){
    activeEffect = this as any
    const result = this._fn()
    return result
  }
  stop(){
    cleanupEffect(this)
  }
}




export function effect(fn: any, options: any = {}){
  const { scheduler } = options
  let _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()
  let runner = _effect.run.bind(_effect) 
  runner.effect = _effect
  return runner
}