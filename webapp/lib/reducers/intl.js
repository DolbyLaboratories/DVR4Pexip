import messages_en from './../translations/en.json';
import { intlReducer } from 'react-intl-redux'

const initialState = {
    intl: {
        defaultLocale: 'en',
        locale: 'en',
        messages: messages_en
    },
    // ...other initialState
};

export default (state = initialState, action) => {
    return intlReducer(state, action);
};