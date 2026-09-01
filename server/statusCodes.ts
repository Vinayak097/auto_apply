import type { Response } from "express";

function responseSend(status: number, res: Response, message?: string) {
  switch (status) {
    case 200:
      return res.status(200).json({
        success: true,
        message: message || "Request successful",
      });

    case 201:
      return res.status(201).json({
        success: true,
        message: message || "Created successfully",
      });

    case 400:
      return res.status(400).json({
        success: false,
        message: message || "Bad request",
      });

    case 401:
      return res.status(401).json({
        success: false,
        message: message || "User is not authenticated",
      });

    case 403:
      return res.status(403).json({
        success: false,
        message: message || "User not authorized",
      });

    case 404:
      return res.status(404).json({
        success: false,
        message: message || "Resource not found",
      });

    case 409:
      return res.status(409).json({
        success: false,
        message: message || "Resource already exists",
      });

    case 500:
      return res.status(500).json({
        success: false,
        message: message || "Internal server error",
      });
    case 411:
      return res.status(411).json({
        success: false,
        message: message || "invalid credentials",
      });

    default:
      return res.status(500).json({
        success: false,
        message: "Unknown status code",
      });
  }
}

export default responseSend;
