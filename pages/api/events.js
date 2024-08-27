import { createRouter } from "next-connect";

const router = createRouter();

const clients = new Map();

router.get(async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };

  if (!clients.has(sessionId)) {
    clients.set(sessionId, new Set());
  }
  clients.get(sessionId).add(newClient);

  req.on("close", () => {
    if (clients.has(sessionId)) {
      clients.get(sessionId).delete(newClient);
      if (clients.get(sessionId).size === 0) {
        clients.delete(sessionId);
      }
    }
  });
});

router.post(async (req, res) => {
  const { sessionId, type, ...data } = req.body;

  if (!sessionId || !type) {
    return res
      .status(400)
      .json({ error: "Session ID and event type are required" });
  }

  if (clients.has(sessionId)) {
    clients.get(sessionId).forEach((client) => {
      client.res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
    });
  }

  res.status(200).json({ message: "Event sent successfully" });
});

export default router.handler();
