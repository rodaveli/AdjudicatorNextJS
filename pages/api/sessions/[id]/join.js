import prisma from "../../../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    const { userId } = req.body;

    try {
      const session = await prisma.session.findUnique({
        where: { id: parseInt(id) },
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.user2_id) {
        return res.status(400).json({ error: "Session is full" });
      }

      const updatedSession = await prisma.session.update({
        where: { id: parseInt(id) },
        data: {
          user2_id: userId,
          user2_name: `User ${userId.substr(-4)}`,
        },
      });

      res.status(200).json(updatedSession);
    } catch (error) {
      console.error("Error joining session:", error);
      res.status(500).json({ error: "Failed to join session" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
