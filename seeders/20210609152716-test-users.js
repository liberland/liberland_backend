module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        password: '$2b$10$d0FVQ2cgv6GNwgqq7vgjQuIAJFAqgI3wi/Y9d6h3iotY/SsUEo3Y2',
        email: 'user1@gmail.com',
        role: 'citizen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users');
  },
};
