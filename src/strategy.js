const { Router } = require('express')
const passport = require('passport')
const LoginStrategy = require('passport-openidconnect').Strategy
const db = require('./db')


const activeConfigs = {}
const getStatus = (name) => !!activeConfigs[name]

const router = Router()

router.get('/auth/:name', (req, ...args) => {
  const { name } = req.params
  if (!getStatus(name)) init(name)
  return passport.authenticate(name)(req, ...args)
})
router.get('/auth/:name/callback', (req, ...args) => {
  const { name } = req.params
  return passport.authenticate(name, {
    failureRedirect: '/',
    successRedirect: '/protected'
  })(req, ...args)
})

// this can be loaded whenever a config is updated
const init = (name) => {
  activeConfigs[name] = true
  const config =  db.get('configs').find({ name }).value()
  if (config)  {
    const {
      client_id,
      client_secret,
      issuer,
      authorization_endpoint,
      token_endpoint,
      userinfo_endpoint,
      scope
    } = config
    passport.use(
      name,
      new LoginStrategy(
        {
          issuer,
          authorizationURL: authorization_endpoint,
          clientID: client_id,
          tokenURL: token_endpoint,
          clientSecret: client_secret,
          callbackURL: `http://localhost:8080/auth/${name}/callback`,
          userInfoURL: userinfo_endpoint,
          scope,
          skipUserProfile: true,
          idpLogout: true
        },
        (issuer, sub, profile, jwtClaims, accessToken, refreshToken, tokens, done)  => {
          const user = {
            issuer: issuer,
            sub: sub,
            jwtClaims: jwtClaims,
            tokens: tokens
          }
          return done(null, user)
        }
      )
    )
  }
}

module.exports =  {
  router,
  init
}