const http = require('node:http');

function handler (req, res) {
 console.log("Request recived");
    // create category
    if (req.url == '/create-category') {
        res.end('Category created');
    }
    // delete category
    else if (req.url == '/delete-category') {
        res.end('Category deleted');
    }
    // update category
    else if (req.url == '/update-category') {
        res.end('Category updated');
    }
    // get category
    else if (req.url == '/get-category') {
        res.end('Category retrieved');
    }
    else {
        res.end('Invalid endpoint');
    }

}

http.createServer(handler).listen(3000, () => {
    console.log("Server is running on port 3000");
})
