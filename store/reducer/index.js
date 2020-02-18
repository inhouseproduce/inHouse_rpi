let { CURRENT_JOB, SET_CLIENT, REGISTER_TOKEN, STATE } = require('../actionTypes');

const initialState = {
    auth: {},
    jobs: {},
    state: {},
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_CLIENT:
            return {
                ...state,
                client: {
                    ...state.client,
                    ...action.client
                }
            }

        case CURRENT_JOB:
            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    ...action.schedule
                }
            }

        case REGISTER_TOKEN:
            return {
                ...state,
                auth: {
                    token: action.token
                }
            }

        case STATE:
            return {
                ...state,
                state: {
                    ...state.state,
                    [action.key]: {
                        ...state.state[action.key],
                        ...action.res
                    }
                }
            };

        default: return state;
    };
};

module.exports = user;