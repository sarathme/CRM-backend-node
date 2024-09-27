const { faker } = require("@faker-js/faker");

let users = [];

for (let i = 0; i < 5; i++) {
  const user = {
    name: faker.person.firstName(),
    personalEmail: faker.internet.email(),
    empCode: `CRM${faker.string.numeric(5)}`,
    password: "pass1234",
  };

  users.push(user);
}

module.exports = users;
