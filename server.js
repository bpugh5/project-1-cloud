require('dotenv').config()
var express = require('express');

var app = express();
app.use(express.json());

// let current_message_index = 0;
// let messages = {};

// // Start listening on that port for connections
app.listen(process.env.PORT, () => {
    console.log("Server ready!");
});

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