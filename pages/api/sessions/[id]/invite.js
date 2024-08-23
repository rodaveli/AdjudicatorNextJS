export default async function handler(req, res) {
    const { id } = req.query;
    const { email, userId } = req.body;
  
    if (req.method === 'POST') {
      // Placeholder for sending an email invitation
      console.log(`Invitation sent to ${email} for session ${id} by user ${userId}`);
      res.status(200).json({ message: `Invitation sent to ${email} for session ${id}` });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }