const { faker } = require("@faker-js/faker");

const sources = ["socialMedia", "inPersonVisit", "call", "website"];
let customers = [];
for (let i = 0; i < 50; i++) {
  const customer = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    },
    phone: faker.phone.number({ style: "national" }),
    source: sources[Math.floor(Math.random() * sources.length)],
    joinedAt: faker.date.between({ from: "2020-01-01", to: Date.now() }),
  };

  customer.lastLogin = faker.date.between({
    from: customer.joinedAt,
    to: Date.now(),
  });
  (customer.email = faker.internet.email({
    firstName: customer.firstName,
    lastName: customer.lastName,
  })),
    customers.push(customer);
}

module.exports = customers;
