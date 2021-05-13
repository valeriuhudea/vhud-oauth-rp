const { Router } = require('express')
const db = require('../db')
const router = Router()

router.get('/', async (req, res) => {
  req.session.destroy(() => {
   req.logout()
   res.redirect('/')
  })
 })

router.get('/idp', async (req, res, next) => {
  try {
    const user = req.user
    const tokenSet = user.tokens
    const issuer = user.issuer
    const config =  db.get('configs').find({ issuer }).value()
    const endSessionUrl = config.end_session_endpoint
    const idToken = tokenSet.id_token
    const redirectBackTo = 'http://localhost:8080'
    req.session.destroy(function(err) {
      if (err) {
        console.error("Session end failled: ", err)
      }
    })
    if (issuer.includes('google')) {
      const googleEndSession = `${endSessionUrl}?continue=${redirectBackTo}`
      return(res.redirect(googleEndSession))
    } else if (issuer.includes('microsoft')){
      const azureEndSession = `${endSessionUrl}?post_logout_redirect_uri=${redirectBackTo}`
      return(res.redirect(azureEndSession))
    } else if (issuer.includes('okta')) {
      const oktaEndSession = `${endSessionUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectBackTo}`
      return(res.redirect(oktaEndSession))
    }
  } catch(err) {console.error(err)}
})

module.exports = router