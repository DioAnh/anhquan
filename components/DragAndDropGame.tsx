import React, { useState } from 'react';

export interface DragItem {
  id: string;
  content: string;
  type: 'text' | 'image';
  imageUrl?: string;
  isCorrect: boolean;
  dropZoneId: string | null; // Which drop zone this belongs to
}

export interface DropZone {
  id: string;
  label: string;
  accepts: string[]; // IDs of items that can be dropped here
  correctItemId: string; // The correct item ID for this zone
}

interface DragAndDropGameProps {
  topic: string;
  items: DragItem[];
  dropZones: DropZone[];
  onComplete: (isCorrect: boolean) => void;
  onSkip?: () => void;
}

const DragAndDropGame: React.FC<DragAndDropGameProps> = ({
  topic,
  items,
  dropZones,
  onComplete,
  onSkip
}) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [droppedItems, setDroppedItems] = useState<Map<string, string>>(new Map()); // dropZoneId -> itemId
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropZone: DropZone) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Check if item is already dropped somewhere else
    const existingDrop = Array.from(droppedItems.entries()).find(([_, itemId]) => itemId === draggedItem.id);
    if (existingDrop) {
      // Remove from previous drop zone
      const newDropped = new Map(droppedItems);
      newDropped.delete(existingDrop[0]);
      setDroppedItems(newDropped);
    }

    // Add to new drop zone
    const newDropped = new Map(droppedItems);
    newDropped.set(dropZone.id, draggedItem.id);
    setDroppedItems(newDropped);

    setDraggedItem(null);

    // Check if all zones are filled and correct
    checkCompletion(newDropped);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const checkCompletion = (currentDropped: Map<string, string>) => {
    if (currentDropped.size !== dropZones.length) return; // Not all filled

    let allCorrect = true;
    dropZones.forEach(zone => {
      const droppedItemId = currentDropped.get(zone.id);
      if (droppedItemId !== zone.correctItemId) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setIsCorrect(true);
      setShowResult(true);
      setTimeout(() => {
        onComplete(true);
      }, 2000);
    }
  };

  const removeFromDropZone = (dropZoneId: string) => {
    const newDropped = new Map(droppedItems);
    newDropped.delete(dropZoneId);
    setDroppedItems(newDropped);
  };

  const getItemInZone = (dropZoneId: string): DragItem | null => {
    const itemId = droppedItems.get(dropZoneId);
    return items.find(item => item.id === itemId) || null;
  };

  const availableItems = items.filter(item => {
    // Show items that are not dropped, or show all if we want to allow re-dragging
    return true; // Allow re-dragging
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      <style>{`
        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-correct {
          animation: correctPulse 0.6s ease-in-out;
        }
        .drag-item {
          cursor: grab;
          transition: transform 0.2s;
        }
        .drag-item:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
        .drop-zone {
          min-height: 120px;
          transition: all 0.3s;
        }
        .drop-zone.drag-over {
          background-color: #fef3c7;
          border-color: #f59e0b;
          transform: scale(1.02);
        }
        .drop-zone.filled {
          background-color: #d1fae5;
          border-color: #10b981;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-[2rem] p-6 mb-6 border-[6px] border-white shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2">
          🎯 Trò chơi Kéo và Thả
        </h3>
        <p className="text-white/90 font-bold text-center text-lg">
          Kéo các từ/hình ảnh vào đúng vị trí nhé!
        </p>
      </div>

      {/* Success Message */}
      {showResult && isCorrect && (
        <div className="mb-6 bg-green-100 border-[4px] border-green-300 rounded-[2rem] p-6 text-center animate-correct">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-black text-green-700">Hoàn hảo! Bé làm đúng hết rồi!</p>
        </div>
      )}

      {/* Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {dropZones.map((zone) => {
          const itemInZone = getItemInZone(zone.id);
          const isFilled = !!itemInZone;
          
          return (
            <div
              key={zone.id}
              className={`drop-zone bg-white border-[4px] border-dashed rounded-[2rem] p-6 ${
                isFilled ? 'filled' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-black text-gray-700 text-lg">{zone.label}</h4>
                {isFilled && (
                  <button
                    onClick={() => removeFromDropZone(zone.id)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {itemInZone ? (
                <div className="flex items-center justify-center min-h-[80px]">
                  {itemInZone.type === 'image' && itemInZone.imageUrl ? (
                    <img 
                      src={itemInZone.imageUrl} 
                      alt={itemInZone.content}
                      className="max-h-24 rounded-xl"
                    />
                  ) : (
                    <p className="text-xl font-bold text-gray-700">{itemInZone.content}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[80px] text-gray-400">
                  <p className="text-sm font-semibold">Kéo thả vào đây</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Draggable Items */}
      <div className="bg-blue-50 border-[4px] border-blue-200 rounded-[2rem] p-6 mb-6">
        <h4 className="font-black text-blue-800 text-xl mb-4 text-center">Kéo các mục sau:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {availableItems.map((item) => {
            const isDropped = Array.from(droppedItems.values()).includes(item.id);
            
            return (
              <div
                key={item.id}
                draggable={!isDropped}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`drag-item bg-white border-[4px] rounded-2xl p-4 text-center transition-all ${
                  isDropped
                    ? 'opacity-50 cursor-not-allowed border-gray-300'
                    : 'border-blue-300 hover:border-blue-400 hover:shadow-lg cursor-grab'
                } ${draggedItem?.id === item.id ? 'opacity-50' : ''}`}
              >
                {item.type === 'image' && item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.content}
                    className="w-full h-20 object-cover rounded-xl mb-2"
                  />
                ) : (
                  <p className="font-bold text-gray-700 text-lg">{item.content}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border-[4px] border-yellow-200 rounded-[2rem] p-4 mb-6">
        <p className="text-yellow-700 font-semibold text-center text-sm">
          💡 Kéo các mục từ phía dưới và thả vào đúng vị trí ở trên!
        </p>
      </div>

      {/* Skip Button */}
      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-full transition-all"
          >
            Bỏ qua
          </button>
        </div>
      )}
    </div>
  );
};

export default DragAndDropGame;

