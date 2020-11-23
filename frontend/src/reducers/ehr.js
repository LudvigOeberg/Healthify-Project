import {
  LOAD_PARTY,
  SAVE_PARTY,
  LOAD_BLOODSUGAR,
  ASYNC_START,
  SAVE_BLOODSUGAR,
  LOGOUT,
  SAVE_WEIGHT,
  LOAD_WEIGHT,
  LOAD_MULTIPLE_WEIGHTS,
  LOAD_MULTIPLE_BLOODSUGARS,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
      return {}
    case LOAD_PARTY:
      return {
        ...state,
        inProgress: false,
        party: action.error
          ? null
          : {
              ...state.party,
              [action.payload.party.additionalInfo.ehrId]: action.payload.party,
            },
      }
    case LOAD_WEIGHT:
      return {
        ...state,
        inProgress: false,
        weight: action.error || action.payload === null ? null : action.payload,
      }
    case LOAD_MULTIPLE_WEIGHTS:
      return {
        ...state,
        inProgress: false,
        weights: {
          ...state.weights,
          [action.ehrId]: {
            weight: action.error || action.payload === null ? null : action.payload,
          },
        },
      }
    case LOAD_MULTIPLE_BLOODSUGARS:
      return {
        ...state,
        inProgress: false,
        bloodsugars: {
          ...state.bloodsugars,
          [action.ehrId]: {
            bloodsugar: action.error || action.payload === null ? null : action.payload.resultSet,
          },
        },
      }
    case LOAD_BLOODSUGAR:
      return {
        ...state,
        inProgress: false,
        bloodsugar: action.error || action.payload === null ? null : action.payload.resultSet,
      }
    case SAVE_BLOODSUGAR:
    case SAVE_PARTY:
    case SAVE_WEIGHT:
      return { ...state, inProgress: false }
    case ASYNC_START:
      if (
        action.subtype === SAVE_PARTY ||
        action.subtype === LOAD_PARTY ||
        action.subtype === SAVE_BLOODSUGAR ||
        action.subtype === LOAD_BLOODSUGAR
      )
        return { ...state, inProgress: true }
      break
    default:
      return state
  }
  return state
}
