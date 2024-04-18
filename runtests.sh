#!/bin/sh

purple=$(tput setaf 140)
green=$(tput setaf 2)
normal=$(tput sgr0)

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$green $1 $normal"
    printf $purple -- $normal "-----------------------------------------------------\n"
}

############################################################### BUSINESS TESTS

################ GET TESTS
status 'Initial GET businesses should return empty object'
curl http://localhost:3000/businesses

###

status 'GET businesses should return object after one is POSTed'
# Set up
curl -H 'Content-Type: application/json' \
    -d '{"name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses
printf "\n\n"

# Exercise
curl http://localhost:3000/businesses

###

status 'GET businesses page 2 should return second page, not page 1'
# Set up first page + 1 more that will be on second page
for i in {1..6};
do
    curl -H 'Content-Type: application/json' \
    -d '{"name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses
    printf "\n"
done
printf "\n"

# Exercise
curl http://localhost:3000/businesses?page=2

###

status 'GET negative page number returns first page'
# Exercise
curl http://localhost:3000/businesses?page=-1

###

status 'GET invalid page number returns first page'
# Exercise
curl http://localhost:3000/businesses?page=A
################ GET TESTS

################ POST TESTS
status 'POST to /businesses should return success'
# Exercise
curl -v -H 'Content-Type: application/json' \
    -d '{"name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses

###

# I feel like this should be changed, but it works in part 2/3
status 'POST two identical businesses to /businesses should return success'
# Exercise
for i in {1..2};
do
    curl -H 'Content-Type: application/json' \
    -d '{"name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses
    printf "\n"
done

###

status "POST to /businesses that is too short should return 'Error: Missing field(s)'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{"name": "Macdonal", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses

###

status "POST to /businesses request that is too long should return 'Error: Something went wrong'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{"extra_field": "extra", "name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses
################ POST TESTS

################ SPECIFIC GET TESTS
status 'GET businesses/1 returns success'
# Exercise
curl -X GET http://localhost:3000/businesses/1

###

status 'GET businesses/9999 returns failure'
# Exercise
curl -X GET http://localhost:3000/businesses/9999
################ SPECIFIC GET TESTS

################ PUT TESTS
status 'PUT to businesses/1 returns success'
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"name": "Macdonaldz", "address": "234 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses/1

###

status "Incomplete PUT businesses/1 returns success"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"name": "Macdonaldze", "category": "Restaurante", "subcategory": "Pizzar"}' \
    http://localhost:3000/businesses/1
    
###

status "Invalid PUT businesses/1 returns 'Error: Invalid body'"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"extrafield": "extra", "name": "Macdonal", "address": "123 Main St.", "city": "Bend", "state": "Oregon", "zip": "97702", "phone": "555-555-5555", "category": "Restaurant", "subcategory": "Pizza"}' \
    http://localhost:3000/businesses/1
################ PUT TESTS

################ DELETE TESTS
status "DELETE businesses/1 should return success"
curl -v -X DELETE http://localhost:3000/businesses/1

###

status "DELETE /businesses/9999 should return failure"
curl -v -X DELETE http://localhost:3000/businesses/9999
################ DELETE TESTS

############################################################### BUSINESS TESTS

############################################################### REVIEW TESTS
################ GET TESTS
status 'Initial GET reviews should return empty object'
curl http://localhost:3000/businesses/1/reviews

# ###

status 'GET reviews should return object after one is POSTed'
# Set up
curl -X POST -H 'Content-Type: application/json' \
    -d '{"stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews
printf "\n\n"

# Exercise
curl http://localhost:3000/businesses/1/reviews

# ###

status 'GET businesses/1/reviews page 2 should return second page, not page 1'
# Set up first page + 1 more that will be on second page
for i in {1..6};
do
curl -X POST -H 'Content-Type: application/json' \
    -d '{"stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews
    printf "\n"
done
printf "\n"

# Exercise
curl http://localhost:3000/businesses/1/reviews?page=2

# ###

status 'GET negative page number returns first page'
# Exercise
curl http://localhost:3000/businesses/1/reviews?page=-1

# ###

status 'GET invalid page number returns first page'
# Exercise
curl http://localhost:3000/businesses/1/reviews?page=A
################ GET TESTS

################ POST TESTS
status 'POST to /businesses/1/reviews should return success'
# Exercise
curl -v -X POST -H 'Content-Type: application/json' \
    -d '{"stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews

###

# I feel like this should be changed, but it works in part 2/3
status 'POST two identical reviews to /businesses/1/reviews should return success'
# Exercise
for i in {1..2};
do
    curl -X POST -H 'Content-Type: application/json' \
        -d '{"stars": 5, "dollar signs": 4}' \
        http://localhost:3000/businesses/1/reviews
    printf "\n"
done

###

status "POST to /businesses/1/reviews that is too short should return 'Error: Missing field(s)'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{"stars": 5}' \
    http://localhost:3000/businesses/1/reviews

# ###

status "POST to /businesses request that is too long should return 'Error: Something went wrong'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{"extra_field": "extra", "stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews
################ POST TESTS

################ PUT TESTS
status 'PUT to businesses/1/reviews/1 returns success'
curl -X POST -H 'Content-Type: application/json' \
        -d '{"stars": 5, "dollar signs": 4}' \
        http://localhost:3000/businesses/1/reviews
printf "\n"

# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews/1

###

status "Incomplete PUT businesses/1/reviews/1 returns success"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"stars": 4}' \
    http://localhost:3000/businesses/1/reviews/1
    
###

status "Invalid PUT businesses/1/reviews/1 returns 'Error: Invalid body'"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"extrafield": "extra", "stars": 5, "dollar signs": 4}' \
    http://localhost:3000/businesses/1/reviews/1
################ PUT TESTS

################ DELETE TESTS
status "DELETE businesses/1/reviews/1 should return success"
curl -v -X DELETE http://localhost:3000/businesses/1/reviews/1

###

status "DELETE /businesses/1/reviews/9999 should return failure"
curl -v -X DELETE http://localhost:3000/businesses/reviews/9999
################ DELETE TESTS

################ GET TESTS
status "GET /users/1/reviews should return success"
curl http://localhost:3000/users/1/reviews

status "GET reviews should return object after one is POSTed"
curl http://localhost:3000/users/1/reviews
################ GET TESTS

############################################################### REVIEW TESTS

############################################################### PHOTO TESTS

################ GET TESTS
status 'Initial GET photos should return empty object'
curl http://localhost:3000/users/1/photos

###

status 'GET businesses/1/photos should return object after one is POSTed'
# Set up
curl -H 'Content-Type: application/json' \
    -d '{"image": "http://cat.png"}' \
    http://localhost:3000/businesses/1/photos
printf "\n\n"

# Exercise
curl http://localhost:3000/users/1/photos

###

status 'Initial GET user businesses should return all businesses (for now)'
curl http://localhost:3000/users/1/businesses

###

status 'GET businesses/1/photos page 2 should return second page, not page 1'
# Set up first page + 1 more that will be on second page
for i in {1..6};
do
    curl -H 'Content-Type: application/json' \
    -d '{"image": "http://cat.png"}' \
    http://localhost:3000/businesses/1/photos
    printf "\n"
done
printf "\n"

# Exercise
curl http://localhost:3000/users/1/photos?page=2

###

status 'GET negative page number returns first page'
# Exercise
curl http://localhost:3000/businesses?page=-1

###

status 'GET invalid page number returns first page'
# Exercise
curl http://localhost:3000/businesses?page=A
################ GET TESTS

################ POST TESTS
status 'POST to /businesses/1/photos should return success'
# Exercise
curl -v -H 'Content-Type: application/json' \
    -d '{"image": "http://cat.png"}' \
    http://localhost:3000/businesses/1/photos

###

# I feel like this should be changed, but it works in part 2/3
status 'POST two identical photos to /businesses/1/photos should return success'
# Exercise
for i in {1..2};
do
    curl -H 'Content-Type: application/json' \
    -d '{"image": "http://cat.png"}' \
    http://localhost:3000/businesses/1/photos
    printf "\n"
done

###

status "POST to /businesses that is too short should return 'Error: Missing field(s)'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{}' \
    http://localhost:3000/businesses/1/photos

###

status "POST to /businesses/1/photos request that is too long should return 'Error: Something went wrong'"
# Exercise
curl -H 'Content-Type: application/json' \
    -d '{"extra_field": "extra", "image": "http://cat.png"}' \
    http://localhost:3000/businesses/1/photos
# ################ POST TESTS

################ PUT TESTS
status 'PUT to /users/1/photos/1 returns success'
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"caption": "Hi"}' \
    http://localhost:3000/users/1/photos/1

status "PUT to /users/1/photos/1 with a new photo should return 'Error: Cannot modify photo'"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"image": "http://cat1.png"}' \
    http://localhost:3000/users/1/photos/1
    
###

status "Invalid PUT users/1/photos/1 returns 'Error: Invalid body'"
# Exercise
curl -X PUT -H 'Content-Type: application/json' \
    -d '{"extrafield": "extra", "caption": "Hii"}' \
    http://localhost:3000/users/1/photos/1
################ PUT TESTS

################ DELETE TESTS
status "DELETE businesses/1 should return success"
curl -v -X DELETE http://localhost:3000/users/1/photos/1

###

status "DELETE /businesses/9999 should return failure"
curl -v -X DELETE http://localhost:3000/users/1/photos/9999
################ DELETE TESTS

############################################################### PHOTO TESTS