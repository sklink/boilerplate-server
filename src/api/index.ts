import { Router } from 'express';
import auth from '../domains/auth/auth.routes';
import agendash from '../domains/agenda/agenda.routes';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	agendash(app);

	return app;
}
