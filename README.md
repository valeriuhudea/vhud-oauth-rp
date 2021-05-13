# oauth server for dynamic Oauth2 Idp registration
# Currently tested with Azure, Okta, Google, Auth0, PingIdentity
# Uses Local JSON Data Store from data.json

npm install
npm run / yarn run

# API

POST, PUT, GET server/config
ex. payload
{
    "name": "idp4-test",
    "issuer": "https://accounts.google.com",
    "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
    "token_endpoint": "https://www.googleapis.com/oauth2/v4/token",
    "userinfo_endpoint": "https://www.googleapis.com/oauth2/v3/userinfo",
    "client_id": "EXAMPLEgoogleclientID1234g.apps.googleusercontent.com",
    "client_secret": "GoogleSecretF0WT3AE5KnR"
}
