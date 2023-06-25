import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/freight/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/freight/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/freight/user/logout',
    method: 'post'
  })
}
