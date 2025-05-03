import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Quote
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('edit');

  const handleFormat = (tag: string) => {
    // Simple implementation - inserts HTML tags at cursor position
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    switch(tag) {
      case 'h1':
        formattedText = `<h1>${selectedText}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case 'h3':
        formattedText = `<h3>${selectedText}</h3>`;
        break;
      case 'b':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'i':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'u':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'ol':
        formattedText = `<ol>\n  <li>${selectedText}</li>\n</ol>`;
        break;
      case 'ul':
        formattedText = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
        break;
      case 'left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        break;
      case 'center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        break;
      case 'right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `<a href="${url}" target="_blank">${selectedText || url}</a>`;
        } else {
          return;
        }
        break;
      case 'image':
        const imgUrl = prompt('Enter image URL:', 'https://');
        if (imgUrl) {
          formattedText = `<img src="${imgUrl}" alt="Article image" class="w-full rounded-lg my-4" />`;
        } else {
          return;
        }
        break;
      case 'quote':
        formattedText = `<blockquote class="border-l-4 border-cyber-blue pl-4 italic">${selectedText}</blockquote>`;
        break;
      case 'box':
        formattedText = `<div class="bg-black/30 border border-white/20 rounded-lg p-4 my-4">${selectedText}</div>`;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="bg-black/60 border border-white/20 rounded-lg p-2 flex flex-wrap gap-1 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('h1')}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('h2')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('h3')}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('b')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('i')}
          title="Italic"
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
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('ol')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('ul')}
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-white/20 mx-1"></div>
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
        <div className="h-6 w-px bg-white/20 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('link')}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('image')}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleFormat('quote')}
          title="Insert Quote"
        >
          <Quote className="h-4 w-4" />
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

      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-0">
          <textarea
            id="content-editor"
            className="w-full min-h-[400px] p-4 bg-black/60 border border-white/20 rounded-lg text-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start writing your article content here..."
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div
            className="w-full min-h-[400px] p-4 bg-black/60 border border-white/20 rounded-lg text-white prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
