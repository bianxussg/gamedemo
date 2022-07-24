// import React from 'react';
// import ReactDOM from 'react-dom';
// import "babel-polyfill";
import "./index.css";
import App from "./App";
import dva from "dva";
// import * as serviceWorker from './serviceWorker';
// import { Provider } from 'react-redux';

// px2rem
// import 'lib-flexible/flexible'
import "antd/dist/antd.css";

//这种为hash路由展示方式
// const createHistory = require("history").createHashHistory
const createBrowserHistory = require("history").createBrowserHistory;

//下面是两种注入方式
const app = dva({
  history: createBrowserHistory(),
});

//const app=dva(createHistory);
app.model(require("./models").default);

app.router(App);

app.start("#root");

// ReactDOM.render(
//   <>
//     <App />
//   </>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
