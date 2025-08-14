import { db } from "@/db/index";
import { users, posts, reply, votes, savedPosts } from "@/db/schema/tables";

async function seed() {
  // Insert sample users
  const [alice] = await db
    .insert(users)
    .values({
      displayName: "Alice",
      sex: "female",
      birthYear: 1994, // 30 years old in 2024
      mbti: "INTJ",
      job: "전문직",
      isNotificationOn: true,
      onboardingCompleted: true,
      isAdmin: true, // Alice is admin
    })
    .returning();

  const [bob] = await db
    .insert(users)
    .values({
      displayName: "Bob",
      sex: "male",
      birthYear: 1999, // 25 years old in 2024
      mbti: "ENTP",
      job: "대학/대학원생",
      isNotificationOn: false,
      onboardingCompleted: true,
      isAdmin: false, // Bob is regular user
    })
    .returning();

  // Insert sample post (created by Alice)
  const [post1] = await db
    .insert(posts)
    .values({
      title: "Should remote work be the default for tech jobs?",
      content:
        "With the rise of digital collaboration tools and proven productivity in remote settings, should companies make remote work the standard option rather than requiring office presence?",
      authorId: alice.id,
      yesVotes: 1,
      noVotes: 1,
      endedAt: null,
    })
    .returning();

  // Insert sample replies
  // Direct reply to post1 (Bob replies to Alice's post)
  const [reply1] = await db
    .insert(reply)
    .values({
      reply:
        "I disagree. Office collaboration is still important for team building and mentoring junior developers.",
      userId: bob.id,
      postId: post1.id,
      parentReplyId: null, // Direct reply to post
      isDeleted: false,
    })
    .returning();

  // Another direct reply to post1 (Alice replies to her own post)
  // const [reply2] = await db
  //   .insert(reply)
  //   .values({
  //     reply:
  //       "Good point about mentoring, but tools like Slack and video calls can bridge that gap effectively.",
  //     userId: alice.id,
  //     postId: post1.id,
  //     parentReplyId: null, // Direct reply to post
  //     isDeleted: false,
  //   })
  //   .returning();

  // Reply to reply1 (Alice replies to Bob's comment)
  await db
    .insert(reply)
    .values({
      reply:
        "That's true for some roles, but many senior developers are more productive in quiet environments.",
      userId: alice.id,
      postId: post1.id,
      parentReplyId: reply1.id, // Reply to Bob's reply
      isDeleted: false,
    })
    .returning();

  // Another reply to reply1 (Bob responds to Alice's counter-argument)
  await db
    .insert(reply)
    .values({
      reply:
        "Fair point! Maybe a hybrid approach with 2-3 office days per week?",
      userId: bob.id,
      postId: post1.id,
      parentReplyId: reply1.id, // Reply to Bob's original reply
      isDeleted: false,
    })
    .returning();

  // Insert sample votes
  // Alice votes "yes" on her own post (author can vote)
  await db
    .insert(votes)
    .values({
      userId: alice.id,
      postId: post1.id,
      vote: "yes",
    })
    .returning();

  // Bob votes "no" on Alice's post
  await db
    .insert(votes)
    .values({
      userId: bob.id,
      postId: post1.id,
      vote: "no",
    })
    .returning();

  // Insert second sample post (created by Bob, no votes yet)
  const [post2] = await db
    .insert(posts)
    .values({
      title: "Is university education still necessary for tech careers?",
      content:
        "With many successful developers being self-taught and coding bootcamps becoming more popular, is a traditional university degree still worth the time and cost for tech careers?",
      authorId: bob.id,
      yesVotes: 0,
      noVotes: 0,
      endedAt: null,
    })
    .returning();

  // Alice saves Bob's post for later
  await db
    .insert(savedPosts)
    .values({
      userId: alice.id,
      postId: post2.id,
    })
    .returning();

  console.log("Seeding completed successfully.");
}

seed().catch((error) => {
  console.error("Error seeding data:", error);
});
