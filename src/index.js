/**
 * Imports
 */

import pit from '@weo-edu/pit'

/**
 * Exports
 */

export default function genMiddleware({dispatch}) {
  return next => action =>
    isGenerator(action) || isGeneratorFunction(action)
      ? pit(dispatch, action)
      : next(action)
}

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}
