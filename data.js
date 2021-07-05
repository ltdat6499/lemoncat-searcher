const fs = require("fs");
const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
  hosts: ["http://elastic:changeme@127.0.0.1:9200/"],
});
client.cluster.health({}, (err, res, status) => {
  console.log("-- Client Health --", res);
  console.log("Everything is ok");
});
client.indices.create(
  {
    index: "viet-nam-work",
  },
  (err, res, status) => {
    if (err) {
      console.log(err);
    } else {
      console.log("created a new index", res);
    }
  }
);

let schema = fs.readFileSync("./search-index.json", "utf8");
schema = JSON.parse(schema);
client.indices.create({
  index: "viet-nam-work",
  type: "work_list",
  body: schema,
});

try {
  let data = fs.readFileSync("./data.json", "utf8");
  data = JSON.parse(data);
  const bulk = [];
  data.forEach((item) => {
    bulk.push({
      index: {
        _index: "viet-nam-work",
        _type: "work_list",
      },
    });
    bulk.push(item);
  });
  client.bulk({ body: bulk }, (err, res) => {
    if (err) {
      console.log("Failed Bulk operation".red, err);
    } else {
      console.log("Successfully imported ", data.length);
    }
  });
} catch (err) {
  console.error(err);
}
