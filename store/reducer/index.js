let { CURRENT_JOB } = require('../actionTypes');

const initialState = {
    isAuth: false,
    auth: {},
    jobs: {}
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state
            }

        case CURRENT_JOB:
            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    ...action.schedule
                }
            }

        case 'REGISTER_TOKEN':
            return {
                ...state,
                auth: {
                    token: action.token
                }
            }

        default: return state;
    };
};

module.exports = user;