const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function seedNotificationsForTony() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // User ID 3 is TONY
    const userId = 3;

    // Get some posts to reference
    const posts = await sql`
      SELECT id, title, author_id
      FROM posts
      LIMIT 10
    `;

    // Get some other users to be actors
    const otherUsers = await sql`
      SELECT id, display_name
      FROM users
      WHERE id != ${userId}
      LIMIT 5
    `;

    // Get some replies
    const replies = await sql`
      SELECT id, post_id, user_id
      FROM reply
      LIMIT 10
    `;

    console.log('Creating notifications for TONY (User ID 3)...');

    // Create various notification types for TONY
    const notifications = [];

    // 1. reply_on_post - Someone replied to TONY's post
    const tonyPost = posts.find(p => p.author_id === userId) || posts[0];
    if (tonyPost && otherUsers[0]) {
      notifications.push({
        user_id: userId,
        type: 'reply_on_post',
        post_id: tonyPost.id,
        actor_id: otherUsers[0].id,
        reply_id: replies[0]?.id || null,
        is_read: false
      });
    }

    // 2. reply_on_reply - Someone replied to TONY's reply
    if (posts[1] && otherUsers[1] && replies[1]) {
      notifications.push({
        user_id: userId,
        type: 'reply_on_reply',
        post_id: posts[1].id,
        actor_id: otherUsers[1].id,
        reply_id: replies[1].id,
        is_read: false
      });
    }

    // 3. post_ended - A post TONY participated in has ended
    if (posts[2]) {
      notifications.push({
        user_id: userId,
        type: 'post_ended',
        post_id: posts[2].id,
        actor_id: null,
        reply_id: null,
        is_read: false
      });
    }

    // 4. post_activity - Activity on TONY's post
    if (tonyPost) {
      notifications.push({
        user_id: userId,
        type: 'post_activity',
        post_id: tonyPost.id,
        actor_id: null,
        reply_id: null,
        is_read: true
      });
    }

    // 5. post_flagged - TONY's post was flagged
    if (tonyPost && otherUsers[2]) {
      notifications.push({
        user_id: userId,
        type: 'post_flagged',
        post_id: tonyPost.id,
        actor_id: otherUsers[2].id,
        reply_id: null,
        is_read: false
      });
    }

    // Insert notifications
    for (const notification of notifications) {
      await sql`
        INSERT INTO notifications (user_id, type, post_id, actor_id, reply_id, is_read)
        VALUES (${notification.user_id}, ${notification.type}, ${notification.post_id},
                ${notification.actor_id}, ${notification.reply_id}, ${notification.is_read})
      `;
      console.log(`✓ Created ${notification.type} notification for post ID ${notification.post_id}`);
    }

    console.log(`\n✅ Successfully created ${notifications.length} notifications for TONY (User ID 3)`);

    // Verify the notifications were created
    const verifyNotifications = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId}
    `;

    console.log(`\n📊 Total notifications for TONY: ${verifyNotifications[0].count}`);

  } catch (error) {
    console.error('Error seeding notifications:', error.message);
    console.error(error);
  }

  process.exit(0);
}

seedNotificationsForTony();