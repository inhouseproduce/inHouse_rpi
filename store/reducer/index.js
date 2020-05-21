let { CURRENT_JOB, SET_CLIENT, REGISTER_TOKEN, ENGINE } = require('../actionTypes');

const initialState = {
    auth: {},
    jobs: {},
    state: {
        engine: {},
        module: {},
        system: {}
    },
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
                    token: action.token,
                    client: action.client
                }
            }

        case 'STATE':
            return {
                ...state,
                state: {
                    ...state.state,
                    [action.to]: {
                        ...state.state[action.to],
                        [action.key]: {
                            ...state.state[action.to][action.key],
                            ...action.res
                        }
                    }
                }
            };

        case 'CONFIG': {
            return {
                ...state,
                config: {
                    ...action.config
                }
            }
        };

        default: return state;
    };
};

module.exports = user;