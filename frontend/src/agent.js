import superagentPromise from 'superagent-promise'
import _superagent from 'superagent'

const superagent = superagentPromise(_superagent, global.Promise)
export const API_ROOT =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5000/api'
    : 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/api'
const responseBody = (res) => res.body

let token = null
const tokenPlugin = (req) => {
  if (token) {
    req.set('authorization', `Token ${token}`)
  }
}

const requests = {
  del: (url) => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) => superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
}

const Auth = {
  current: () => requests.get('/user'),
  login: (email, password) => requests.post('/user', { user: { email, password } }),
  register: (name, surname, email, password, confirmPassword) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    requests.post('/users', { user: { name, surname, email, password, confirmPassword } }),
  save: (user) => requests.put('/user', { user }),
}

const Parent = {
  registerChild: (name, surname, email, password, confirmPassword, dateofbirth, gender, disease, diseaseInfo) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    requests.post('/parent', {
      user: { name, surname, email, password, confirmPassword, dateofbirth, gender, disease, diseaseInfo },
    }),
  children: () => requests.get('/parent'),
  editChild: (ehrid, email) => requests.put('/child', { user: { ehrid, email } }),
  editParent: (email) => requests.put('/user', { user: { email } }),
  deleteChild: (ehrid) => requests.del(`/child?ehrid=${ehrid}`),
  deleteParent: () => requests.del('/user'),
}

const Child = {
  parents: () => requests.get('/child'),
  timer: (timer) => requests.post(`/child/timer?timer=${timer}`),
}

export default {
  Auth,
  Parent,
  Child,
  setToken: (_token) => {
    token = _token
  },
}
