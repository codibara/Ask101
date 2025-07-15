import { Notification } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    postId: 1,
    notiId: 1,
    category: '댓글',
    title: '새로운 댓글이 달렸습니다',
    content: '당신의 게시물에 새로운 댓글이 달렸습니다. 확인해보세요.',
    date: '오늘',
    checked: false
  },
  {
    postId: 2,
    notiId: 2,
    category: '좋아요',
    title: '게시물이 인기 있어요!',
    content: '작성하신 게시물이 많은 사람들의 공감을 얻고 있어요.',
    date: '1일전',
    checked: true,
  },
  {
    postId: 3,
    notiId: 3,
    category: '공지',
    title: '투표가 완료되었습니다',
    content: '당신의 게시물에 대한 투표가 종료되었습니다. 결과를 확인해보세요.',
    date: '1일전',
    checked: false
  },
  {
    postId: 4,
    notiId: 4,
    category: '답글',
    title: '당신의 댓글에 답글이 달렸습니다',
    content: '작성하신 댓글에 새로운 답글이 달렸습니다.',
    date: '2일전',
    checked: false
  },
  {
    postId: 5,
    notiId: 5,
    category: '공지',
    title: '게시물이 신고되었습니다',
    content: '작성하신 게시물이 다른 사용자에 의해 신고되었습니다. 관리자 검토 중입니다.',
    date: '3일전',
    checked: false
  },
];
