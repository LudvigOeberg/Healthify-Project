import {
    LOAD_PARTY,
    SAVE_PARTY,
    LOAD_BLOODSUGAR,
    ASYNC_START,
    SAVE_BLOODSUGAR
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_PARTY:
            return {
                ...state,
                inProgress: false,
                party: action.error ? null : {
                    ...state.party,
                    [action.payload.party.additionalInfo.ehrId]: action.payload.party
                }
            }
        case LOAD_BLOODSUGAR:
            return {
                ...state,
                inProgress: false,
                bloodsugar: action.error ? null :
                    action.payload.resultSet
            }
        case SAVE_BLOODSUGAR:
        case SAVE_PARTY:
            return { ...state, inProgress: false }
        case ASYNC_START:
            if (action.subtype === SAVE_PARTY || action.subtype === LOAD_PARTY || action.subtype === SAVE_BLOODSUGAR || action.subtype === LOAD_BLOODSUGAR)
                return { ...state, inProgress: true };
            break;
        default:
            return state;
    }
    return state;
}