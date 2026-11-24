const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@spareparts.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
    const passwordHash = await bcrypt.hash(password, 10);

    await queryInterface.sequelize.query(
      'DELETE FROM `users` WHERE `email` = :email',
      { replacements: { email } }
    );

    await queryInterface.bulkInsert('users', [
      {
        name: process.env.SEED_ADMIN_NAME || 'System Admin',
        email,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@spareparts.com';
    await queryInterface.bulkDelete('users', { email });
  },
};
