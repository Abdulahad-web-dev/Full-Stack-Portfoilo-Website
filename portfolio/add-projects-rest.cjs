const fs = require('fs');
const https = require('https');

// Read .env file since dotenv is acting up with ES modules
const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
});

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing URL or KEY");
    process.exit(1);
}

const projects = [
    {
        title: "Medical Store Management System",
        description: "A comprehensive web application for managing inventory, sales, and operations in a medical store environment.",
        demo: "https://abdulahadwarraichweb-debug.github.io/Medical-Store-Managment-System/",
        tags: ["HTML", "CSS", "JavaScript"],
        color: "#10B981",
        order: 1
    },
    {
        title: "Amazon Clone",
        description: "A functional front-end clone of the Amazon e-commerce platform featuring responsive design and product listings.",
        demo: "https://abdulahadwarraichweb-debug.github.io/Amazon---clone/",
        tags: ["HTML", "CSS", "JavaScript", "E-commerce"],
        color: "#F59E0B",
        order: 2
    }
];

const reqData = JSON.stringify(projects);

const parsedUrl = new URL(`${url}/rest/v1/projects`);

const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal'
    }
};

console.log("Sending REST request...");
const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
    res.on('end', () => console.log('\nDone.'));
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(reqData);
req.end();
