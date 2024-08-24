import prisma from "../../../utils/db";

export default async function handler(req, res) {
  const { id } = req.query;
  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const session = await prisma.session.findUnique({
        where: { id: parseInt(id) },
        include: {
          arguments: true,
          judgement: true,
          appeal_judgement: true,
        },
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Check if the user is part of the session
      if (session.user1_id !== userId && session.user2_id !== userId) {
        return res
          .status(403)
          .json({ error: "User not authorized for this session" });
      }

      res.status(200).json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch session: " + error.message });
    }
  } else if (req.method === "POST") {
    try {
      console.log("Received session creation request:", req.body);
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Session name is required" });
      }
      const session = await prisma.session.create({
        data: { name, description },
      });
      console.log("Session created:", session);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
