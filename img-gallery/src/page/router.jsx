import React from "react";
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./Home";
import CategoryPage from "./CategoryPage";

// for more information on react router: https://v5.reactrouter.com/web/guides/quick-start

const RouterPage = (props) => {
    return (
        <Router basename={encodeURI(props.pageInfo.basePath)}>
            <Switch>
                <Route path="/:category">
                    <CategoryPage {...props} />
                </Route>
                <Route exact path="/">
                    <Home {...props} />
                </Route>
            </Switch>
        </Router>
    );
};

RouterPage.propTypes = {
    pageInfo: PropTypes.object
};

export default RouterPage;