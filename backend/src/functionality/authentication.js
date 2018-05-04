const session = require('express-session')
const fs = require('fs-extra')
const passport = require('passport')
const localPassportStrategy = require('passport-local').Strategy
const ldapStrategy = require('passport-ldapauth')

const C = require('./../constants')
const settingsApp = require('./../settings')

// AUTHENTICATION //

module.exports.useAuthentication = app => {
  const requireAuth = (req, res, next) => {
    if (req.user) return next()
    return res.status(403).send('forbidden')
  }
    
  passport.use(new localPassportStrategy((username, password, done) => {
    const usernames = settingsApp.localUsers
    if (usernames[username] !== undefined && usernames[username] === password) {
      const u = User.fromLocal(username)
      if (!fs.existsSync(`${C.PATH_USERS}/${u.username()}`)) fs.mkdirSync(`${C.PATH_USERS}/${u.username()}`)
      return done(null, u)
    }
    return done(null, false, {})
  }))
  if (settingsApp.ldapOptions) passport.use(new ldapStrategy(settingsApp.ldapOptions, (user, done) => {
    const u = User.fromLdap(user)
    if (!fs.existsSync(`${C.PATH_USERS}/${u.username()}`)) fs.mkdirSync(`${C.PATH_USERS}/${u.username()}`)
    done(null, u)
  }))
  
  passport.serializeUser((user, done) => done(null, user.userinfo()))
  passport.deserializeUser((userinfo, done) => done(null, User.fromUserinfo(userinfo)))
  
  app.use(session({
    secret: 'un9ßq9^ac%§8x"mixaü',
    resave: false,
    saveUninitialized: false,
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  
  const get = (route, ...xs) => app.get(route, requireAuth, ...xs)
  const post = (route, ...xs) => app.post(route, requireAuth, ...xs)
  
  return [get, post]
}

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
    const u = new this;
    u._userinfo = {username: x, admin: settingsApp.admins.includes(x)}
    return u
  }

  static fromLdap(x) {
    const u = new this;
    u._userinfo = {
      username: x.cn,
      fullname: x.displayName,
      surname: x.sn,
      forename: x.givenName,
      admin: settingsApp.admins.includes(x.cn),
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
}
