const { faker } = require("@faker-js/faker");

const queryTypes = ["product", "order", "other"];

let queries = [];
for (let i = 0; i < 20; i++) {
  const query = {
    subject: faker.lorem.sentence(5),
    description: faker.lorem.paragraph(4),
    raisedAt: faker.date.between({ from: "2020-01-01", to: Date.now() }),
    status: "open",
    queryType: queryTypes[Math.floor(Math.random() * queryTypes.length)],
  };

  queries.push(query);
}

module.exports = queries;
