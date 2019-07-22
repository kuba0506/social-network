import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navabr from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import setAuthToken from './utils/setAuthToken';

// Redux
import { Provider } from 'react-redux'; // connects react and redux
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';

setAuthToken();

const App = () => {
    useEffect(() => {
        if (localStorage.getItem('token')) store.dispatch(loadUser());
    }, []); // only run once act like componetDidMount

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navabr />
                    <Route exact path="/" component={Landing} />
                    <Route component={Routes}/>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
