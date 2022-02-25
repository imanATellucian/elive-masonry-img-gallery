import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40, spacing30 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, TextLink, CardMedia, Button, Backdrop } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { getRandomImg } from '../components/util';
import ImgPop from '../components/pop';
import { useIntl } from 'react-intl';
import { withIntl } from '../components/reactIntlProviderWrapper';

const styles = {
    card: {
        marginLeft: spacing40,
        marginRight: spacing40
    },
    photo: {
        margin: 'auto',
        display: 'block',
        width: 'auto',
        height: 'auto',
        maxWidth: '270px',
        maxHeight: '200px'
    },
    linkspan: {
        display: 'block'
    },
    buttons: {
        justifyContent: 'space-between',
        paddingTop: spacing30
    },
    primaryButton: {
        maxWidth: '130px'
    },
    secondaryButton: {
        marginLeft: spacing30
    },
    popImg: {
        display: 'block',
        width: 'auto',
        height: 'auto',
        maxWidth: '90%',
        maxHeight: '100%'
    }
}

const GalleryCard = (props) => {
    const { classes, cardControl: { navigateToPage } } = props;

    const intl = useIntl();
    const [popit, setPopit] = useState(false);
    const [category, setCategory] = useState();
    const [meme, setMeme] = useState();

    const dialogTitle = `${category} meme`;

    useEffect(() => {
        randomizer();
    }, []);

    const randomizer = () => {
        const { category, meme } = getRandomImg();
        setCategory(category);
        setMeme(meme);
    }

    return (
        <div className={classes.card}>
            <Button onClick={() => setPopit(true)} variant="text">
            <img
                alt={dialogTitle}
                src={meme}
                className={classes.photo}
            />
            </Button>
            <Typography className={classes.buttons}>
                <Button
                    color="primary"
                    className={classes.primaryButton}
                    onClick={
                        () => navigateToPage({
                            route: category
                        })}
                >
                    {`${category}`}
                </Button>
                <Button
                    color="secondary"
                    className={classes.secondaryButton}
                    onClick={
                        () => randomizer()}
                >
                    {intl.formatMessage({ id: 'randomizer' })}
                </Button>
                <span className={classes.linkspan}>
                    {intl.formatMessage({ id: 'forMoreMemes'})}
                <TextLink href="https://imgur.com" target="_blank">
                     Imgur.com
                </TextLink>
                </span>
            </Typography>
            <ImgPop
                classes={classes}
                pop={popit}
                setPopit={setPopit}
                photo={meme}
                altText={dialogTitle}
                />
        </div>
    );
};

GalleryCard.propTypes = {
    classes: PropTypes.object.isRequired,
    cardControl: PropTypes.object.isRequired
};

export default withIntl(withStyles(styles)(GalleryCard));