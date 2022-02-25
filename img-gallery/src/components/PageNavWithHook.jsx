import React from 'react';
import PropTypes, { string } from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import {
    Tabs,
    Tab
} from '@ellucian/react-design-system/core';
import { usePageControl } from '@ellucian/experience-extension/extension-utilities';


const styles = () => ({
    tabs: {
        display: 'block',
        marginBottom: '30px'
    }
});

const PageNavWithHook = (props) => {
    const { classes, categories, category, setCategory } = props;
    const value = categories.indexOf(category);
    const { navigateToPage } = usePageControl();

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
PageNavWithHook.propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(string).isRequired,
    setCategory: PropTypes.object.isRequired,
    category: PropTypes.object
};

export default withStyles(styles)(PageNavWithHook);