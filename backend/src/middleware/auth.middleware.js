const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        if(!user.isActive) {
            return res.status(403).json({ message: "Account has been deactivated" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    next();
};

module.exports = { protectRoute, requireAdmin };