import { asyncRoutes4, asyncRoutes3, asyncRoutes2, asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  let arr = [roles]
  if (route.meta && route.meta.roles) {
    return arr.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  console.log(roles)
  routes.forEach(route => {
    const tmp = { ...route }
    console.log(tmp)
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
    let rou = constantRoutes
    rou.splice(2, 0, ...routes)
    state.routes = rou
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      console.log(roles)
      if (roles.includes(1)) {
        accessedRoutes = asyncRoutes || []
      } else if (roles.includes(2)) {
        accessedRoutes = asyncRoutes2 || []
      } else if (roles.includes(3)) {
        accessedRoutes = asyncRoutes3 || []
      } else if (roles.includes(4)) {
        accessedRoutes = asyncRoutes4 || []
      }
      // else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
