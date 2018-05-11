const session = require('express-session')
const fs = require('fs-extra')
const passport = require('passport')
const localPassportStrategy = require('passport-local').Strategy
const ldapStrategy = require('passport-ldapauth')

const C = require('./../constants')
const settingsApp = require('./../settings')
const {runRoutesPublic} = require('./../tier3a-routes-public/routes')
const {runRoutesAuthenticated} = require('./../tier3b-routes-authenticated/routes')
const {User} = require('./user')

module.exports.runAuthentication = app => {
  // get authenticated 
  const authenticateUseGetPost = useAuthentication(app)
  // routes public
  runRoutesPublic((...x) => app.use(...x), (...x) => app.get(...x), (...x) => app.post(...x))

  // routes authenticated
  runRoutesAuthenticated(...authenticateUseGetPost)

  // authentication routes
  useAuthenticationRoutes(app)
}

// AUTHENTICATION ROUTES //

const useAuthenticationRoutes = app => {
  app.get('/backend/login', (req, res, next) => passport.authenticate(['local', (settingsApp.ldapOptions) ? 'ldapauth' : null], (err, user, info) => {
    if (err) res.status(200).json({username: null})
    else req.logIn(user, err => {
      if (err) res.status(200).json({username: null})
      else res.status(200).json(User.getUserinfo(user))
    })
  })(req, res, next))
  app.get('/backend/user', (req, res) => res.status(200).json((req.user) ? User.getUserinfo(req.user) : {username: null}))
  app.get('/backend/logout', (req, res) => {
    req.logout()
    res.status(200).json((req.user) ? User.getUserinfo(req.user) : {username: null})
  })
}

// AUTHENTICATION //

const useAuthentication = app => {
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
  
  const use = (route, ...xs) => app.use(route, requireAuth, ...xs)
  const get = (route, ...xs) => app.get(route, requireAuth, ...xs)
  const post = (route, ...xs) => app.post(route, requireAuth, ...xs)
  
  return [use, get, post]
}
