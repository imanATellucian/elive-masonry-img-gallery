import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing20 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, TextLink, Button } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, {Component, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { allCategories, imgsByCategory } from '../components/util';
import Masonry from 'react-masonry-component';
import ImgPop from '../components/pop';
import PageNavWithHook from '../components/PageNavWithHook';

const styles = () => ({
    card: {
        margin: `0 ${spacing20}`
    },
    photo: {
        width: '270px'
    },
    butt: {
        padding: spacing20
    }
});

const CategoryPageWithHook = (props) => {
    const { classes, pageControl: { setPageTitle } } = props;
    const {category: initialCategory} = useParams();

    const [category, setCategory] = useState(initialCategory);
    const [photo, setPhoto] = useState();
    const [popPhoto, setPopPhoto] = useState(false);
    const [allImgsForCategory, setAllImgsForCategory] = useState([]);

    useEffect(() => {
        setAllImgsForCategory(imgsByCategory(category));
        setPageTitle(`${category} Memes`);
        console.log('useEffect fires');
    }, [category]);



    const categories = allCategories();
    const dialogTitle = `${category} meme`;


    const setPhotoAndPop = (image) => {
        setPhoto(image);
        setPopPhoto(true);
    }

    return (
        <div>
            <PageNavWithHook category={category} setCategory={setCategory} categories={categories} />
            <Masonry >
            {allImgsForCategory.map((item, index) => (
                <Button className={classes.butt} onClick={() => setPhotoAndPop(item)} variant="text" key={index}>
                    <img
                        src={item}
                        alt={category}
                        className={classes.photo}
                    />
                </Button>
            ))}
            </Masonry>
            <ImgPop
                classes={classes}
                pop={popPhoto}
                setPopit={setPopPhoto}
                photo={photo}
                altText={dialogTitle}
                />
        </div>
    );
};

CategoryPageWithHook.propTypes = {
    classes: PropTypes.object.isRequired,
    pageControl: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryPageWithHook);