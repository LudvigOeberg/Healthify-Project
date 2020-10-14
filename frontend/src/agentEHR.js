import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);
export const API_ROOT = 'https://rest.ehrscape.com/rest/openehr/v1/';
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Authorization ${token}`);
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

const ehr = {
    info: ehr_id =>
      requests.get('/ehr/' + ehr_id )
};

export default {
    ehr,
    setToken: _token => { token = _token; }
  };
  