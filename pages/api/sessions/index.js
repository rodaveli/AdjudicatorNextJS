import prisma from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, description, userId } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Session name is required" });
      }
      const session = await prisma.session.create({
        data: {
          name,
          description,
          user1_id: userId,
          user1_name: `User ${userId.substr(-4)}`,
        },
      });
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res
        .status(500)
        .json({ error: "Failed to create session: " + error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
