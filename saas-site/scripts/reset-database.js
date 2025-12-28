// Database Reset Script
// Run with: node scripts/reset-database.js

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ADMIN_EMAIL = 'marcondes.gustavo@gmail.com';

async function resetDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get admin user ID first
    console.log('\n📋 Finding admin user...');
    const adminUser = await db.collection('users').findOne({ email: ADMIN_EMAIL });
    
    if (!adminUser) {
      throw new Error(`Admin user ${ADMIN_EMAIL} not found!`);
    }
    
    console.log(`✅ Found admin: ${adminUser.fullName} (${adminUser.email})`);

    // Delete data
    console.log('\n🗑️  Starting data deletion...\n');
    
    const results = {};

    // Delete users except admin
    const usersResult = await db.collection('users').deleteMany({ 
      _id: { $ne: adminUser._id } 
    });
    results.usersDeleted = usersResult.deletedCount;
    console.log(`   Users deleted: ${results.usersDeleted}`);

    // Delete all user logs
    const userLogsResult = await db.collection('userlogs').deleteMany({});
    results.userLogsDeleted = userLogsResult.deletedCount;
    console.log(`   User logs deleted: ${results.userLogsDeleted}`);

    // Delete admin logs except admin's own
    const adminLogsResult = await db.collection('adminlogs').deleteMany({ 
      email: { $ne: ADMIN_EMAIL } 
    });
    results.adminLogsDeleted = adminLogsResult.deletedCount;
    console.log(`   Admin logs deleted: ${results.adminLogsDeleted}`);

    // Delete all condos
    const condosResult = await db.collection('condos').deleteMany({});
    results.condosDeleted = condosResult.deletedCount;
    console.log(`   Condos deleted: ${results.condosDeleted}`);

    // Delete all condo managers
    const managersResult = await db.collection('condomanagers').deleteMany({});
    results.condoManagersDeleted = managersResult.deletedCount;
    console.log(`   Condo managers deleted: ${results.condoManagersDeleted}`);

    // Delete all condo manager invites
    const managerInvitesResult = await db.collection('condomanagerinvites').deleteMany({});
    results.condoManagerInvitesDeleted = managerInvitesResult.deletedCount;
    console.log(`   Condo manager invites deleted: ${results.condoManagerInvitesDeleted}`);

    // Delete all support invites
    const supportInvitesResult = await db.collection('supportinvites').deleteMany({});
    results.supportInvitesDeleted = supportInvitesResult.deletedCount;
    console.log(`   Support invites deleted: ${supportInvitesResult.deletedCount}`);

    console.log('\n✅ Database reset completed successfully!');
    console.log('\n📊 Summary:');
    console.log(JSON.stringify(results, null, 2));
    
    console.log('\n✅ Only admin user remains:', adminUser.email);

  } catch (error) {
    console.error('\n❌ Error during reset:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
