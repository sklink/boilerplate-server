import { Router } from 'express';
import agendash from '../domains/agenda/agenda.routes';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	agendash(app);

	return app;
}
