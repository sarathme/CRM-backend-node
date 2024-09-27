const { faker } = require("@faker-js/faker");

let products = [];

for (let i = 0; i < 50; i++) {
  const product = {
    productName: faker.commerce.productName(),
    productMaterial: faker.commerce.productMaterial(),
    productCatogary: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    pricePerUnit: faker.commerce.price({ min: 10, max: 500 }),
    stockAvailable: faker.number.int({ min: 1, max: 200 }),
    createdAt: faker.date.between({ from: "2020-01-01", to: Date.now() }),
  };

  products.push(product);
}

module.exports = products;
