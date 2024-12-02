const express = require("express");
const dotenv = require("dotenv");
const { prisma } = require("./db/config");
const authMidd = require("./middleware/auth");

dotenv.config();

const app = express();
app.use(express.json());
app.use(authMidd);

app.post("/api/shipping/create", async (req, res) => {
    const { userId, productId, count } = req.body;

    if (!userId || !productId || !count) {
        return res.status(404).json({
            error: "All fields required",
        });
    }

    const data = await prisma.shipping.create({
        data: {
            userId,
            productId,
            count,
        },
    });

    return res
        .status(201)
        .json({ id: data.id, userId, productId, count, status: data.status });
});

app.put("/api/shipping/cancel", async (req, res) => {
    const { shippingId } = req.body;

    if (!shippingId) {
        return res.status(404).json({
            error: "Missing shippingId",
        });
    }

    const data = await prisma.shipping.update({
        where: { id: shippingId },
        data: {
            status: "cancelled",
        },
    });

    return res.status(200).json({
        id: data.id,
        userId: data.userId,
        productId: data.productId,
        count: data.count,
        status: data.status,
    });
});

app.get("/api/shipping/get", async (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const spec = await prisma.shipping.findMany({
            where: { userId: Number(userId) },
        });
        console.log(spec);
        return res.status(200).json(spec);
    }
    const all = await prisma.shipping.findMany();
    return res.status(200).json(all);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
