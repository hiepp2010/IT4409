const db = require("../db");
const jwt = require("jsonwebtoken");

const authMiddlewareForAdmin = async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(401).json({
        error: "Unauthorized - No token provided",
      });
    }

    jwt.verify(sessionToken, process.env.JWT_SECRET);

    const [session] = await db.query(
      `SELECT s.*, u.username, u.role 
       FROM sessions s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.token = ? AND s.is_valid = true`,
      [sessionToken]
    );

    if (!session.length) {
      return res.status(401).json({
        error: "Unauthorized - Invalid session",
      });
    }

    const currentSession = session[0];

    if (currentSession.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized  - Invalid session" });
    }
    if (new Date() > new Date(currentSession.expires_at)) {
      await db.query("UPDATE sessions SET is_valid = false WHERE token = ?", [
        sessionToken,
      ]);

      return res.status(401).json({
        error: "Unauthorized - Session expired",
      });
    }

    if (process.env.NODE_ENV === "production") {
      if (
        currentSession.ip_address !== req.ip ||
        currentSession.user_agent !== req.headers["user-agent"]
      ) {
        return res.status(401).json({
          error: "Unauthorized - Session mismatch",
        });
      }
    }

    req.user = {
      userId: currentSession.user_id,
      username: currentSession.username,
      role: currentSession.role,
    };

    await db.query(
      "UPDATE sessions SET last_activity_at = NOW() WHERE token = ?",
      [sessionToken]
    );

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Unauthorized - Invalid token",
      });
    }

    console.error("Session validation error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const authMiddlewareForCustomer = async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(401).json({
        error: "Unauthorized - No token provided",
      });
    }

    jwt.verify(sessionToken, process.env.JWT_SECRET);

    const [session] = await db.query(
      `SELECT s.*, u.username, u.role 
       FROM sessions s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.token = ? AND s.is_valid = true`,
      [sessionToken]
    );

    if (!session.length) {
      return res.status(401).json({
        error: "Unauthorized - Invalid session",
      });
    }

    const currentSession = session[0];

    if (currentSession.role !== "customer") {
      return res.status(401).json({ error: "Unauthorized  - Invalid session" });
    }
    if (new Date() > new Date(currentSession.expires_at)) {
      await db.query("UPDATE sessions SET is_valid = false WHERE token = ?", [
        sessionToken,
      ]);

      return res.status(401).json({
        error: "Unauthorized - Session expired",
      });
    }

    if (process.env.NODE_ENV === "production") {
      if (
        currentSession.ip_address !== req.ip ||
        currentSession.user_agent !== req.headers["user-agent"]
      ) {
        return res.status(401).json({
          error: "Unauthorized - Session mismatch",
        });
      }
    }

    req.user = {
      userId: currentSession.user_id,
      username: currentSession.username,
      role: currentSession.role,
    };

    await db.query(
      "UPDATE sessions SET last_activity_at = NOW() WHERE token = ?",
      [sessionToken]
    );

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Unauthorized - Invalid token",
      });
    }

    console.error("Session validation error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
module.exports = {
  authMiddlewareForAdmin,
  authMiddlewareForCustomer,
};
