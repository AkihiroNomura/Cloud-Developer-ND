import { Router, Request, Response } from 'express';
import {FilteredImageRouter} from './filteredImage/filteredimage.router'

const router: Router = Router();

router.use('/filteredimage', FilteredImageRouter);

router.get('/', async (req: Request, res: Response) => {
  res.send('V0: try GET /api/v0/filteredimage?image_url={{}}');
});

export const IndexRouter: Router = router;