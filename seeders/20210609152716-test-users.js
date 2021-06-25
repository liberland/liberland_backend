module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        password: '$2b$10$d0FVQ2cgv6GNwgqq7vgjQuIAJFAqgI3wi/Y9d6h3iotY/SsUEo3Y2',
        email: 'citizen@gmail.com',
        role: 'citizen',
        origin: 'Ukraine',
        name: 'Dmitro',
        lastName: 'Kisilev',
        languages: ['English', 'Russian'],
        occupation: 'Reporter',
        gender: 'Male',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet elementum vel diam neque orci id egestas.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        password: '$2b$10$d0FVQ2cgv6GNwgqq7vgjQuIAJFAqgI3wi/Y9d6h3iotY/SsUEo3Y2',
        email: 'non-citizen@gmail.com',
        role: 'non-citizen',
        origin: 'Ukraine',
        name: 'Dmitro',
        lastName: 'Kisilev',
        languages: ['English', 'Russian'],
        occupation: 'Reporter',
        gender: 'Male',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet elementum vel diam neque orci id egestas.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        password: '$2b$10$d0FVQ2cgv6GNwgqq7vgjQuIAJFAqgI3wi/Y9d6h3iotY/SsUEo3Y2',
        email: 'e-resident@gmail.com',
        role: 'e-resident',
        origin: 'Ukraine',
        name: 'Dmitro',
        lastName: 'Kisilev',
        languages: ['English', 'Russian'],
        occupation: 'Reporter',
        gender: 'Male',
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet elementum vel diam neque orci id egestas.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users');
  },
};
