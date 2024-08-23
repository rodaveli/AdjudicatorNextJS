import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const { user, username, userId } = req.body;

  if (req.method === 'POST') {
    try {
      const session = await prisma.session.findUnique({
        where: { id: parseInt(id) },
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      let data = {};
      if (user === 'user1' && session.user1_id === userId) {
        data = { user1_name: username };
      } else if (user === 'user2' && session.user2_id === userId) {
        data = { user2_name: username };
      } else {
        return res.status(400).json({ error: 'Invalid user or userId' });
      }

      const updatedSession = await prisma.session.update({
        where: { id: parseInt(id) },
        data,
      });

      res.status(200).json(updatedSession);
    } catch (error) {
      console.error('Error updating username:', error);
      res.status(500).json({ error: 'Failed to update username' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}