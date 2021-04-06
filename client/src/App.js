import React, {Suspense} from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

import 'App.css'

import Home from 'pages/Home/Home';

  
const App = () => { 
  const asyncMain = React.lazy(() => import(/* webpackPrefetch: true */ "pages/Main/Main"));
  
  return (  
    <Suspense fallback={<h3 className="App__Loader">Loading...</h3>}>
      <Switch>  
        <Route path="/main" component={asyncMain} />
        <Route path="/" exact component={Home} />  
        <Redirect to="/" /> 
      </Switch>
    </Suspense> 
  );
}

export default App;
