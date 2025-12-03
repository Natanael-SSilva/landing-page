// src/components/blog/CommentList.tsx
'use client';

import { CommentWithAuthor } from './CommentsSection';
import { CommentItem } from './CommentItem';

// A interface foi atualizada para incluir a nova função de callback
interface CommentListProps {
  comments: CommentWithAuthor[];
  postId: string;
  onCommentPosted: (newComment: CommentWithAuthor) => void;
  onCommentDeleted: (commentId: string) => void;
}

export function CommentList({ comments, postId, onCommentPosted, onCommentDeleted }: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id}>
          {/* Repassando a nova prop 'onCommentDeleted' para cada item */}
          <CommentItem
            comment={comment}
            postId={postId}
            onCommentPosted={onCommentPosted}
            onCommentDeleted={onCommentDeleted}
          />
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-8 border-l-2 border-border ml-6">
              {/* Repassando a prop recursivamente para a lista de respostas */}
              <CommentList
                comments={comment.replies}
                postId={postId}
                onCommentPosted={onCommentPosted}
                onCommentDeleted={onCommentDeleted}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}