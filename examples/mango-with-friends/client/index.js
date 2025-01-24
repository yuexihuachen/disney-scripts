function memoizedFunction() {
  const cache = {} // 缓存对象
  return function (arg) {
    if (cache[arg]) {
      console.log('从缓存中获取结果')
      return cache[arg]
    } else {
      console.log('进行计算')
      const result = ''
      cache[arg] = result // 将计算结果缓存起来
      return result
    }
  }
}

const memoized = memoizedFunction()

console.log(memoized(5)) // 进行计算并返回结果
console.log(memoized(5)) // 从缓存中获取结果
console.log(memoized(10)) // 进行计算并返回结果
console.log(memoized(10)) // 从缓存中获取结果
