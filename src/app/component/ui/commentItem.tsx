import { Comment } from "@/types/post";
import { mockReplies } from "@/data/mock_reply";
import { mockUsers } from "@/data/mock_user_data";
import Pill from "@/app/component/ui/pill";
import { ChatLeftText, Eye  } from 'react-bootstrap-icons';

interface CommentProp extends Comment {}

const CommentItem = ({ postId, userId, commentId, comment }: CommentProp) => {

  const user = mockUsers.find((u) => u.userId === userId);
  const replies = mockReplies.filter((r) => r.commentId === commentId);

  if (!user) return null;

  const { gender, mbti, age, occupation } = user.userCategory;

  return (
    <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
            <Pill 
                gender={gender}
                mbti={mbti}
                age={age}
                occupation={occupation}
            />
            <p>{comment}</p>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-2 -mt-1">
                  <p className="text-sm text-gray-500">{user.userId}</p>
                  <p className="text-sm text-gray-500">2025/01/23</p>
              </div>
              <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-1">
                      <ChatLeftText size={16} />
                      <p className="text-xs font-medium">{replies.length}</p>
                  </div>
              </div>
            </div>
            
        </div>
        {replies.map((r) => {
          const replier = mockUsers.find((u) => u.userId === r.userId);
          if (!replier) return null;
          const { gender, mbti, age, occupation } = replier.userCategory;

          return (
            <div className="flex flex-col gap-2 ml-10" key={r.replyId}>
              <Pill 
                  gender={gender}
                  mbti={mbti}
                  age={age}
                  occupation={occupation}
              />
              <p>
                {r.comment}
              </p>
              <div className="flex flex-row gap-2 -mt-1">
                <p className="text-sm text-gray-500">{replier ? replier.userId : r.userId}</p>
                <p className="text-sm text-gray-500">2025/01/23</p>
            </div>
            </div>
          );
        })}
    </div>
  )
    
}

export default CommentItem;