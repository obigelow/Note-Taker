const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function callback(err) {
    if (err){
        throw err
    }
}


// Routes
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html", callback())
  
});

app.get("/notes", function(req, res) {
    res.sendFile(__dirname + "/public/notes.html", callback())
  
});

app.get("/api/notes", function(req, res){
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data){
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.get("/api/notes/:id", function(req, res){
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data){
        if (err) throw err;
        const JSONData = JSON.parse(data)
        console.log(JSONData)
        JSONData.forEach(noteData => {
            if (req.params.id === noteData.id) {
                return res.json(noteData)
            }

        })
    })
})

app.post("/api/notes", function(req, res) {
    let count = 1;
    const addId = req.body;
    addId.id = count;
    count++
    console.log(addId)
    
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data){
        if (err) throw err;
        const updateData = data.split("]").join(`, ${JSON.stringify(req.body)} ]`)
        fs.writeFile(__dirname + "/db/db.json", updateData, err => {if (err) throw err})
    })
})
app.delete("/api/notes/:id", function(req, res){
    const note = res.params
    console.log(note)
})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
