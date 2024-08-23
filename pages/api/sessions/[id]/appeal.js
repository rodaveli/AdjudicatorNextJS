import { PrismaClient } from '@prisma/client';
import { get_ai_judgement } from '../../../../utils/ai_judge';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { content, user_id } = req.body;

      const session = await prisma.session.findUnique({
        where: { id: parseInt(id) },
        include: { judgement: true },
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (!session.judgement) {
        return res.status(400).json({ error: 'No judgement exists for this session yet' });
      }

      if (user_id !== session.judgement.loser_user_id) { // Use loser_user_id instead of loser
        return res.status(403).json({ error: 'Only the losing party can submit an appeal' });
      }

      const appeal = await prisma.appeal.create({
        data: {
          content,
          session_id: parseInt(id),
        },
      });

      const sessionArguments = await prisma.argument.findMany({
        where: { session_id: parseInt(id) },
      });

      const appeal_judgement_data = await get_ai_judgement(sessionArguments, appeal);

      const appeal_judgement = await prisma.appealJudgement.create({
        data: {
          ...appeal_judgement_data,
          session_id: parseInt(id),
        },
      });

      // Update session with appeal judgement
      await prisma.session.update({
        where: { id: parseInt(id) },
        data: { appeal_judgement_id: appeal_judgement.id },
      });

      res.status(201).json(appeal);
    } catch (error) {
      console.error('Error in create_appeal:', error);
      res.status(500).json({ error: 'Failed to create appeal' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}