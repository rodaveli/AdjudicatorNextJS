import { PrismaClient } from '@prisma/client';
import { get_ai_judgement } from '../../../../utils/ai_judge';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const sessionArguments = await prisma.argument.findMany({
        where: { session_id: parseInt(id) },
      });

      if (sessionArguments.length < 2) {
        return res.status(400).json({ error: 'Not enough arguments to judge' });
      }

      sessionArguments.sort((a, b) => a.user_id.localeCompare(b.user_id));

      const judgement_data = await get_ai_judgement(sessionArguments);

      const winning_argument = sessionArguments.find((arg) => arg.user_id === judgement_data.winning_user_id);
      const losing_argument = sessionArguments.find((arg) => arg.user_id === judgement_data.losing_user_id);

      judgement_data.winner = winning_argument ? winning_argument.username : 'Unknown';
      judgement_data.loser = losing_argument ? losing_argument.username : 'Unknown';

      const judgement = await prisma.judgement.create({
        data: {
          ...judgement_data,
          session_id: parseInt(id),
        },
      });

      // Update session with judgement
      await prisma.session.update({
        where: { id: parseInt(id) },
        data: { judgement_id: judgement.id },
      });

      res.status(201).json(judgement);
    } catch (error) {
      console.error('Error in judge_session:', error);
      res.status(500).json({ error: 'Failed to judge session' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}