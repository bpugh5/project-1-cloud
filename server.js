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
let required_photo_fields = ["image"];
let optional_photo_fields = ["caption"];
let photo_index = 0;

// // Start listening on that port for connections
app.listen(process.env.PORT, () => {
    console.log("Server ready!");
});

function post_verify(body, req_fields, opt_fields) {
    // user passes in object
    // object should be iterated over, and each key of object should be checked to make sure it exists in required or optional fields
    // object should be checked to make sure it has ALL required fields

    body_keys = Object.keys(body);
    if (body_keys.length < req_fields.length || body_keys.length > (req_fields.length + opt_fields.length)) {
        return false;
    };

    for (let i = 0; i < req_fields.length; i++) {
        if (body_keys.includes(req_fields[i])) {
            continue;
        } else {
            return false;
        };
    };
    for (let j = 0; j < body_keys.length; j++) {
        if (!req_fields.includes(body_keys[j]) && !opt_fields.includes(body_keys[j])) {
            return false;
        } else {
            continue;
        };
    };
    return true;
};

function put_verify(body, req_fields, opt_fields) {
    body_keys = Object.keys(body);

    for (let j = 0; j < body_keys.length; j++) {
        if (!req_fields.includes(body_keys[j]) && !opt_fields.includes(body_keys[j])) {
            return false;
        } else {
            continue;
        };
    };
    return true;
};

//////////////////////////////////////////////////////////////////////////////////////// BUSINESSES

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

app.get("/businesses/:businessID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        res.status(200).json({business: businesses[businessID], reviews: reviews, photos: photos});
    } else {
        next();
    };
});

app.post("/businesses", (req, res) => {
    if (post_verify(req.body, required_business_fields, optional_business_fields) == true) {
        business_index++;
    
        businesses[business_index] = req.body;
        req.body.links = {"business": `/businesses/${business_index}`};
    
        res.status(201).json({
            id: business_index,
            links: {
                business: `/businesses/${business_index}`
            }
        });
    } else {
        res.status(404);
        let response_text = "Error: Something went wrong";
        if (Object.keys(req.body).length < required_business_fields.length) {
            response_text = "Error: Missing field(s)";
        }
        res.send(response_text);
    };
});

app.put("/businesses/:businessID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        if (put_verify(req.body, required_business_fields, optional_business_fields) == true) {
            var body_keys = Object.keys(req.body);
            for (let i = 0; i < body_keys.length; i++) {
                businesses[businessID][body_keys[i]] = req.body[body_keys[i]];
            }
            res.status(200).json({
                links: {
                    business: `/businesses/${businessID}`
                }
            });
        } else {
            res.status(400).send("Error: Invalid body");
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

// get all reviews of a business
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
        links.nextPage = `/businesses/${req.query.businessID}/reviews?page=` + (page + 1);
        links.lastPage = `/businesses/${req.query.businessID}/reviews?page=` + lastPage;
    };
    if (page > 1) {
        links.prevPage = `/businesses/${req.query.businessID}/reviews?page=` + (page - 1);
        links.firstPage = `/businesses/${req.query.businessID}/reviews?page=1`;
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

app.get('/users/:userID/reviews', (req, res, next) => {
    var userID = parseInt(req.params.userID);
    res.status(200).send(reviews)
});

app.post("/businesses/:businessID/reviews", (req, res, next) => {
    // Note that it will eventually need to be limited to one review per user
    if (post_verify(req.body, required_review_fields, optional_review_fields) == true) {
        review_index++;
    
        reviews[review_index] = req.body;
        req.body.links = {"review": `/businesses/${req.params.businessID}/reviews/${review_index}`};
    
        res.status(201);
        res.send(req.body);
    } else {
        res.status(404);
        let response_text = "Error: Something went wrong";
        if (Object.keys(req.body).length < required_review_fields.length) {
            response_text = "Error: Missing field(s)";
        }
        res.send(response_text);
    }
});

app.put("/businesses/:businessID/reviews/:reviewID", (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    var reviewID = parseInt(req.params.reviewID);
    // to be implemented in next part(?)
    // if (businesses[businessID]) {
        if (reviews[reviewID]) {
            if (put_verify(req.body, required_review_fields, optional_review_fields) == true) {
                var body_keys = Object.keys(req.body);
                for (let i = 0; i < body_keys.length; i++) {
                    reviews[reviewID][body_keys[i]] = req.body[body_keys[i]];
                }
                res.status(200).json({
                    links: {
                        review: `/businesses/${businessID}/reviews/${reviewID}`,
                        // this will need to be made dynamic
                        creator: `/users/1`,
                    }
                });
            } else {
                res.status(400).send("Error: Invalid body");
            };
        } else {
            next();
        };
    // } else {
        // next();
    // };
});

app.delete('/businesses/:businessID/reviews/:reviewID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    var reviewID = parseInt(req.params.reviewID);
    // to be implemented in next part(?)
    // if (businesses[businessID]) {
        if (reviews[reviewID]) {
            reviews[reviewID] = null;
            res.status(204).end();
        } else {
            next();
        };
    // };
});

////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////// PHOTOS

app.get('/users/:userID/businesses', (req, res, next) => {
    userID = parseInt(req.query.userID);
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
        links.nextPage = `/users/${userID}/businesses?page=` + (page + 1);
        links.lastPage = `/users/${userId}/businesses?page=` + lastPage;
    };
    if (page > 1) {
        links.prevPage = `/users/${userID}/businesses?page=` + (page - 1);
        links.firstPage = `/users/${userID}/businesses?page=1`;
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

app.get('/users/:userID/photos', (req, res, next) => {
    var userID = parseInt(req.query.userID);
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 5;
    var lastPage = Math.ceil(photos.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pagePhotos = Object.entries(photos).slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = `/users/${userID}/photos?page=` + (page + 1);
        links.lastPage = `/users/${userID}/photos?page=` + lastPage;
    };
    if (page > 1) {
        links.prevPage = `/users/${userID}/photos?page=` + (page - 1);
        links.firstPage = `/users/${userID}/photos?page=1`;
    };
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: photos.length,
        photos: pagePhotos,
        links: links
    });
});

app.post("/businesses/:businessID/photos", (req, res, next) => {
    if (post_verify(req.body, required_photo_fields, optional_photo_fields) == true) {
        photo_index++;
    
        photos[photo_index] = req.body;
        req.body.links = {"photo": `/businesses/${business_index}/photos/${photo_index}`};
    
        res.status(201);
        res.send(req.body);
    } else {
        res.status(404);
        let response_text = "Error: Something went wrong";
        if (Object.keys(req.body).length < required_photo_fields.length) {
            response_text = "Error: Missing field(s)";
        }
        res.send(response_text);
    }
});

app.delete('/users/:userID/photos/:photoID', (req, res, next) => {
    // var userID = parseInt(req.params.userID);
    var photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
        photos[photoID] = null;
        res.status(204).end();
    } else {
        next();
    };
});

app.put("/users/:userID/photos/:photoID", (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    var userID = parseInt(req.params.userID);
    if (photos[photoID]) {
        if (!("image" in req.body)) {
            if (put_verify(req.body, required_photo_fields, optional_photo_fields) == true) {
                var body_keys = Object.keys(req.body);
                for (let i = 0; i < body_keys.length; i++) {
                    photos[photoID][body_keys[i]] = req.body[body_keys[i]];
                };
                photos[req.params.photoID] = req.body;
                res.status(200).json({
                    links: {
                        photo: `/users/${userID}/photos/${req.params.photoID}`
                    }
                });
            } else {
                res.status(400).send("Error: Invalid body");
            };
        } else {
            res.status(400).send("Error: Cannot modify photo");
        }
    } else {
        next();
    };
});

////////////////////////////////////////////////////////////////////////////////////////

app.use('*', function (req, res) {
    res.status(404).send({
        err: "The requested resource doesn't exist"
    });
});