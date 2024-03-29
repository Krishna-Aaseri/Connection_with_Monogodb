const express = require('express');
const bodyParser = require('body-parser');



// ###################################################################


// dbConfig
const dbConfig = {
    url: 'mongodb+srv://testuser:testpass@expressmongo-pgsfj.mongodb.net/test?retryWrites=true&w=majority'
}
const mongoose = require('mongoose');




mongoose.Promise = global.Promise;


// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true


}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {


    console.log('Could not connect to the database. Exiting now...', err);


    process.exit();
});
// #####################################################################


// Models
const NoteSchema = mongoose.Schema({
    title: String,
    content: String


}, {
    timestamps: true
});




const NoteModel = mongoose.model('Note', NoteSchema);


//######################################################################################################
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())
// ##############################################


// define a simple route

app.get('/notes', (req, res) => {
    NoteModel.find().then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});



// RETRIEVE LIST
app.get('/notes', (req, res) => {


    NoteModel.find().then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."


        });
    });
});




// CREATE
app.post('/notes', (req, res) => {


    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"


        });
    }




    // Create a Note
    const note = new NoteModel({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });




    // Save Note in the database
    note.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."


        });
    });
});






// RETRIEVE ONE
app.get('/notes/:noteId', (req, res) => {
    NoteModel.findById(req.params.noteId).then(note => {


        if (!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId


            });
        }
        res.send(note);
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId


            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId


        });
    });
});




// UPDATE
app.put('/notes/:noteId', (req, res) => {


    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"


        });
    }




    // Find note and update it with the request body
    NoteModel.findByIdAndUpdate(req.params.noteId, {
            title: req.body.title || "Untitled Note",
            content: req.body.content
        }, {
            new: true
        })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({


                message: "Error updating note with id " + req.params.noteId


            });
        });
});




// Delete a Note with noteId
app.delete('/notes/:noteId', (req, res) => {


    NoteModel.findByIdAndRemove(req.params.noteId).then(note => {


        if (!note) {
            return res.status(404).send({


                message: "Note not found with id " + req.params.noteId


            });
        }
        res.send({
            message: "Note deleted successfully!"
        });


    }).catch(err => {


        if (err.kind === 'ObjectId' || err.name === 'NotFound') {


            return res.status(404).send({


                message: "Note not found with id " + req.params.noteId


            });
        }
        return res.status(500).send({


            message: "Could not delete note with id " + req.params.noteId


        });
    });
});
// #################################################################

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});