const express = require("express")
const fs = require("fs")

const app = express()

let count = 1;


var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function callback(err) {
    if (err) {
        throw err
    }
}


// Routes
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html", callback())

});

app.get("/notes", function (req, res) {
    res.sendFile(__dirname + "/public/notes.html", callback())

});

app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        else if (data) {
            res.json(JSON.parse(data))
        }
        else {
            res.json()
        }
    })
})

app.get("/api/notes/:id", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        const JSONData = JSON.parse(data)
        JSONData.forEach(noteData => {
            if (req.params.id === noteData.id) {
                return res.json(noteData)
            }

        })
    })
})

app.post("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        else if (data === "") {
            req.body.id = 1;
            fs.writeFile(__dirname + "/db/db.json", `[${JSON.stringify(req.body)}]`, err => { if (err) throw err })
        }
        else {
            const updateData = JSON.parse(data.split())
            req.body.id = updateData.length + 1;
            updateData.push(req.body)
            fs.writeFile(__dirname + "/db/db.json", JSON.stringify(updateData), err => { if (err) throw err })
            console.log(updateData)
        }
    })
    res.redirect("/notes")
})

app.delete("/api/notes/:id", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        const deleteData = JSON.parse(data.split());
        console.log(deleteData)
        deleteData.splice(req.params.id - 1, 1)
        for (let i = 0; i < deleteData.length; i++){
            deleteData[i].id = i + 1
        }
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(deleteData), err => { if (err) throw err })
    })
    res.send("true")


})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
