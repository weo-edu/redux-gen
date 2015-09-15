/**
 * Imports
 */

import assert from 'assert'
import pit from '@weo-edu/pit'
import is from '@weo-edu/is'


/**
 * Exports
 */

export default function genMiddleware(errorHandler=defaultErrorHandler, successHandler=identity) {
  return ({dispatch}) => next => action =>
    is.generator(action) || is.generatorFunction(action)
      ? pit(dispatch, action).then(successHandler, errorHandler)
      : next(action)
}

function identity (v) {
  return v
}

function defaultErrorHandler (err) {
  assert(err instanceof Error, 'non-error thrown: ' + err)

  var msg = err.stack || err.toString()
  console.error()
  console.error(msg.replace(/^/gm, '  '))
  console.error()
  throw err
}
