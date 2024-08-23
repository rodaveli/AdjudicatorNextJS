import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const client = new OpenAI();

// Define the Zod schema for the expected JSON output
const JudgementSchema = z.object({
  content: z.string(),
  winner: z.string(),
  winning_argument: z.string(),
  winning_user_id: z.string(),
  loser: z.string(),
  losing_argument: z.string(),
  losing_user_id: z.string(),
  reasoning: z.string(),
});

export async function get_ai_judgement(arguments, appeal = null) {
  let prompt = `You are an AI judge for a debate app. Your task is to evaluate arguments and always choose a winner, even in subjective cases. Focus on the relative strength of the arguments rather than the absolute truth of the claims. Make your judgement fun and engaging. Respond in JSON format.

  Arguments:
  `;

  for (let i = 0; i < arguments.length; i++) {
    prompt += `Argument ${i + 1} by ${arguments[i].username}:\n${arguments[i].content}\n\n`;
  }

  if (appeal) {
    prompt += `Appeal:\n${appeal.content}\n\n`;
  }

  prompt += `Please provide your judgement, including the content (full judgement text), winner (the username of the winner), winning_argument, winning_user_id, loser (the username of the loser), losing_argument, losing_user_id and reasoning. Remember:
  1. Always choose a winner.
  2. Even if the topic is subjective, make a definitive choice based on argument quality.`;

  try {
    const completion = await client.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06', // Use a model that supports structured outputs
      messages: [
        { role: 'system', content: 'You are an AI judge for a debate app. Always choose a winner.' },
        { role: 'user', content: prompt },
      ],
      response_format: zodResponseFormat(JudgementSchema, 'judgement'), // Use zodResponseFormat helper
    });

    const judgement = completion.choices[0].message.parsed; // Access the parsed JSON object

    return judgement;
  } catch (error) {
    console.error('Error in get_ai_judgement:', error);
    return {
      content: `An error occurred: ${error.message}`,
      winner: 'Unknown',
      winning_argument: 'Unable to determine',
      winning_user_id: null,
      loser: 'Unknown',
      losing_argument: 'Unable to determine',
      losing_user_id: null,
      reasoning: `An error occurred: ${error.message}`,
    };
  }
}