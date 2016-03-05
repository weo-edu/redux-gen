
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

// Note: passing middleware as the last argument to createStore requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(gen(), fetch)
);

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

function getUsers * () {
  let userIds = yield {url: '/users', method: 'GET', type: 'FETCH'}
  return yield userIds.map(userId => ({url: '/user/' + userId, method: 'GET', type: 'FETCH'}))
}

```


## License

MIT
