import React from "react";
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./Home";
import CategoryPageWithHook from "./CategoryPageWithHook";

// for more information on react router: https://v5.reactrouter.com/web/guides/quick-start

const RouterPage = (props) => {
    return (
        <Router basename={encodeURI(props.pageInfo.basePath)}>
            <Switch>
                <Route exact path="/">
                    <Home {...props} />
                </Route>
                <Route path="/:category">
                    <CategoryPageWithHook {...props} />
                </Route>
            </Switch>
        </Router>
    );
};

RouterPage.propTypes = {
    pageInfo: PropTypes.object
};

export default RouterPage;