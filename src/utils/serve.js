import * as math from "mathjs"

// 深度拷贝
export function deepClone(source) {
	if (!source && typeof source !== 'object') {
    console.log('error arguments', 'shallowClone')
  }
  let targetObj = Array.isArray(source) ? [] : {}
  for (const keys in source) {
    if (Object.prototype.hasOwnProperty.call(source, keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = Array.isArray(source[keys]) ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/* 判断是否为空 */
export function isEmpty (obj) {
  switch (typeof obj) {
    case 'undefined':
      return true
    case 'string':
      return (obj.trim().length === 0)
    case 'object':
      if (Array.isArray(obj)) {
        return (obj.length === 0)
      } else if (obj === undefined) {
        return true
      } else if (obj === null) {
        return true
      } else if (Object.keys(obj).length === 0) {
        return true
      } else {
        return false
      }
    case 'number':
      if (isNaN(obj)) {
        return true
      } else {
        return false
      }
  }
}
/*
math.sqrt(4) 开方
math.add( ) 加
math.subtract( )减
math.divide( ) 除
math.multiply( )乘
*/
/* 乘法 */
export function multiplyCount (x, y) {
  return parseFloat(math.format(math.multiply(math.bignumber(x), math.bignumber(y).valueOf())));
}
