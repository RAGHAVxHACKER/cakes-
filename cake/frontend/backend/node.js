const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = 3000;
const DATA_FILE = 'data.json';

// Initialize data.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        cakes: [
            { id: 1, name: 'Chocolate Delight', description: 'Rich chocolate cake', price: 25 },
            { id: 2, name: 'Vanilla Dream', description: 'Light vanilla cake', price: 20 }
        ],
        orders: [],
        locations: ['Delhi', 'Mumbai']
    }));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow frontend requests
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.end();
        return;
    }

    let data = JSON.parse(fs.readFileSync(DATA_FILE));

    // GET /api/cakes - Fetch cakes
    if (pathname === '/api/cakes' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.cakes));
    }
    // POST /api/orders - Create order
    else if (pathname === '/api/orders' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const order = JSON.parse(body);
            order.id = data.orders.length + 1;
            data.orders.push(order);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data));
            // Simulate payment processing
            console.log(`Payment processed for ${order.name}: ${order.payment}`);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Order placed successfully!');
        });
    }
    // GET /api/orders - Admin view orders (simple auth omitted)
    else if (pathname === '/api/orders' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.orders));
    }
    // POST /api/cakes - Admin add cake
    else if (pathname === '/api/cakes' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const cake = JSON.parse(body);
            cake.id = data.cakes.length + 1;
            data.cakes.push(cake);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data));
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Cake added!');
        });
    }
    // POST /api/locations - Admin add location
    else if (pathname === '/api/locations' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const location = JSON.parse(body);
            data.locations.push(location.city);
            fs.writeFileSync(DATA_FILE, JSON.stringify(data));
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Location added!');
        });
    }
    // Serve static files (e.g., for admin panel HTML)
    else if (pathname === '/admin' && method === 'GET') {
        fs.readFile('admin.html', (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});