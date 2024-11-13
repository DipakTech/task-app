import { Request, Response, NextFunction } from "express";

const checkRole = (role: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user || user.role !== role) {
        res
          .status(403)
          .json({ msg: "Unauthorized to perform the following action" });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkRole;
