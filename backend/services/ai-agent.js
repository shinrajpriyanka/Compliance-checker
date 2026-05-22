import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_testing_if_not_provided');

async function generateFixPlan(scanReport) {
  // We'll use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
You are an expert accessibility engineer.
I have run an accessibility scan on a webpage using pa11y. 
Here is the summary of the issues found:

${JSON.stringify(scanReport.issues, null, 2)}

For each issue, please provide:
1. An explanation of why it is an issue.
2. The exact code snippet (if possible from the context) of the bad code.
3. The exact code snippet of the proposed fixed code.
4. Any general strategy or recommendation.

Return the result as a JSON array of objects. Do not wrap it in markdown block if possible, just pure JSON or parseable JSON.
Format:
[
  {
    "code": "WCAG2AA.Principle1.Guideline1_1.1_1_1.H37",
    "message": "Img element missing an alt attribute.",
    "context": "<img src='logo.png'>",
    "explanation": "Images must have alternate text...",
    "proposedFix": "<img src='logo.png' alt='Company Logo'>"
  }
]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response if wrapped in markdown
    let jsonStr = text;
    if (jsonStr.includes('\`\`\`json')) {
      jsonStr = jsonStr.split('\`\`\`json')[1].split('\`\`\`')[0].trim();
    } else if (jsonStr.includes('\`\`\`')) {
      jsonStr = jsonStr.split('\`\`\`')[1].split('\`\`\`')[0].trim();
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error generating AI fix plan:', error);
    // Return dummy fix plan if AI fails (e.g. invalid API key)
    return scanReport.issues.map(issue => ({
      code: issue.code,
      message: issue.message,
      context: issue.context,
      explanation: 'AI was unable to generate an explanation (API Error/Key missing).',
      proposedFix: '<!-- Manual intervention needed -->'
    }));
  }
}

export { generateFixPlan };
