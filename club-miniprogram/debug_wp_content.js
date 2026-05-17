const https = require('https');
const fs = require('fs');

const url = 'https://www.mufengtiyan.com/wp-json/wp/v2/pages?slug=about-us&_embed';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const pages = JSON.parse(data);
            if (pages && pages.length > 0) {
                const content = pages[0].content.rendered;
                console.log('Content fetched successfully.');
                fs.writeFileSync('debug_content.html', content);
            } else {
                console.log('No pages found.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching URL:', err);
});
