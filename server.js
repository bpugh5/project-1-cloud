require('dotenv').config()
var express = require('express');

var app = express();
app.use(express.json());

// let current_message_index = 0;
// let messages = {};

let businesses = {};
let reviews = {};
let photos = {};

// // Start listening on that port for connections
app.listen(process.env.PORT, () => {
    console.log("Server ready!");
});

///////////////////////////////////////////////////////////// BUSINESSES
app.get('/businesses', (req, res, next) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 5;
    var lastPage = Math.ceil(lodgings.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageBusinesses = businesses.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/businesses?page=' + (page + 1);
        links.lastPage = '/businesses?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/businesses?page=' + (page - 1);
        links.firstPage = '/businesses?page=1';
    }
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses,
        links: links
    });
    res.send(businesses);
});
/////////////////////////////////////////////////////////////

// //Handle certain API endpoints
// app.get("/messages", (req, res, next) => {
//     res.send(messages);
// });

// app.post("/messages", (req, res, next) => {
//     current_message_index++;

//     messages[current_message_index] = req.body;

//     res.send({
//         "index": current_message_index, 
//         "links": {
//             "message": `/messages/${current_message_index}`
//         }
//     });
// });

// app.get("/messages/:index", (req, res, next) => {
//     const index = req.params.index;
//     if (index < 0 || index >= messages.length || !(String(index) in messages)) {
//         res.status(404).send({"error": `Message ${index} not found`});
//         next();
//     }
//     res.send(messages[index]);
// });

// app.delete("/messages/:index", (req, res, next) => {
//     const index = req.params.index;
//     if (index < 0 || index >= messages.length) {
//         res.status(404).send({"error": `Message ${index} not found`});
//         next();
//     };
//     delete messages[index];
//     res.status(200).send("Successfully removed.");
// });