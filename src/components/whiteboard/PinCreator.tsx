'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/lib/context/AuthContext';
import { COLORS } from '@/lib/constants';
import { getRandomInRange, getVideoThumbnail } from '@/lib/utils';
import type { PinType, PinContent } from '@/lib/types';

interface PinCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePin: (
    type: PinType,
    content: PinContent,
    position: { x: number; y: number },
    pinColor: string,
    rotation: number
  ) => Promise<any>;
}

export function PinCreator({ isOpen, onClose, onCreatePin }: PinCreatorProps) {
  const [step, setStep] = useState<'type' | 'content'>('type');
  const [selectedType, setSelectedType] = useState<PinType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.pinColors[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  // Form state for different pin types
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [quote, setQuote] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const resetForm = () => {
    setStep('type');
    setSelectedType(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setCaption('');
    setQuote('');
    setQuoteAuthor('');
    setVideoUrl('');
    setLinkUrl('');
    setLinkTitle('');
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || !user) return;

    setIsLoading(true);

    try {
      let content: PinContent = {};

      switch (selectedType) {
        case 'photo':
          if (photoFile) {
            // Upload the file using local upload API
            const formData = new FormData();
            formData.append('file', photoFile);

            setUploadProgress(10);
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Failed to upload image');
            }

            setUploadProgress(100);
            const result = await response.json();
            content = { imageUrl: result.url, caption };
          }
          break;

        case 'quote':
          content = { quote, author: quoteAuthor };
          break;

        case 'video':
          content = {
            videoUrl,
            thumbnail: getVideoThumbnail(videoUrl) || undefined,
          };
          break;

        case 'link':
          content = { url: linkUrl, title: linkTitle };
          break;
      }

      // Random position in the center area
      const position = {
        x: getRandomInRange(20, 80),
        y: getRandomInRange(20, 80),
      };

      // Random slight rotation
      const rotation = getRandomInRange(-5, 5);

      await onCreatePin(selectedType, content, position, selectedColor, rotation);
      handleClose();
    } catch (error) {
      console.error('Error creating pin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pinTypes = [
    {
      type: 'photo' as PinType,
      label: 'Photo',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Share an image',
    },
    {
      type: 'quote' as PinType,
      label: 'Quote',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      description: 'Share a quote or thought',
    },
    {
      type: 'video' as PinType,
      label: 'Video',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Embed a YouTube or Vimeo video',
    },
    {
      type: 'link' as PinType,
      label: 'Link',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: 'Share a helpful link',
    },
  ];

  const renderTypeSelection = () => (
    <div className="grid grid-cols-2 gap-3">
      {pinTypes.map((pt) => (
        <button
          key={pt.type}
          onClick={() => {
            setSelectedType(pt.type);
            setStep('content');
          }}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <div className="text-gray-600">{pt.icon}</div>
          <span className="font-medium text-gray-900">{pt.label}</span>
          <span className="text-xs text-gray-500 text-center">{pt.description}</span>
        </button>
      ))}
    </div>
  );

  const renderContentForm = () => {
    switch (selectedType) {
      case 'photo':
        return (
          <div className="space-y-4">
            {photoPreview ? (
              <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden">
                <img src={photoPreview} alt="Preview" className="object-cover w-full h-full" />
                <button
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm text-gray-500">Click to upload an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
            <Input
              label="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <Textarea
              label="Quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your quote..."
              rows={4}
              required
            />
            <Input
              label="Author (optional)"
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
              placeholder="Who said this?"
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <Input
              label="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              helperText="Supports YouTube and Vimeo links"
              required
            />
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <Input
              label="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <Input
              label="Title (optional)"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Give it a title"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isValid = () => {
    switch (selectedType) {
      case 'photo':
        return !!photoFile;
      case 'quote':
        return !!quote.trim();
      case 'video':
        return !!videoUrl.trim();
      case 'link':
        return !!linkUrl.trim();
      default:
        return false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'type' ? 'Add a Pin' : `Add ${selectedType}`}
      size="md"
    >
      {step === 'type' ? (
        renderTypeSelection()
      ) : (
        <div className="space-y-4">
          {renderContentForm()}

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Color
            </label>
            <div className="flex gap-2">
              {COLORS.pinColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setStep('type');
                setSelectedType(null);
              }}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid()}
              isLoading={isLoading}
              className="flex-1"
            >
              Add Pin
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
