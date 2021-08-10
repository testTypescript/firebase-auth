import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  res.cookie('csrfToken', (Math.random() * 100000000000000000).toString());

  next();
}
