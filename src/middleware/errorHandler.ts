import { Request, Response, NextFunction, RequestHandler } from 'express';

// Genel hata işleyici
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
};

// 404 Not Found işleyici
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async hata yakalama yardımcısı
export const asyncHandler = (fn: Function): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 