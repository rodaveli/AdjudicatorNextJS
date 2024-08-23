import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      try {
        const { content, userId, username } = fields;
        let image_url = null;

        if (files.image) {
          const fileExtension = files.image.originalFilename.split('.').pop();
          const imageName = `${uuidv4()}.${fileExtension}`;
          const imagePath = `/tmp/${imageName}`; // Store temporarily

          await fs.promises.writeFile(imagePath, fs.readFileSync(files.image.filepath));

          // TODO: Implement actual image uploading to your storage (e.g., Cloudinary, S3)
          // and replace the placeholder below with the actual URL.
          image_url = `/images/${imageName}`; // Placeholder
        }

        const argument = await prisma.argument.create({
          data: {
            content,
            user_id: userId,
            username,
            image_url,
            session_id: parseInt(id),
          },
        });

        // Trigger judgement if this is the second argument
        const sessionArguments = await prisma.sessionArguments.findMany({ where: { session_id: parseInt(id) } });
        if (sessionArguments.length === 2) {
          // Call the judge API route
          const judgeResponse = await fetch(`${req.headers.origin}/api/sessions/${id}/judge`, { method: 'POST' });
          const judgeData = await judgeResponse.json();
          // Broadcast the judgement using WebSockets (implementation not shown here)
        }

        res.status(201).json(sessionArguments);
      } catch (error) {
        console.error('Error creating argument:', error);
        res.status(500).json({ error: 'Failed to create argument' });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}