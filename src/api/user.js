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

export default{
  getUserList(searchModel){
    return request({
      url: '/freight/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        userId: searchModel.userId,
        username: searchModel.username,
        userRole: searchModel.userRole
      }
    });
  },
  addUser(user){
    return request({
      url: '/freight/user/add',
      method: 'post',
      data: {
        username: user.username,
        userRole: user.userRole,
        password: user.password
      }
    });
  },
  updateUser(user){
    return request({
      url: '/freight/user/update',
      method: 'put',
      data: {
        userId: user.userId,
        username: user.username,
        userRole: user.userRole,
        password: user.password
      }
    });
  },
  saveUser(user){
    if(user.userId == null || user.userId == undefined){
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  getUserById(userId){
    return request({
      url: '/freight/user/' + userId,
      method: 'get'
    });
  },
  deleteUserById(userId){
    return request({
      url: '/freight/user/' + userId,
      method: 'delete'
    });
  },
}
