import React from 'react';
import ReactDOM from 'react-dom';
import {createCache, createResource} from 'simple-cache-provider';

// create a cache where we can store loaded result from request
const cache = createCache();

const loadData = id => delay(1000, `${id}-value`);
// create an obj which React could read async when data will be loaded;
const myResource = createResource(loadData);

const delay = (timeout, resValue = Math.Random()) =>
  new Promise(res => {
    setTimeout(() => {
      res(resValue);
    }, timeout);
  });

function Susp() {
  const resultPromise = myResource.read(cache, 'req-data');
  return <div>{resultPromise}</div>;
}
function App() {
  return <Susp />;
}
ReactDOM.render(<App />, document.getElementById('yay'));
// <React.Placeholder fallback="loading...">
//       <Susp />
//     </React.Placeholder>