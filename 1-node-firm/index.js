const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    fs.readFile('./txt/hello.txt', 'utf-8', (err, data) => {
        res.end(data);
        console.log(req);
    });
});

const port = 8000;

server.listen(port, 'localhost', () => {
    console.log(`Server running on port ${port}`);
});
