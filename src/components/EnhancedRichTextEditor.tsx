import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bold, Italic, Underline, ListOrdered, List,
  AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Heading3, Link, Image, 
  Youtube, Video, Code, MessageSquare, Upload,
  GalleryHorizontal, GalleryVertical, BookOpenText
} from 'lucide-react';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (files: FileList) => Promise<string[]>;
}

export default function EnhancedRichTextEditor({ 
  value, 
  onChange,
  onImageUpload
}: EnhancedRichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const insertAtCursor = (textBefore: string, textAfter: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                    textBefore + selectedText + textAfter + 
                    value.substring(end);
                    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + textBefore.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleFormat = (tag: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    
    switch(tag) {
      case 'h1':
        insertAtCursor('# ', '\n');
        break;
      case 'h2':
        insertAtCursor('## ', '\n');
        break;
      case 'h3':
        insertAtCursor('### ', '\n');
        break;
      case 'b':
        insertAtCursor('**', '**');
        break;
      case 'i':
        insertAtCursor('*', '*');
        break;
      case 'u':
        insertAtCursor('<u>', '</u>');
        break;
      case 'ol':
        insertAtCursor('1. ');
        break;
      case 'ul':
        insertAtCursor('- ');
        break;
      case 'left':
        insertAtCursor('<div style="text-align: left">', '</div>');
        break;
      case 'center':
        insertAtCursor('<div style="text-align: center">', '</div>');
        break;
      case 'right':
        insertAtCursor('<div style="text-align: right">', '</div>');
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          insertAtCursor(`[${selectedText || 'Link text'}](${url})`);
        }
        break;
      case 'image':
        if (onImageUpload && fileInputRef.current) {
          fileInputRef.current.click();
        } else {
          const imgUrl = prompt('Enter image URL:', 'https://');
          if (imgUrl) {
            insertAtCursor(`![${selectedText || 'Image'}](${imgUrl})`);
          }
        }
        break;
      case 'youtube':
        const videoId = prompt('Enter YouTube video ID or URL:', '');
        if (videoId) {
          // Extract video ID if full URL was pasted
          const extractedId = extractYoutubeId(videoId);
          if (extractedId) {
            insertAtCursor(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${extractedId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\n`);
          }
        }
        break;
      case 'code':
        insertAtCursor('```\n', '\n```');
        break;
      case 'quote':
        insertAtCursor('> ');
        break;
      case 'box':
        insertAtCursor('<div class="bg-black/30 border border-white/20 rounded-lg p-4 my-4">\n', '\n</div>');
        break;
    }
  };

  // Helper function to extract YouTube video ID from various URL formats
  const extractYoutubeId = (url: string): string | null => {
    // Check if it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    
    // Extract from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Convert Markdown to HTML for preview
  const renderMarkdown = (text: string): string => {
    let html = text;
    
    // Convert headings (# Heading)
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    
    // Convert bold (**text**)
    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    
    // Convert italic (*text*)
    html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
    
    // Convert links ([text](url))
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert images (![alt](url))
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />');
    
    // Convert list items
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
    
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)\n(<li>.*<\/li>)/g, '<ul>$1$2</ul>');
    
    // Keep existing HTML elements
    return html;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageUpload) {
      try {
        const urls = await onImageUpload(e.target.files);
        urls.forEach(url => {
          insertAtCursor(`![Uploaded Image](${url})\n`);
        });
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="bg-black/60 border border-white/20 rounded-lg p-2 flex flex-wrap gap-1 mb-2">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('h1')}
            title="Heading 1 (#)"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('h2')}
            title="Heading 2 (##)"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('h3')}
            title="Heading 3 (###)"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('b')}
            title="Bold (**text**)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('i')}
            title="Italic (*text*)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('u')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('ol')}
            title="Ordered List (1. item)"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('ul')}
            title="Unordered List (- item)"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('left')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('center')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('right')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('link')}
            title="Insert Link [text](url)"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('image')}
            title="Insert Image ![alt](url)"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('youtube')}
            title="Insert YouTube Video"
          >
            <Youtube className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('code')}
            title="Insert Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('quote')}
            title="Insert Quote"
          >
            <BookOpenText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFormat('box')}
            title="Insert Box"
            className="px-3"
          >
            Box
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-0">
          <textarea
            id="content-editor"
            className="w-full min-h-[400px] p-4 bg-black/60 border border-white/20 rounded-lg text-white font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start writing your content here... Use markdown-like syntax:
# Heading 1
## Heading 2
### Heading 3
**Bold text**
*Italic text*
- List item
1. Ordered item
[Link text](https://example.com)
![Image alt text](image-url.jpg)"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div
            className="w-full min-h-[400px] p-4 bg-black/60 border border-white/20 rounded-lg text-white prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Hidden file input for image uploads */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
    </div>
  );
}
