require('dotenv').config()
var express = require('express');

var app = express();
app.use(express.json());

// let current_message_index = 0;
// let messages = {};

let businesses = {};
let business_index = 0;
let required_business_fields = ["name", "address", "city", "state", "zip", "phone", "category", "subcategory"];
let optional_business_fields = ["email", "website"];
let reviews = {};
let required_review_fields = ["stars", "dollar signs"];
let optional_review_fields = ["review"];
let review_index = 0;
let photos = {};
let photo_index = 0;

// // Start listening on that port for connections
app.listen(process.env.PORT, () => {
    console.log("Server ready!");
});

//////////////////////////////////////////////////////////////////////////////////////// BUSINESSES

function verify(body) {
    // user passes in object
    // object should be iterated over, and each key of object should be checked to make sure it exists in required or optional fields
    
    // object should be checked to make sure it has ALL required fields

    // iterate over required fields
    body_keys = Object.keys(body);

    for (let i = 0; i < required_business_fields.length; i++) {
        if (body_keys.includes(required_business_fields[i])) {
            continue;
        } else {
            return false;
        }
    }
    for (let j = 0; j < body_keys.length; j++) {
        if (!required_business_fields.includes(body_keys[j]) && !optional_business_fields.includes(body_keys[j])) {
            return false;
        } else {
            continue;
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
    };
    if (page > 1) {
        links.prevPage = '/businesses?page=' + (page - 1);
        links.firstPage = '/businesses?page=1';
    };
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses,
        links: links
    });
});

app.post("/businesses", (req, res, next) => {
    if (verify(req.body) == true) {
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

app.get("businesses/:businessID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        res.status(200).json(businesses[businessID]);
    } else {
        next();
    }
});

app.put("/businesses/:businessID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        if (verify(req.body) == true) {
            businesses[req.params.businessID] = req.body;
            res.status(200).json({
                links: {
                    business: `/businesses/${req.params.businessID}`
                }
            });
        };
    } else {
        next();
    };
});

app.delete('/businesses/:businessID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        businesses[businessID] = null;
        res.status(204).end();
    } else {
        next();
    };
});
////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////// REVIEWS

function verify(body) {
    body_keys = Object.keys(body);

    for (let i = 0; i < required_review_fields.length; i++) {
        if (body_keys.includes(required_review_fields[i])) {
            continue;
        } else {
            return false;
        }
    }
    for (let j = 0; j < body_keys.length; j++) {
        if (!required_review_fields.includes(body_keys[j]) && !optional_review_fields.includes(body_keys[j])) {
            return false;
        } else {
            continue;
        }
    }
    return true;
};

app.post("/businesses/:businessID/reviews", (req, res, next) => {
    if (verify(req.body) == true) {
        review_index++;
    
        reviews[review_index] = req.body;
        // DOES THIS WORK!?!?!?? WTF
        req.body.links = {"review": `/businesses/${req.params.businessID}/reviews/${review_index}`};
    
        res.status(200);
        res.send(req.body);
    } else {
        res.status(404);
        res.send("Error: Something went wrong");
    }
});

app.get('/businesses/:businessID/reviews', (req, res, next) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 5;
    var lastPage = Math.ceil(reviews.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageReviews = Object.entries(reviews).slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/reviews?page=' + (page + 1);
        links.lastPage = '/reviews?page=' + lastPage;
    };
    if (page > 1) {
        links.prevPage = '/reviews?page=' + (page - 1);
        links.firstPage = '/reviews?page=1';
    };
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: reviews.length,
        reviews: pageReviews,
        links: links
    });
});

app.put("/businesses/:businessID/reviews/:reviewID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    var reviewID = parseInt(req.params.reviewID);
    if (businesses[businessID]) {
        if (reviews[reviewID]) {
            if (verify(req.body) == true) {
                reviews[req.params.reviewID] = req.body;
                res.status(200).json({
                    links: {
                        review: `/businesses/${businessID}/reviews/${reviewID}`,
                        // this will need to be made dynamic
                        creator: `/users/1`,
                    }
                });
            };
        } else {
            next();
        };
    };
});

app.delete('/businesses/:businessID/reviews/:reviewID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    var reviewID = parseInt(req.params.reviewID);
    if (businesses[businessID]) {
        if (reviews[reviewID]) {
            reviews[reviewID] = null;
            res.status(204).end();
        } else {
            next();
        };
    };
});

app.get('/users/:userID/reviews', (req, res, next) => {
    var userID = parseInt(req.params.userID);
    res.status(200).send(a)
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