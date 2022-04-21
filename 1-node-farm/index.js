/**
 * ********** Dependencies **********
 */
const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/**
 * ********** Template **********
 */

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

/**
 * ********** Data **********
 */
const data = fs.readFileSync(`${__dirname}/database/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
/**
 * ********** Server **********
 */
const server = http.createServer(async (req, res) => {
    /**
     * **********Url**********
     */
    const { pathname, query } = url.parse(req.url, true);

    /**
     * **********Routing**********
     */

    // Overview page
    if (pathname === '/') {
        res.writeHead(200, {
            'content-Type': 'text/html',
        });

        const card = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', card);

        res.end(output);
    }
    // Product page
    else if (pathname === '/product') {
        res.writeHead(200, {
            'content-Type': 'text/html',
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    // Not Found page
    else {
        res.writeHead(404, {
            'content-Type': 'text/html',
        });
        res.end('<h1 style="color:red">404 page not found<h1>');
    }
});

const port = 8000;

/**
 * ********** Start the server **********
 */
server.listen(port, 'localhost', () => {
    console.log(`Server running on port ${port}`);
});
