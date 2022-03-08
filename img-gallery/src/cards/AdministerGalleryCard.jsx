import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40, spacing30, colorFillAlertError } from '@ellucian/react-design-system/core/styles/tokens';
import { Dropdown, DropdownItem, Typography, Button, TextField } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { allCategories, newImg } from '../components/utilForApi';
import { useIntl } from 'react-intl';
import { withIntl } from '../components/reactIntlProviderWrapper';
import isEmpty from 'lodash/isEmpty';

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
    secondField: {
        marginTop: spacing30
    }
}

const AdministerGalleryCard = (props) => {
    const {
        classes,
        cardControl: {
            setLoadingStatus,
            setErrorMessage
        },
        cardInfo: { configuration },
        data: { getExtensionJwt }
    } = props;

    const intl = useIntl();
    const [categories, setCategories] = useState([]);
    const [meme, setMeme] = useState();
    const [memeTags, setMemeTags] = useState('');
    const [tagsArray, setTagsArray] = useState([]);
    const [tagsInputRequiredMessage, setTagsInputRequiredMessage] = useState(false);
    const [urlInputRequiredMessage, setUrlInputRequiredMessage] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [msg, setMsg] = useState();
    const baseUrl = configuration['api-base-url'];

    useEffect(() => {
        // this runs once when component loads
        initialize();
    }, []);

    const initialize = () => {
        try {
            // I don't want my form to draw before i have
            // categories loaded and state set
            // so i use setLoadingStatus
            setLoadingStatus(true);
            console.log("baseurl", baseUrl);
            allCategories({ baseUrl })
                .then(cats => {
                    console.log("cats", cats);
                    setCategories(cats);
                })
                .finally(() => {
                    setLoadingStatus(false);
                })
        } catch (error) {
            console.error(error);
            updateCardError('We were unable to get your information from the Image Gallery api');
        }
    }

    const submitImg = () => {
        // this is an ID for intl, not a string msg
        setMsg('submitting');
        setShowForm(false);
        getExtensionJwt().then((jwt) => {
            console.log("jwt", jwt);
            const tags = memeTags.split(",");
            const cleanTags = [];
            tags.forEach(element => {
                const tag = element.trim();
                if (tag.length) {
                    cleanTags.push(tag);
                }
            });
            const allTags = [...cleanTags, ...tagsArray];
            console.log("submitting...", jwt, meme, allTags);
            if (!allTags.length) {
                setMsg('atLeastOneTag');
                setShowForm(true);
            }
            else if (jwt && meme && allTags.length) {
                newImg({ jwt, baseUrl, imageUrl: meme, tags: allTags })
                    .then((returned) => {
                        setMsg('done');
                        console.log("form submitted", returned);
                    });
            }
            else {
                setMsg('requiredFieldNotPresent');
            }
        });
    }

    const resetForm = event => {
        setMsg('');
        setTagsInputRequiredMessage(false);
        setUrlInputRequiredMessage(false);
        setMeme('');
        setMemeTags('');
        setTagsArray([])
        setShowForm(true);
    };

    const updateCardError = (msg) => {
        if (msg.length) {
            setErrorMessage({ headerMessage: 'Error', textMessage: msg, iconName: 'error', iconColor: colorFillAlertError });
        }
    }

    const onTagsBlur = () => {
        validateTags(memeTags);
    }

    const onTagsInputChange = (event) => {
        const { value } = event.target;
        console.log("value", value);
        const tags = value.split(",");
        const cleanTags = [];
        tags.forEach(element => {
            const tag = element.trim();
            if (tag.length) {
                cleanTags.push(tag);
            }
        });
        validateTags(cleanTags);
    };

    const validateTags = (tags) => {
        const emptyFieldMessage = intl.formatMessage({ id: 'thisFieldIsRequired' });
        const invalidTagMessage = intl.formatMessage({ id: 'invalidTags' });
        const allTagsAreValid = !tags.map(tag => tag.trim()).includes('');
        let finalMessage = '';

        if (isEmpty(tags) || (tags.length === 1 && isEmpty(tags[0]))) {
            finalMessage = emptyFieldMessage;
        } else if (!allTagsAreValid) {
            finalMessage = invalidTagMessage;
        } else {
            // tags are valid so we'll set state
            setMemeTags(tags.join(','));
        }

        setTagsInputRequiredMessage(finalMessage);
    };

    const validateStringNotEmpty = (theString, messageKey, helperRef) => {
        const errorMessage = isEmpty(theString) ? intl.formatMessage({ id: `${messageKey}` }) : '';
        helperRef(errorMessage);
    };

    const onImgBlur = () => {
        validateStringNotEmpty(meme, "urlRequired", setUrlInputRequiredMessage);
    }

    const onImgChange = (event) => {
        const { value } = event.target;
        setMeme(value);
    }


    return (
        <div className={classes.card}>
            {msg && <>
                <Typography className={classes.buttons}>
                    {intl.formatMessage({ id: msg })}
                </Typography>
            </>}
            {showForm && <>
                <Typography className={classes.buttons}>
                    {intl.formatMessage({ id: 'newItemText' })}
                </Typography>
                <TextField
                    error={Boolean(urlInputRequiredMessage)}
                    helperText={urlInputRequiredMessage}
                    id="meme_url"
                    label={intl.formatMessage({ id: 'imgUrlField' })}
                    onBlur={onImgBlur}
                    onChange={onImgChange}
                    placeholder={intl.formatMessage({ id: 'enterImgUrl' })}
                    required={true}
                    value={meme || ''}
                    fullWidth={true}
                />
                <Dropdown
                    className={classes.secondField}
                    label={intl.formatMessage({id: 'existingTags'})}
                    onChange={(event) => setTagsArray(event.target.value)}
                    multiple
                    value={tagsArray}
                >
                    {categories.map((cat) => {
                        return (
                            <DropdownItem
                                key={cat}
                                label={cat}
                                value={cat}
                            />)
                    })}
                </Dropdown>
                <TextField
                    id="meme_tags"
                    className={classes.secondField}
                    label={intl.formatMessage({ id: 'tagsLabel' })}
                    // onBlur={onTagsBlur}
                    onChange={(event) => setMemeTags(event.target.value)}
                    placeholder={intl.formatMessage({ id: 'tagsHintText' })}
                    value={memeTags}
                    fullWidth={true}
                    required
                    error={Boolean(tagsInputRequiredMessage)}
                    helperText={tagsInputRequiredMessage}
                />


                <Button
                    color="primary"
                    className={classes.primaryButton}
                    onClick={() => submitImg()}
                >
                    {intl.formatMessage({ id: 'submit' })}
                </Button>

            </>
            }
            <Button
                color="secondary"
                className={classes.primaryButton}
                onClick={() => resetForm()}
            >
                {intl.formatMessage({ id: 'reset' })}
            </Button>
        </div>
    );
};

AdministerGalleryCard.propTypes = {
    classes: PropTypes.object.isRequired,
    cardControl: PropTypes.object.isRequired,
    cardInfo: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default withIntl(withStyles(styles)(AdministerGalleryCard));