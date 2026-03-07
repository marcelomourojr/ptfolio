const fs = require('fs');
const https = require('https');

const url = "https://lh3.googleusercontent.com/pw/AP1GczNwz8mI2-p-E-0B3P-Q_2V9R8YQ9Z8H1yQ9X_8-2_9V8R7K8J_9x2_7"\;

https.get(url, (res) => {
  if (res.statusCode === 302 || res.statusCode === 301) {
    // Follow redirect
    console.log("Redirecting to:", res.headers.location);
    https.get(res.headers.location, (response) => {
      const file = fs.createWriteStream("public/images/sintony.png");
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log("Download completed");
      });
    }).on('error', (err) => {
       console.error("Error downloading redirected file:", err.message);
    });
  } else {
    // Normal download
    const file = fs.createWriteStream("public/images/sintony.png");
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("Download completed");
    });
  }
}).on('error', (err) => {
    console.error("Error on request:", err.message);
});
