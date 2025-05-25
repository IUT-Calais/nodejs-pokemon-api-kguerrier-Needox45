import { Router } from 'express';
import { swaggerUiServe, swaggerUiSetup } from './api-docs.controller';

const router = Router();

router.use('/', swaggerUiServe, swaggerUiSetup);

export default router;