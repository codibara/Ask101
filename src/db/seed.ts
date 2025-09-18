import { db } from './index';
import { users, posts } from './schema/tables';
import { config } from 'dotenv';

config();

async function seed() {
  try {
    console.log('Starting database seed...');

    // Insert sample users
    const insertedUsers = await db.insert(users).values([
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        displayName: '테스트유저1',
        sex: 'male',
        birthYear: 1995,
        isNotificationOn: true,
        onboardingCompleted: true,
        age: '20대',
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        displayName: '테스트유저2',
        sex: 'female',
        birthYear: 2000,
        isNotificationOn: false,
        onboardingCompleted: true,
        age: '20대',
      },
    ]).returning();

    console.log(`Inserted ${insertedUsers.length} users`);

    // Insert sample posts with viewCount
    const insertedPosts = await db.insert(posts).values([
      {
        title: '커피 vs 차',
        content: '아침에 뭘 마시는 게 더 좋을까요? 커피는 카페인이 강해서 잠을 깨우는데 좋고, 차는 부드럽고 건강에 좋다고 하네요.',
        authorId: insertedUsers[0].id,
        optionA: '커피',
        optionB: '차',
        votesA: 45,
        votesB: 32,
        viewCount: 127, // Adding view count
        isEndVote: false,
      },
      {
        title: '아침형 vs 저녁형',
        content: '당신은 아침형 인간인가요, 저녁형 인간인가요? 생산성과 창의성에 차이가 있을까요?',
        authorId: insertedUsers[1].id,
        optionA: '아침형',
        optionB: '저녁형',
        votesA: 28,
        votesB: 51,
        viewCount: 89, // Adding view count
        isEndVote: false,
      },
      {
        title: '여름 vs 겨울',
        content: '어느 계절을 더 선호하시나요? 여름의 뜨거운 태양 아래 시원한 바다, 아니면 겨울의 포근한 이불 속?',
        authorId: insertedUsers[0].id,
        optionA: '여름',
        optionB: '겨울',
        votesA: 60,
        votesB: 41,
        viewCount: 203, // Adding view count
        isEndVote: true,
        endedAt: new Date(),
      },
      {
        title: '집 vs 여행',
        content: '휴가 때 집에서 쉬는 걸 선호하시나요, 아니면 여행을 떠나시나요?',
        authorId: insertedUsers[1].id,
        optionA: '집에서 휴식',
        optionB: '여행',
        votesA: 15,
        votesB: 22,
        viewCount: 45, // Adding view count
        isEndVote: false,
      },
    ]).returning();

    console.log(`Inserted ${insertedPosts.length} posts with viewCount`);

    console.log('Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();