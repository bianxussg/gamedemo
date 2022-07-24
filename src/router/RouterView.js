import React from 'react';

import { routerConfig } from './index'
// import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Switch, Redirect, Route } from "dva/router"
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import './animatedSwitch.less'

const RouterView = () => {

  const getSwitch = () => {


    return routerConfig.map((item, index) => {
      if (item.redirect) {
        return <Redirect key={index} from={item.path} to={item.redirect}></Redirect>
      } else {
        return <Route key={index} path={item.path} render={(props) => {
          return <item.component children={item.children} {...props}></item.component>
        }}></Route>
      }
    })

  }

  return (
    <Route
      render={({ location }) => (
        <TransitionGroup  style={{height:'100%'}}>
          <CSSTransition
            // key={location.pathname}
            //classNames='fade'
            timeout={0}
          >
            <Switch location={location}>{getSwitch()}</Switch>
          </CSSTransition>
        </TransitionGroup>
      )}
    />
  );
}





export default RouterView;
