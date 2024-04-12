require('dotenv').config()
var express = require('express');

var app = express();
app.use(express.json());

// let current_message_index = 0;
// let messages = {};

let businesses = {};
let business_index = 0;
let business_fields = ["name", "address", "city", "state", "zip", "phone", "category", "subcategory", "email", "website"];
let reviews = {};
let review_index = 0;
let photos = {};
let photo_index = 0;

// // Start listening on that port for connections
app.listen(process.env.PORT, () => {
    console.log("Server ready!");
});

//////////////////////////////////////////////////////////////////////////////////////// BUSINESSES

function verify(body, skip) {
    for (let i = 0; i < Object.keys(body).length; i++) {
        console.log(Object.keys(body)[i])
        if (Object.keys(body).includes(business_fields[i])) {
            continue;
        } else {
            return false;
        }
    } 
    return true;
};

app.get('/businesses', (req, res, next) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 5;
    var lastPage = Math.ceil(businesses.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageBusinesses = Object.entries(businesses).slice(start, end);
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

app.post("/businesses", (req, res, next) => {
    if (verify(req.body, next) == true) {
        business_index++;
    
        businesses[business_index] = req.body;
        req.body.links = {"business": `/businesses/${business_index}`};
    
        res.status(200);
        res.send(req.body);
    } else {
        res.status(404);
        res.send("Error: Something went wrong");
    }
});
////////////////////////////////////////////////////////////////////////////////////////

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