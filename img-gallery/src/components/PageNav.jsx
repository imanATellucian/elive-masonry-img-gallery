import React from 'react';
import PropTypes, { string } from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    Tabs,
    Tab
} from '@ellucian/react-design-system/core';


const styles = () => ({
    tabs: {
        display: 'block',
        marginBottom: '30px'
    }
});

const PageNav = (props) => {
    const { classes, categories, category, setCategory, navigateToPage } = props;
    const value = categories.indexOf(category);
    const handleChange = (event, value) => {
        navigateToPage({route: categories[value]});
        setCategory(categories[value]);
    }
    return (
        <div classeName={classes.tabs}>
            <Tabs
                value={value}
                scrollButtons
                onChange={handleChange}

            >
                {categories.map((cat, index) => (
                    <Tab id={`Tab-${index}`}
                        key={index}
                        label={cat}
                        />
                ))}
            </Tabs>
        </div>
    );

}
PageNav.propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(string).isRequired,
    setCategory: PropTypes.object.isRequired,
    category: PropTypes.object,
    navigateToPage: PropTypes.object.isRequired
};

export default withStyles(styles)(PageNav);