// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '1edg8ukkzl'
export const apiEndpoint = `https://${apiId}.execute-api.ap-northeast-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-46rwnrr1.us.auth0.com',            // Auth0 domain
  clientId: '2xAR6W3Tw1MdO8Qb1bFeUsi5HSuWcep5',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
