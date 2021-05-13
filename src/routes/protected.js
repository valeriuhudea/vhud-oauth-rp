const { Router } = require('express')
const jwtDecode  = require('jwt-decode')
const router = Router()

router.get('/', async (req, res) => {
  const userData = req.user
  const idToken = req.user.tokens.id_token
  const decodedIdToken = jwtDecode(idToken)
  console.log(userData)
  console.log(decodedIdToken)
  if (userData.issuer == 'https://hudea.okta.com/oauth2/default'){
    //res.header('Authorization: JWT '+userData.tokens.id_token)
    res.render('protected')
    } else { res.render('protected') }
})

module.exports = router
