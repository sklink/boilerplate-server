import { Request } from 'express';
import { auth,  } from 'express-oauth2-jwt-bearer';

import env from '@/_env';

export const checkJwt = auth({
  authRequired: true,
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: env.JWT_ALGORITHM,
});
