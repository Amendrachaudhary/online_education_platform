import { Webhook } from "svix";
import { User, Course, Enrollment, sequelize } from "../models/index.js";

// Clerk webhooks - handle user creation/updates
export const clerkWebhooks = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body);

        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    user_id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    image_url: data.image_url || "",
                    role: 'student'
                };
                
                await User.create(userData, { transaction });
                await transaction.commit();
                return res.json({});
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    image_url: data.image_url || "",
                };
                
                await User.update(userData, {
                    where: { user_id: data.id },
                    transaction
                });
                await transaction.commit();
                return res.json({});
            }

            case 'user.deleted': {
                await User.destroy({
                    where: { user_id: data.id },
                    transaction
                });
                await transaction.commit();
                return res.json({});
            }

            default:
                await transaction.rollback();
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: error.message });
    }
};

