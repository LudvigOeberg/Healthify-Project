import {
    LOAD_PARTY,
    SAVE_PARTY,
    LOAD_EHR_METRIC
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_PARTY:
            return {
                ...state,
                party: action.payload.error ? null : {
                    [action.payload.party.additionalInfo.ehrId]: action.payload.party
                }
            }
        case SAVE_PARTY:
            return {
                ...state
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