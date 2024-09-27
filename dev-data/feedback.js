const { faker } = require("@faker-js/faker");

const feedbacks = [];

const feedbackTypes = ["service", "product"];
for (let i = 0; i < 20; i++) {
  const feedback = {
    subject: faker.lorem.sentence(5),
    description: faker.lorem.paragraph(4),
    givendAt: faker.date.between({ from: "2020-01-01", to: Date.now() }),
    rating: faker.number.float({ multipleOf: 0.5, min: 2, max: 5 }),
    feedbackType:
      feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)],
  };

  feedbacks.push(feedback);
}

module.exports = feedbacks;
