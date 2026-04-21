import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message:
        "Acesso negado. Apenas administradores podem realizar esta ação.",
    });
  }

  next();
};
