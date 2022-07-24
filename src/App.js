import React, { Suspense, useEffect } from 'react';

import './App.css';
import { Skeleton } from 'antd';
import { Router } from "dva/router"
import RouterView from "./router/RouterView"


function App({ history }) {
  return <Router history={history}>
    <Suspense fallback={<div><Skeleton /></div>}>
      <RouterView ></RouterView>
    </Suspense>
  </Router>
}

export default App;
