const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK with your service account
admin.initializeApp({
  credential: admin.credential.cert('portfolio-441716-firebase-adminsdk-lllgj-691f509e65.json'),
  databaseURL: 'https://portfolio-441716.firebaseio.com'
});

const db = admin.firestore();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());  // Allow all origins

// Endpoint to add a new recommendation
app.post('/addRecommendation', async (req, res) => {
  const { name, message } = req.body;

  // Input validation
  if (!message || message.trim() === "") {
    return res.status(400).send({ success: false, error: "Message is required" });
  }

  try {
    // Save recommendation in Firestore
    const newRecommendationRef = await db.collection('recommendations').add({
      name: name || 'Anonymous',
      message: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ success: true, id: newRecommendationRef.id });
  } catch (error) {
    console.error("Error adding recommendation: ", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Endpoint to get all recommendations
app.get('/recommendations', async (req, res) => {
  try {
    const snapshot = await db.collection('recommendations').orderBy('timestamp', 'desc').get();
    const recommendations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations: ", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
