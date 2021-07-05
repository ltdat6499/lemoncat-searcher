const elasticsearch = require("elasticsearch");
const express = require("express");
const app = express();
const client = new elasticsearch.Client({
  hosts: ["http://elastic:changeme@127.0.0.1:9200/"],
});
app.set("port", 2945);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  let body = {
    size: 10,
    from: 0,
    query: {
      match: req.body,
    },
  };
  client
    .search({ index: "viet-nam-work", body: body, type: "work_list" })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.send([]);
    });
});

app.get("/nested", (req, res) => {
  let body = {
    size: 10,
    from: 0,
    query: {
      nested: req.body,
      score_mode: "avg",
    },
  };
  client
    .search({ index: "viet-nam-work", body, type: "nested" })
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
      res.send([]);
    });
});

app.listen(app.get("port"), () => {
  console.log("http://localhost:" + app.get("port"));
});
