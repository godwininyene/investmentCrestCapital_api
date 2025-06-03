'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin@1234', 12);

    await queryInterface.bulkInsert('Users', [{
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@investmentcrestcapital.com',
      phone: '+12345678901',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      emailVerificationCode: null,
      emailVerificationExpires: null,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@investmentcrestcapital.com' }, {});
  }
};
