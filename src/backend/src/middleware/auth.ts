import { NextFunction, Request, Response } from "express";

function getConfiguredToken() {
  const configuredToken = process.env.API_TOKEN;
  if (!configuredToken || configuredToken.trim() === "") {
    return null;
  }
  return configuredToken.trim();
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const configuredToken = getConfiguredToken();

  if (!configuredToken) {
    return res
      .status(500)
      .json({ error: "Authentication is not configured on server" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const providedToken = authHeader.split(" ")[1];
  if (providedToken !== configuredToken) {
    return res.status(403).json({ error: "Invalid authorization token" });
  }

  next();
}
