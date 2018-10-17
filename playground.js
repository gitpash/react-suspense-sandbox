import React from 'react';
import ReactDOM from 'react-dom';
// import {createCache, createResource} from 'simple-cache-provider';


// create a cache where we can store loaded result from request
const cache = { 
  map: {},
  read(resourceType, key, loadResource) {
    if (cache.map[key]) {
      console.log('cache', cache);
      return cache.map[key];
    }
    const suspender = loadResource(key).then(res => {
      cache.map[key] = res;
      return res;
    });
    console.log('suspender: ', suspender);

    throw suspender;
  },
  preload(resource, key, loadResource) {
    loadResource(key).then(res => (cache.map[key] = res));
  },
};

// create an obj which React could read async when data will be loaded;
const createResource = loader => {
  const resource = {
    read(cache, key) {
      return cache.read(resource, key, loader);
    },
    preload(cache, key) {
      return cache.preload(resource, key, loader);
    },
  };
  return resource;
};

const loadData = id => delay(2000, `${id} was loaded`);
const myResource = createResource(loadData);

const delay = (timeout, resValue = Math.Random()) =>
  new Promise(res => {
    setTimeout(() => {
      res(resValue);
    }, timeout);
  });

function Susp() {
  // preload req data if we for sure will need it
  myResource.preload(cache, 'req-data');
  myResource.preload(cache, 'other-data');

  const loadedItem = myResource.read(cache, 'req-data');
  const otherItem = myResource.read(cache, 'other-data');
  return (
    <div>
      <div>{loadedItem}</div>
      <div>{otherItem}</div>
    </div>
  );
}
function App() {
  return (
    <React.unstable_Suspense fallback="fetching your data...">
      <Susp />
    </React.unstable_Suspense>
  );
}
ReactDOM.render(<App />, document.getElementById('yay'));
