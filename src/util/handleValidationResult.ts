import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default function handleValidationResult(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req).array();

  if (result.length) {
    return res.status(400).json(result);
  }

  next();
};