
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube, Plus, X } from 'lucide-react';

interface ProductVideoSectionProps {
  videos: string[];
  onChange: (videos: string[]) => void;
}

export default function ProductVideoSection({
  videos,
  onChange
}: ProductVideoSectionProps) {
  const [videoUrl, setVideoUrl] = useState('');
  
  const extractYoutubeId = (url: string): string | null => {
    // Check if it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    
    // Extract from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const addVideo = () => {
    if (!videoUrl.trim()) return;
    
    const videoId = extractYoutubeId(videoUrl);
    if (videoId) {
      onChange([...videos, videoId]);
      setVideoUrl('');
    } else {
      alert('Please enter a valid YouTube URL or video ID');
    }
  };
  
  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    onChange(newVideos);
  };
  
  return (
    <Card className="bg-card/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Youtube className="h-5 w-5 mr-2" />
          Product Videos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="YouTube URL or video ID"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="bg-white/10 border-white/20 flex-grow"
          />
          <Button onClick={addVideo}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((videoId, index) => (
              <div key={index} className="relative border border-white/10 rounded-lg overflow-hidden">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeVideo(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/20 rounded-lg p-8 text-center">
            <Youtube className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-muted-foreground">No videos added yet</p>
            <p className="text-xs text-muted-foreground">Add YouTube videos to showcase your product</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
