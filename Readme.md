
# redux-gen

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Generator middleware for redux. Allows you to write action creators that return generators, enabling apps to push all side effects into a small set of effects middleware.

## Installation

    $ npm install @weo-edu/redux-gen

## Pushing side effects

```js
import { createStore, applyMiddleware } from 'redux'
import gen from '@weo-edu/redux-gen'
import rootReducer from './reducers/index'
import fetch from 'isomorphic-fetch'

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  gen()
  fetch
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

store.dispatch(getUser())

// Side Effects Middleware

function fetch ({dispatch, getState}) {
  return next => action =>
    action.type === 'FETCH'
      ? fetch(action.payload.url, action.payload.params).then(res => res.json())
      : next(action)
}


// Actions

function getUsers *() {
  var userIds = yield {url: '/users', method: 'GET'}
  return userIds.map(userId => {
    return yield {url: '/user/' + userId, method: 'GET'}
  })
}

```

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
