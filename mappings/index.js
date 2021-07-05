const fs = require("fs");
const readline = require("readline");
const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
  hosts: ["http://elastic:changeme@127.0.0.1:9200/"],
});
client.cluster.health({}, (err, res, status) => {
  console.log("-- Client Health --");
  console.log("Everything is ok");
});

const loadArray = async (name) => {
  const file = fs.createReadStream(name);

  const readLine = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of readLine) {
    results.push(line);
  }
  return results;
};

const addIndex = async (indexName, typeName, path) => {
  try {
    await client.indices.delete({ index: indexName });
    console.log(`INDEX ${indexName} DELETE OK`);
  } catch (error) {
    console.log(`INDEX ${indexName} DELETE FAILED`);
  }

  try {
    await client.indices.create({
      index: indexName,
    });
    console.log(`INDEX ${indexName} CREATE OK`);
  } catch (error) {
    console.log(`INDEX ${indexName} CREATE FAILED`);
  }

  try {
    let schema = await fs.readFileSync(path + "mapping.json", "utf8");
    schema = JSON.parse(schema);
    await client.indices.putMapping({
      index: indexName,
      body: schema.mappings,
    });
    console.log(`INDEX ${indexName} MAPPING OK`);
  } catch (error) {
    console.log(`INDEX ${indexName} MAPPING FAILED`);
  }

  let files = await fs.readdirSync(path);
  files = files.filter((item) => item.includes(".txt"));
  for (const file of files) {
    let data = [];
    data = await loadArray(path + file);
    data = JSON.parse(data);
    const body = [];
    for (const item of data) {
      body.push({
        index: {
          _index: indexName,
        },
      });
      body.push(item);
    }
    try {
      await client.bulk({ refresh: true, body: body.splice(0, data.length / 2) });
      await client.bulk({ refresh: true, body: body.splice(data.length / 2, data.length) });
      console.log("Successfully imported ");
    } catch (error) {
      console.log(error.message);
    }
  }
};

// addIndex("index-persons", "persons", "./persons/");
// addIndex("index-flims", "flims", "./flims/");
// addIndex("index-posts", "posts", "./posts/");
