const initialState = {
    isAuth: false,
    jobs: {}
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state
            } 

        case 'CURRENT_JOB':
            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    ...action.jobs
                }
            }

        default: return state;
    };
};

module.exports = user;