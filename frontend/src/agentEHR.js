import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'
import { GENDER } from './constants/metrics'

const superagent = superagentPromise(_superagent, global.Promise)
export const API_ROOT = 'https://rest.ehrscape.com/rest/v1'
const responseBody = (res) => res.body

let token = null
const tokenPlugin = (req) => {
  if (token) {
    req.set('Authorization', `Basic ${token}`)
  }
}

const requests = {
  del: (url) => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) => superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
}

const EHR = {
  info: (ehrId) => requests.get(`/ehr/${ehrId}`),
  saveParty: (ehrId, dateOfBirth = null, gender = null, firstNames = null, lastNames = null) => {
    const body = {
      firstNames: firstNames === null ? undefined : firstNames,
      lastNames: lastNames === null ? undefined : lastNames,
      gender: gender === null ? GENDER.UNKNOWN : gender,
      dateOfBirth: dateOfBirth === null ? undefined : dateOfBirth,
      partyAdditionalInfo: [
        {
          key: 'ehrId',
          value: ehrId,
        },
      ],
    }
    EHR.getParty(ehrId).then((res) => {
      if (res.status !== 404) return requests.post('/demographics/party', body)
      return requests.put('/demographics/party', body)
    })
  },
  getParty: (ehrId) => requests.get(`/demographics/ehr/${ehrId}/party`),
}

const Composition = {
  save: (composition, ehrId, templateId) => {
    const params = {
      ehrId,
      templateId,
      format: 'FLAT',
    }
    return requests.post(`/composition?${param(params)}`, composition)
  },
  saveBloodSugar: (ehrId, bloodsugar) => {
    const composition = {
      'ctx/language': 'en',
      'ctx/territory': 'SE',
      'odl_empower/blodsocker:0/blodsocker|magnitude': bloodsugar,
      'odl_empower/blodsocker:0/blodsocker|unit': 'mmol/l',
    }
    return Composition.save(composition, ehrId, 'ODL Report Vital Signs')
  },
}

const Demograhics = {
  // eslint-disable-next-line consistent-return
  newMeasurment: (height = null, weight = null, ehrId) => {
    const composition = {
      'ctx/language': 'en',
      'ctx/territory': 'SE',
      'vital_signs/height_length/any_event/body_height_length': height,
      'vital_signs/body_weight/any_event/body_weight': weight,
    }
    if (height || weight) return composition.save(composition, ehrId, 'Vital Signs')
  },
}

const Query = {
  aql: (aql) => requests.get(`/query?aql=${aql}`),
  weight: (ehrId) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    requests.get(`/view/${ehrId}/weight`),
  length: (ehrId) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    requests.get(`/view/${ehrId}/length`),
  bloodsugar: (ehrId, offset, limit) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Query.aql(
      `SELECT y/data[at0001]/events[at0002,'Point-in-time event']/data[at0003]/items[at0078.2,'Blodsocker']/value/magnitude as value, 
      y/data[at0001]/events[at0002,'Point-in-time event']/time/value as time, 
      y/data[at0001]/events[at0002,'Point-in-time event']/data[at0003]/items[at0078.2,'Blodsocker']/value/units as unit
      FROM EHR[ehr_id/value='${ehrId}']
      CONTAINS COMPOSITION c
      CONTAINS OBSERVATION y[openEHR-EHR-OBSERVATION.lab_test-blood_glucose.v1]
      ORDER BY Time desc
      OFFSET ${offset} LIMIT ${limit}`,
    ),
}

const param = (params) => {
  let s = ''
  // David please check the line below as it is generating a lot of errors and is probably too condenfed to do what it is suppose to.
  // eslint-disable-next-line guard-for-in, no-restricted-syntax, no-shadow
  for (const param in params) s += `${param}=${params[param]}&`
  return s.substr(0, s.length - 1)
}

export default {
  EHR,
  Composition,
  Query,
  Demograhics,
  setToken: (username, password) => {
    token = btoa(`${username}:${password}`)
  },
}
