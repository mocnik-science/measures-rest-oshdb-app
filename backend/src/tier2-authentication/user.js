const settingsApp = require('./../settings')

// USER //

module.exports.User = User = class {
  constructor() {
    this._userinfo = null
  }

  static fromUserinfo(userinfo) {
    const u = new this
    u._userinfo = userinfo
    return u
  }

  static fromLocal(x) {
    const u = new this
    const isAdmin = x in settingsApp.admins
    const asUserList = (isAdmin && settingsApp.admins[x] !== true) ? settingsApp.admins[x] : null
    u._userinfo = {
      username: x,
      realUsername: x,
      admin: isAdmin,
      asUserList: asUserList,
    }
    return u
  }

  static fromLdap(x) {
    const u = new this
    const isAdmin = x.cn in settingsApp.admins
    const asUserList = (isAdmin && settingsApp.admins[x.cn] !== true) ? settingsApp.admins[x.cn] : null
    u._userinfo = {
      username: x.cn,
      realUsername: x.cn,
      fullname: x.displayName,
      surname: x.sn,
      forename: x.givenName,
      admin: isAdmin,
      asUserList: asUserList,
    }
    return u
  }

  static getUserinfo(u) {
    return (u && '_userinfo' in u) ? User.fromUserinfo(u._userinfo).userinfo() : {username: null}
  }

  static getUsername(u) {
    return (u && '_userinfo' in u) ? User.fromUserinfo(u._userinfo).username() : {username: null}
  }

  userinfo() {
    return this._userinfo
  }

  username() {
    return this.userinfo().username
  }

  admin() {
    return this.userinfo().admin
  }
  
  asUser(username) {
    this.userinfo().username = username
    return this
  }
}
