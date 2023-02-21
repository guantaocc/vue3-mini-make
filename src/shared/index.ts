export function isObject(value){
  return value !== null && typeof value === 'object'
}

export function hasChanged(newValue, value){
  return !Object.is(value, newValue)
}