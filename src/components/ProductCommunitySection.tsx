
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, MessageSquare, Send } from 'lucide-react';
import { ProductComment } from '@/types/product';

interface ProductCommunitySectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  comments?: ProductComment[];
  onAddComment?: (content: string) => void;
}

export default function ProductCommunitySection({
  enabled,
  onToggle,
  comments = [],
  onAddComment
}: ProductCommunitySectionProps) {
  const [newComment, setNewComment] = useState('');
  
  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  
  return (
    <Card className="bg-card/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Community Discussion
        </CardTitle>
        <CardDescription>
          Allow customers to discuss this product and ask questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="enable-community"
            checked={enabled}
            onCheckedChange={(checked) => onToggle(!!checked)}
          />
          <label htmlFor="enable-community" className="text-sm font-medium leading-none">
            Enable community discussions for this product
          </label>
        </div>
        
        {enabled && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Preview Community Section</h4>
            
            <div className="border border-white/10 rounded-lg p-4 max-h-[300px] overflow-y-auto">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-black/30 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Be the first to start a discussion!</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-white/10 border-white/20"
              />
              <Button 
                variant="default" 
                className="self-end"
                onClick={handleAddComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
