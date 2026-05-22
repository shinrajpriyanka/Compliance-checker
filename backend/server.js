import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { scanWebsite } from './services/scanner.js';
import { generateFixPlan } from './services/ai-agent.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Starting scan for: ${url}`);
    // 1. Scan website
    const scanReport = await scanWebsite(url);
    
    if (!scanReport.issues || scanReport.issues.length === 0) {
      return res.json({
        success: true,
        report: scanReport,
        fixes: []
      });
    }

    console.log(`Found ${scanReport.issues.length} issues. Generating AI fix plan...`);
    // 2. Generate AI fix plan
    const fixes = await generateFixPlan(scanReport);

    res.json({
      success: true,
      report: scanReport,
      fixes: fixes
    });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze website' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
