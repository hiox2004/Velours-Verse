import React from 'react';
import { WritingPiece } from '../types/writing';
import { Printer, X } from 'lucide-react';

interface PrintPreviewProps {
  piece: WritingPiece | null;
  onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ piece, onClose }) => {
  if (!piece) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  const formattedDate = new Date(piece.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      {/* On-screen modal controls before and during print */}
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/80 backdrop-blur-md overflow-y-auto no-print">
        {/* Sticky top action strip */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="text-white text-sm font-medium">
            Print Preview — <span className="text-zinc-400">{piece.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-100 flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper sheet simulation preview */}
        <div className="flex-1 p-6 md:p-12 flex justify-center">
          <div className="w-full max-w-2xl bg-white text-zinc-900 p-10 md:p-16 rounded-xl shadow-2xl min-h-[700px] flex flex-col justify-between">
            <div>
              {/* Publication Header */}
              <div className="border-b-2 border-zinc-900 pb-6 mb-8 text-center">
                <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-sans mb-1">
                  Velours & Verse Archives · {piece.type.toUpperCase()}
                </div>
                <h1 className="font-display-chic text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
                  {piece.title}
                </h1>
                <div className="text-xs text-zinc-600 font-sans">
                  By {piece.authorDisplayName} ({piece.authorPenpalId}) · {formattedDate}
                </div>
              </div>

              {/* Manuscript Body */}
              <div className="font-serif-literary text-lg md:text-xl text-zinc-900 whitespace-pre-wrap leading-relaxed max-w-xl mx-auto">
                {piece.content}
              </div>
            </div>

            {/* Bottom Publisher Stamp */}
            <div className="pt-12 border-t border-zinc-200 mt-16 text-center text-xs text-zinc-400 font-sans">
              Printed from Velours & Verse · Word count: {piece.wordCount} · Creative Writing Sanctuary
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated DOM content specifically rendered when @media print is activated */}
      <div className="hidden print:block print-container">
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          Velours & Verse · {piece.type.toUpperCase()}
        </div>
        <h1 className="print-title font-bold text-3xl mb-2">{piece.title}</h1>
        <div className="text-sm text-gray-600 mb-8 border-b pb-4">
          By {piece.authorDisplayName} ({piece.authorPenpalId}) · {formattedDate}
        </div>
        <div className="print-body whitespace-pre-wrap text-lg leading-loose">{piece.content}</div>
        <div className="mt-12 pt-6 border-t text-xs text-gray-400">
          Archived on Velours & Verse · Word count: {piece.wordCount}
        </div>
      </div>
    </>
  );
};
