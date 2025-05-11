
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductMultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  mainImage: string;
  onMainImageChange: (image: string) => void;
}

export default function ProductMultiImageUpload({
  images,
  onChange,
  mainImage,
  onMainImageChange
}: ProductMultiImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    // In a real app, you would upload these to your storage service
    // For now, we'll create object URLs as a demonstration
    const newImages = Array.from(e.target.files).map(file => {
      return URL.createObjectURL(file);
    });
    
    onChange([...images, ...newImages]);
    
    // If this is the first image, set it as main image
    if (images.length === 0 && newImages.length > 0) {
      onMainImageChange(newImages[0]);
    }
    
    setIsUploading(false);
    
    toast({
      title: "Images added",
      description: `${newImages.length} images have been added to the product.`
    });
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    const removedImage = newImages.splice(index, 1)[0];
    onChange(newImages);
    
    // If we're removing the main image, set a new one
    if (removedImage === mainImage) {
      if (newImages.length > 0) {
        onMainImageChange(newImages[0]);
      } else {
        onMainImageChange('');
      }
    }
  };
  
  const setAsMain = (image: string) => {
    onMainImageChange(image);
    toast({
      title: "Main image updated",
      description: "The selected image is now the main product image."
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Product Images</h3>
        <Button 
          variant="outline"
          onClick={() => document.getElementById('multi-image-upload')?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Add Images'}
        </Button>
        <input
          type="file"
          id="multi-image-upload"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`relative group border rounded-md overflow-hidden aspect-square ${
                image === mainImage ? 'border-cyber-blue border-2' : 'border-white/20'
              }`}
            >
              <img 
                src={image} 
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {image !== mainImage && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAsMain(image)}
                    className="bg-black/70"
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Set as main
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {image === mainImage && (
                <div className="absolute bottom-0 left-0 right-0 bg-cyber-blue/80 text-xs py-1 text-center">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded-lg p-8 text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
          <p className="text-xs text-muted-foreground">Click 'Add Images' to upload product photos</p>
        </div>
      )}
    </div>
  );
}
