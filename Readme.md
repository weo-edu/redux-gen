
# redux-gen

[![Codeship Status for weo-edu/redux-gen](https://img.shields.io/codeship/816e83f0-3e69-0133-9f44-5a0949beaeb8/master.svg)](https://codeship.com/projects/102760) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Generator middleware for redux. Allows you to write action creators that return generators, enabling apps to push all side effects into a small set of effects middleware.

## Installation

    $ npm install redux-gen

## Usage

Push side effects to edges by putting all io in middleware.

```js
import { createStore, applyMiddleware } from 'redux'
import gen from 'redux-gen'
import rootReducer from './reducers/index'
import fetch from 'isomorphic-fetch'

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  gen()
  fetch
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

// returns [
//  {username: "josh", id: 1},
//  {username: "tio", id: 2},
//  {username: "shasta", id: 3}
// ]
store.dispatch(getUsers())

// Side Effects Middleware

function fetch ({dispatch, getState}) {
  return next => action =>
    action.type === 'FETCH'
      ? fetch(action.payload.url, action.payload.params).then(res => res.json())
      : next(action)
}

// Actions

function getUsers *() {
  var userIds = yield {url: '/users', method: 'GET', type: 'FETCH'}
  return userIds.map(userId => {
    return yield {url: '/user/' + userId, method: 'GET', type: 'FETCH'}
  })
}

```

In order to avoid writing action creators as actual GeneratorFunction, we can use libraries like [yields](https://github.com/weo-edu/yields), which returns functions that return generators. Yields parallels the control flow that can be achieved with GeneratorFunctions, but enforces that the functions are pure. Since the action creators have no side effects they can easily be tested by iterating over the generator returned by an action.

In the previous example, using this action would be equivalent.

```js
import yields from '@weo-edu/yield'
var getUsers = yields(function () {
  return {url: '/users', method: 'GET', type: 'FETCH'}
}).yields(function (userIds) {
  return userIds.map(userId => {
    return {url: '/user/' + userId, method: 'GET', type: 'FETCH'}
  })
})
```

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
