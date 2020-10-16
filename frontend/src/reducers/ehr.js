import {
    LOAD_PARTY,
    LOAD_EHR_METRIC,
    SAVE_PARTY,
    LOAD_BLOODSUGAR
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_PARTY:
            return {
                ...state,
                party: action.payload.error ? null : {
                    ...state.party,
                    [action.payload.party.additionalInfo.ehrId]: action.payload.party
                }
            }
        case LOAD_BLOODSUGAR:
            return {
                ...state,
                bloodsugar: action.payload.error ? null :
                    action.payload.resultSet
            }
        case SAVE_PARTY: {
            return {
                ...state,
                snackbar: action.error ? {
                    open: true,
                    message: "Något gick fel",
                    color: "warning"
                  } : action.snackbar
            }
        }
        case LOAD_EHR_METRIC:
            return {
                ...state,
                [action.metric]: action.payload.error ? null : action.payload
            }
        default:
            return state;
    }

}