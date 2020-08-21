const express = require("express")
const fs = require("fs")

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

app.post("/api/notes", function(req, res) {
    res.json(req.body)

})

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
