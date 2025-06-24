import { db } from "@/db/index";
import { roles, users, posts, reply, votes } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";

async function seed() {
  // Insert sample roles
  const [adminRole] = await db
    .insert(roles)
    .values({ name: "admin" })
    .returning();
  const [userRole] = await db
    .insert(roles)
    .values({ name: "user" })
    .returning();

  // Insert sample users
  const [alice] = await db
    .insert(users)
    .values({
      displayName: "Alice",
      sex: "female",
      age: 30,
      mbti: "INTJ",
      isNotificationOn: true,
      role: adminRole.id,
      post: [] as number[],
      savedPosts: [] as number[],
    })
    .returning();

  const [bob] = await db
    .insert(users)
    .values({
      displayName: "Bob",
      sex: "male",
      age: 25,
      mbti: "ENTP",
      isNotificationOn: false,
      role: userRole.id,
      post: [] as number[],
      savedPosts: [] as number[],
    })
    .returning();

  // Insert sample post
  const [post1] = await db
    .insert(posts)
    .values({
      title: "First Post",
      content: "This is the content of the first post.",
      participants: 2,
      yesVotes: 1,
      noVotes: 1,
      isPostEnded: false,
      endedAt: null,
    })
    .returning();

  // Update Alice's record to include the created post's id in her "post" array
  await db
    .update(users)
    .set({ post: [post1.id] })
    .where(eq(users.id, alice.id));

  // Insert sample reply (Bob replies to post1)
  const [reply1] = await db
    .insert(reply)
    .values({
      reply: "Great post!",
      userId: bob.id,
      postId: post1.id,
      isDeleted: false,
    })
    .returning();

  // Insert sample vote (Alice votes "yes" on post1)
  const [vote1] = await db
    .insert(votes)
    .values({
      userId: alice.id,
      postId: post1.id,
      vote: "yes",
    })
    .returning();

  console.log("Seeding completed successfully.");
}

seed().catch((error) => {
  console.error("Error seeding data:", error);
});
