import pa11y from 'pa11y';

async function scanWebsite(url) {
  try {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      includeWarnings: false,
      includeNotices: false,
      wait: 2000,
      chromeLaunchConfig: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    // Process results to make them concise and only include strict errors
    const issues = results.issues
      .filter(issue => issue.type === 'error')
      .map(issue => ({
      type: issue.type,
      code: issue.code,
      message: issue.message,
      context: issue.context,
      selector: issue.selector
    }));

    return {
      documentTitle: results.documentTitle,
      pageUrl: results.pageUrl,
      issues
    };
  } catch (error) {
    console.error('Error scanning website:', error);
    throw error;
  }
}

export { scanWebsite };
