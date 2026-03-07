const https = require('https');
const fs = require('fs');

const url = "https://lh3.googleusercontent.com/pw/AP1GczNwz8mI2-p-E-0B3P-Q_2V9R8YQ9Z8H1yQ9X_8-2_9V8R7K8J_9x2_7"\;

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
  }
}, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log("Redirecting to", res.headers.location);
    https.get(res.headers.location, (response) => {
      const file = fs.createWriteStream("public/images/sintony.webp");
      response.pipe(file);
      file.on('finish', () => { file.close(); console.log("Done"); });
    });
  } else {
    console.log("No redirect, status:", res.statusCode);
  }
}).on('error', (e) => console.error(e));
