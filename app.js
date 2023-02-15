//requiring
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

//App setup
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set('strictQuery', true);


//setup mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDb", { useNewUrlParser: true });
const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////REQUEST TARGETTING ALL ARTICLES////////////////////////////////////
app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {
        console.log(foundArticles);
        res.send(foundArticles);
    });
});

app.post("/articles", (req, res) => {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (!err) { res.send("Successfull Added"); }
        else { res.send("Error occurred") }
    });
});

app.delete("/articles", (req, res) => {

    Article.deleteMany((err) => {
        if (!err) { res.send("successfully deleted all articles"); }
    });

});

///////////////////////////////////////REQUEST TARGETTING SPECIFIC ARTICLES////////////////////////////////////
app.route("/articles/:articleTitle")
    .get((req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.findOne({ title: articleTitle }, (err, foundArticle) => {
            res.send(foundArticle);
        })
    })

    .put((req, res) => { //IDK why put workks same as patch ,if i dont send any title value,the old title value remains there but actually it should be deleted
        console.log({ title: req.body.newTitle, content: req.body.newContent });
        Article.updateOne(//update is deprecated, updateOne works 
            { title: req.params.articleTitle },
            { title: req.params.newTitle, content: req.body.newContent },
            // {overwrite:true},//if you dont mention this in mongoose and update some fields, the other fields will be deleted(doesnt work gives error)
            (err) => {
                if (!err) {
                    res.send("Update success");
                } else {
                    console.log(err);
                }
            })
    })

    .patch((req, res) => {
        console.log(req.body);
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },//{content:"whatever"} only the content will be updated 
            (err) => {
                if (!err) {
                    res.send("Patch Update success");
                } else {
                    console.log(err);
                }
            })
    })

    .delete((req,res)=>{
        Article.deleteOne(
            {title:req.params.articleTitle},
            (err)=>{
                console.log("Delete success");
            })
        });
        
    
app.listen(3000);
