const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkNotifications() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Check all notifications in database
    const allNotifications = await sql`
      SELECT
        n.id,
        n.user_id,
        n.type,
        n.is_read,
        n.created_at,
        u.email as user_email,
        u.display_name as user_name,
        p.title as post_title
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      LEFT JOIN posts p ON n.post_id = p.id
      ORDER BY n.user_id, n.created_at DESC
    `;

    console.log('All notifications in database:');
    console.log('================================');

    // Group by user
    const byUser = {};
    allNotifications.forEach(n => {
      if (!byUser[n.user_id]) {
        byUser[n.user_id] = {
          email: n.user_email,
          name: n.user_name,
          notifications: []
        };
      }
      byUser[n.user_id].notifications.push(n);
    });

    Object.entries(byUser).forEach(([userId, userData]) => {
      console.log(`\nUser ID ${userId} (${userData.name || userData.email}):`);
      userData.notifications.forEach(n => {
        console.log(`  - ${n.type}: "${n.post_title}" (read: ${n.is_read})`);
      });
    });

    // Check current logged in users (from sessions)
    console.log('\n\nRecent sessions:');
    console.log('================');
    const sessions = await sql`
      SELECT
        s.user_id,
        s.expires,
        u.email,
        u.display_name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires > NOW()
      ORDER BY s.expires DESC
      LIMIT 5
    `;

    sessions.forEach(s => {
      console.log(`User ID ${s.user_id} (${s.display_name || s.email}) - Session expires: ${s.expires}`);
    });

    if (sessions.length > 0) {
      console.log(`\n💡 You are likely logged in as User ID ${sessions[0].user_id} (${sessions[0].display_name || sessions[0].email})`);

      // Check if this user has notifications
      const userNotifications = allNotifications.filter(n => n.user_id === sessions[0].user_id);
      if (userNotifications.length === 0) {
        console.log('   ⚠️  This user has NO notifications in the database');
        console.log('   ℹ️  Notifications were created for User ID 9 (민초)');
      } else {
        console.log(`   ✅ This user has ${userNotifications.length} notifications`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  process.exit(0);
}

checkNotifications();