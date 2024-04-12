#!/bin/sh

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

# This is a comment
# This is where I'm testing the businesses endpoint

status 'GET business-by-id should return success'
curl http://localhost:3000/businesses/2

status 'GET business-by-id should return failure'
curl http://localhost:3000/businesses/9999

# Here's an example of splitting a big command across
# multiple lines by ending the line with "\":

curl -v -X PUT \
    -H 'Content-Type: application/json' \
    -d '{"starRating": "1", "dollarRaing": "1", "review": "Do not wish to return"}' \
    http://localhost:3000/reviews/2

# etc.