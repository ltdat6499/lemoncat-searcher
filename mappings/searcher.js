const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
  hosts: ["http://elastic:changeme@127.0.0.1:9200/"],
});
client.cluster.health({}, (err, res, status) => {
  console.log("-- Client Health --");
  console.log("Everything is ok");
});

const person = async (keyWords, size = 10) => {
  const data = await client.search({
    index: "index-persons",
    size,
    body: {
      query: {
        bool: {
          should: [
            { match_phrase: { name: keyWords } },
            { match_phrase: { summary: keyWords } },
            { match_phrase: { slug: keyWords } },
            { match_phrase: { born_in: keyWords } },
          ],
        },
      },
    },
  });
  return data.hits.hits;
};

const flim = async (keyWords, size = 10) => {
  const data = await client.search({
    index: "index-flims",
    size,
    body: {
      query: {
        bool: {
          should: [
            { match_phrase: { name: keyWords } },
            { match_phrase: { summary: keyWords } },
            { match_phrase: { tags: keyWords } },
            { match_phrase: { genres: keyWords } },
            { match_phrase: { collection: keyWords } },
            { match_phrase: { productions: keyWords } },
            { match_phrase: { theatersDate: keyWords } },
            { match_phrase: { streamings: keyWords } },
            { match_phrase: { lemonScore: keyWords } },
          ],
        },
      },
    },
  });
  return data.hits.hits;
};

const post = async (keyWords, size = 10) => {
  const data = await client.search({
    index: "index-posts",
    size,
    body: {
      query: {
        bool: {
          should: [
            { match_phrase: { title: keyWords } },
            { match_phrase: { content: keyWords } },
            { match_phrase: { section: keyWords } },
            { match_phrase: { tags: keyWords } },
          ],
        },
      },
    },
  });
  return data.hits.hits;
};

module.exports = {
  person,
  flim,
  post,
};
