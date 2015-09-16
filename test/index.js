/**
 * Imports
 */

import test from 'tape'
import reduxGen from '../src'
import is from '@weo-edu/is'
import {stderr} from 'test-console'
import {AssertionError} from 'assert'


/**
 * Tests
 */

var log = []
const doDispatch = (v) => {
  log.push(v)
}
const nextHandler = reduxGen()({dispatch: doDispatch})

const wrapEach = function(fn) {
  return function(t) {
    // before
    log = []
    fn(t)
    //after
  }
}

test('must return a function to handle next', t => {
  t.plan(2)
  t.ok(is.function(nextHandler))
  t.equal(nextHandler.length, 1)
})

test('handle next must return a function to handle action', t => {
  t.plan(2)

  const actionHandler = nextHandler()
  t.ok(is.function(actionHandler))
  t.equal(actionHandler.length, 1)
})

test('must run the given action generator function with dispatch', wrapEach(t => {
  t.plan(1)

  const actionHandler = nextHandler();

  actionHandler(function *() {
    yield 'foo'
    t.deepEqual(log, ['foo'])
  })

}))

test('must run the given action generator with dispatch', wrapEach(t => {
  t.plan(1)

  const actionHandler = nextHandler();

  actionHandler((function *() {
    yield 'foo'
    t.deepEqual(log, ['foo'])
  })())

}))

test('must pass acton to next if not a generator', wrapEach(t => {
  t.plan(1)

  const actionObj = {}

  const actionHandler = nextHandler(action => {
    t.equal(action, actionObj)
  })

  actionHandler(actionObj)
}))

test('must return the return value if not a generator', wrapEach(t => {
  t.plan(1)

  const expected = 'foo'
  const actionHandler = nextHandler(() => expected)

  let outcome = actionHandler()
  t.equal(outcome, expected)
}))

test('must return promise if a generator', wrapEach(t => {
  t.plan(1)

  const expected = 'foo'
  const actionHandler = nextHandler()

  let promise = actionHandler(function *() {
    return expected
  })
  promise.then(function(outcome) {
    t.equal(outcome, expected)
  })
}))

test('must throw error if argument is non-object', wrapEach(t => {
  t.plan(1)

  t.throws(() => reduxGen()())
}))

test('must log errors to stderr', t => {
  t.plan(1)

  const dispatch = () => {
    var err = new Error()
    err.stack = 'Foo'
    throw err
  }
  const nextHandler = reduxGen()({dispatch: dispatch})
  const actionHandler = nextHandler()

  let inspect = stderr.inspect()

  actionHandler(function *() {
    yield 'foo'
  }).catch(function() {
    t.deepEqual(inspect.output, ["\n", "  Foo\n", "\n"])
    inspect.restore()
  })

})

test('must allow custom error handler', t => {
  t.plan(2)


  const dispatch = () => {
    var err = new Error()
    err.stack = 'Foo'
    throw err
  }

  let handlerCalled = false
  const errorHandler = () => {
    console.log('error handler')
    handlerCalled = true
  }

  const nextHandler = reduxGen(errorHandler)({dispatch: dispatch})
  const actionHandler = nextHandler()

  let inspect = stderr.inspect()

  actionHandler(function *() {
    yield 'foo'
  }).then(function() {
    t.deepEqual(inspect.output, [])
    t.equal(handlerCalled, true)
    inspect.restore()
  })
})

test('must throw error when non error given', t => {
  t.plan(2)

  const dispatch = () => {
    throw 'foo'
  }
  const nextHandler = reduxGen()({dispatch: dispatch})
  const actionHandler = nextHandler()

  actionHandler(function *() {
    yield 'foo'
  }).catch(function(err) {
    t.ok(err instanceof AssertionError)
    t.equal(err.message, 'non-error thrown: foo')
  })
})
