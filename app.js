import { fileURLToPath } from 'url';

import path from 'path';
import cors from 'cors';

import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// App configuration
app.use(express.static(path.join(__dirname, 'public')));  // Use static public directory
app.use(cors());                                          // Enable CORS

// Routes
app.get('/', (req, res) => {
  res.render('index.html');
});

// Start server
app.listen(8181, () => {
  console.log('Server is running on port 8181');
});