const express = require("express");
const app = express();
const cors = require('cors')
app.set("port", 3843);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
const searcher = require("./mappings/searcher");

app.post("/person/search", async (req, res) => {
  const data = await searcher.person(req.body.keywords, req.body.size || 10);
  res.json(data);
});

app.post("/flim/search", async (req, res) => {
  const data = await searcher.flim(req.body.keywords, req.body.size || 10);
  res.json(data);
});

app.post("/post/search", async (req, res) => {
  const data = await searcher.post(req.body.keywords, req.body.size || 10);
  res.json(data);
});

app.post("/all/search", async (req, res) => {
  const person = await searcher.person(req.body.keywords, req.body.size || 10);
  const flim = await searcher.flim(req.body.keywords, req.body.size || 10);
  const post = await searcher.post(req.body.keywords, req.body.size || 10);
  res.json({ person, flim, post });
});

app.listen(app.get("port"), () => {
  console.log("http://localhost:" + app.get("port"));
});
