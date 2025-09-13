const express = require('express');
const crypto = require('crypto');
const { initializeDatabase } = require('./database');
const { sendQrCodeEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  const db = await initializeDatabase();

  app.use(express.json());
  app.use(express.static('public'));

  app.get('/api', (req, res) => res.json({ message: '🚀 Event-Gateway API is running!' }));

  app.post('/api/register', async (req, res) => {
    // ... (this route is unchanged from the revert)
    const { name, email, registrationId } = req.body;
    try {
      if (!name || !email || !registrationId) return res.status(400).json({ error: 'All fields are required.' });
      const uniqueToken = crypto.randomBytes(16).toString('hex');
      const sql = `INSERT INTO participants (name, email, "registrationId", "uniqueToken") VALUES ($1, $2, $3, $4)`;
      await db.query(sql, [name, email, registrationId, uniqueToken]);
      console.log(`✅ Registered: ${name} (${email})`);
      sendQrCodeEmail(email, name, uniqueToken);
      res.status(201).json({ message: 'Registration successful!', token: uniqueToken });
    } catch (error) {
      if (error.code === '23505') {
        console.log(`✅ Duplicate registration attempt for: ${email}.`);
        const result = await db.query('SELECT name, "uniqueToken" FROM participants WHERE email = $1 OR "registrationId" = $2', [email, registrationId]);
        const existingParticipant = result.rows[0];
        if (existingParticipant) {
          sendQrCodeEmail(email, existingParticipant.name, existingParticipant.uniqueToken);
          return res.status(200).json({ message: 'Welcome back! Your QR code has been sent to your email.', token: existingParticipant.uniqueToken });
        }
      }
      console.error('❌ Registration Error:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });

  app.post('/api/checkin', async (req, res) => {
    // ... (this route is unchanged from the revert)
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'Token is required.' });
      const result = await db.query('SELECT * FROM participants WHERE "uniqueToken" = $1', [token]);
      const participant = result.rows[0];
      if (!participant) return res.status(404).json({ error: 'Invalid QR Code. Participant not found.' });
      if (participant.status === 'Attended') return res.status(200).json({ message: `${participant.name} has already been checked in.` });
      const timestamp = new Date();
      await db.query('UPDATE participants SET status = $1, "checkInTimestamp" = $2 WHERE id = $3', ['Attended', timestamp, participant.id]);
      console.log(`✅ Checked In: ${participant.name} (${participant.email})`);
      res.status(200).json({ message: `Check-in successful for ${participant.name}.` });
    } catch (error) {
      console.error('❌ Check-in Error:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });
  
  app.get('/api/admin/data', async (req, res) => {
    // ... (this route is unchanged from the revert)
    try {
      const result = await db.query('SELECT * FROM participants ORDER BY name ASC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('❌ Admin Data Fetch Error:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  });

  // --- NEW: SECURE DATABASE CLEAR ENDPOINT ---
  app.post('/api/admin/clear', async (req, res) => {
    const providedKey = req.query.key;
    const secretKey = process.env.ADMIN_SECRET_KEY;

    if (!providedKey || providedKey !== secretKey) {
        return res.status(403).json({ error: 'Access Denied.' });
    }
    
    try {
        await db.query('TRUNCATE TABLE participants RESTART IDENTITY;');
        console.log('✅ Participants table has been cleared.');
        res.status(200).json({ message: 'All entries have been successfully cleared.' });
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        res.status(500).json({ error: 'Failed to clear database.' });
    }
  });


  app.listen(PORT, () => console.log(`✅ Server is listening on http://localhost:${PORT}`));
}

startServer();