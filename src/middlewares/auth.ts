import passport from "passport";
import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/ApiError";

// Verify callback function
const verifyCallback =
  (
    req: Request,
    resolve: () => void,
    reject: (err: Error) => void,
    requiredRights: string[]
  ) =>
  async (err: Error, user?: IUser, info?: any): Promise<void> => {
    if (err || info || !user) {
      return reject(new ApiError(401, "Unauthorized"));
    }

    req.user = user; // Attach user to the request

    if (requiredRights.length > 0) {
      const role = user.role as IRole;
      if (!role || !role.permissions) {
        return reject(new ApiError(403, "Forbidden"));
      }

      // Add default permissions
      role.permissions = [...role.permissions, "ANY_WITH_AUTH", "OWNER"];

      const userRights = role.permissions;
      const hasRequiredRights = requiredRights.some((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights) {
        return reject(new ApiError(403, "Forbidden"));
      }
    }

    resolve();
  };

// Authentication middleware
const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
