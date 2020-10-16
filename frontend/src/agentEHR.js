import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { GENDER } from './constants/metrics';

const superagent = superagentPromise(_superagent, global.Promise);
export const API_ROOT = 'https://rest.ehrscape.com/rest/v1';
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('Authorization', `Basic ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const EHR = {
  info: ehr_id =>
    requests.get('/ehr/' + ehr_id),
  saveParty: (ehr_id, dateOfBirth = null, gender = null, firstNames = null, lastNames = null) => {
    const body = {
      firstNames: firstNames === null ? undefined : firstNames,
      lastNames: lastNames === null ? undefined : lastNames,
      gender: gender === null ? GENDER.UNKNOWN : gender,
      dateOfBirth: dateOfBirth === null ? undefined : dateOfBirth,
      partyAdditionalInfo: [
        {
          key: "ehrId",
          value: ehr_id
        }
      ]
    }
    EHR.getParty(ehr_id).then((res) => {
      if (res.status !== 404)
        return requests.post('/demographics/party', body);
      else
        return requests.put('/demographics/party', body)
    });
  },
  getParty: (ehr_id) =>
    requests.get(`/demographics/ehr/${ehr_id}/party`)
};

const Composition = {
  save: (composition, ehr_id, templateId) => {
    const params = {
      ehrId: ehr_id,
      templateId: templateId,
      format: 'FLAT'
    }
    return requests.post('/composition?' + param(params), composition);
  },
  saveBloodSugar: (ehr_id, bloodsugar) => {
    const composition = {
      "ctx/language": "en",
      "ctx/territory": "SE",
      "odl_empower/blodsocker:0/blodsocker|magnitude": bloodsugar,
      "odl_empower/blodsocker:0/blodsocker|unit": "mmol/l"
    }
    return Composition.save(composition, ehr_id, 'ODL Report Vital Signs')
  }
};

const Demograhics = {
  newMeasurment: (height = null, weight = null, ehr_id) => {
    const composition = {
      "ctx/language": "en",
      "ctx/territory": "SE",
      "vital_signs/height_length/any_event/body_height_length": height,
      "vital_signs/body_weight/any_event/body_weight": weight
    }
    if (height || weight)
      return composition.save(composition, ehr_id, 'Vital Signs');
  }
};

const Query = {
  aql: aql =>
    requests.get('/query?aql=' + aql),
  weight: ehr_id =>
    requests.get(`/view/${ehr_id}/weight`),
  length: ehr_id =>
    requests.get(`/view/${ehr_id}/length`),
  bloodsugar: (ehr_id, offset = 0, limit = 20) => 
    Query.aql(`
    SELECT y/data[at0001]/events[at0002,'Point-in-time event']/data[at0003]/items[at0078.2,'Blodsocker']/value/magnitude as value, 
    y/data[at0001]/events[at0002,'Point-in-time event']/time/value as time, 
    y/data[at0001]/events[at0002,'Point-in-time event']/data[at0003]/items[at0078.2,'Blodsocker']/value/units as unit
    FROM EHR[ehr_id/value='${ehr_id}']
    CONTAINS COMPOSITION c
    CONTAINS OBSERVATION y[openEHR-EHR-OBSERVATION.lab_test-blood_glucose.v1]
    ORDER BY Time desc
    OFFSET ${offset} LIMIT ${limit}`)
};

const param = (params) => {
  var s = "";
  for (var param in params)
    s += param + "=" + params[param] + "&";
  return s.substr(0, s.length - 1);
};

export default {
  EHR,
  Composition,
  Query,
  Demograhics,
  setToken: (username, password) => { token = btoa(username + ":" + password); }
};
