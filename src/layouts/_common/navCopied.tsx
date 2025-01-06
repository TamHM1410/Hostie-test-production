import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface LinkCopyProps {
  url: string;
  maxWidth?: number;
}

const LinkCopy = ({ url = 'https://account.dino...', maxWidth = 150 }: LinkCopyProps) => {
  const [copied, setCopied] = useState(false);

  const truncateUrl = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return text;
    const firstPart = text.slice(0, Math.floor(maxChars / 2));
    const lastPart = text.slice(text.length - Math.floor(maxChars / 2));
    return `${firstPart}...${lastPart}`;
  };

  const handleCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg max-w-md">
      <div 
        className="flex items-center justify-between gap-2 rounded" 
        style={{backgroundColor: '#6ea8e16b', padding: 5, borderRadius: 10,display:'flex',gap:2 }}
      >
        <span 
          className="text-gray-600 flex-1" 
          style={{
            maxWidth,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block'
          }}
        >
          {url}
        </span>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Copy to clipboard"
          style={{borderRadius: 5, border: 0,backgroundColor: '#6ea8e16b'}}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500"  />
          ) : (
            <Copy className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LinkCopy;