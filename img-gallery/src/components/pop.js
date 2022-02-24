import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Backdrop } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';

// needs important because the button class in pageView override this
const styles = () => ({
    popImg: {
        display: 'block',
        width: 'auto',
        height: 'auto',
        maxWidth: '90%',
        maxHeight: '100%'
    }
});

const ImgPop = props => {

    const { pop, setPopit, classes, photo, altText } = props;

    return (
            <Backdrop open={pop} onClick={() => setPopit(false)}>
                <img
                    alt={altText}
                    src={photo}
                    className={classes.popImg}
                />
            </Backdrop>
    )
}

ImgPop.propTypes = {
    pop: PropTypes.bool.isRequired,
    setPopit: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    photo: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired
}

export default (withStyles(styles)(ImgPop));
