const key = process.env.SHIPPING_SECRET_KEY;
const authMidd = (req, res, next) => {
    const apiKey = req.headers.shipping_secret_key;

    if (!apiKey) {
        return res.status(403).json({
            error: "SHIPPING_SECRET_KEY is missing or invalid",
        });
    }

    if (apiKey !== key) {
        return res.status(403).json({
            error: "Failed to authenticate SHIPPING_SECRET_KEY",
        });
    }

    next();
};

module.exports = authMidd;
