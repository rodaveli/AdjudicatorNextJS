import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      try {
        const { content, userId, username } = fields;
        let image_url = null;

        if (files.image) {
          // TODO: Implement image upload logic here
          // For now, we'll just use a placeholder URL
          image_url = "https://example.com/placeholder-image.jpg";
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

        // Send event for new argument
        const eventRes = await fetch(`${process.env.VERCEL_URL}/api/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newArgument",
            sessionId: id,
            argument,
            username,
          }),
        });

        if (!eventRes.ok) {
          console.error("Failed to send event");
        }

        res.status(201).json(argument);
      } catch (error) {
        console.error("Error creating argument:", error);
        res.status(500).json({ error: "Failed to create argument" });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
