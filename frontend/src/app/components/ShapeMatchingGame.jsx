"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import WebcamFeed from './WebcamFeed';
import { useHandCursor } from '../hooks/useHandCursor';

const ShapeMatchingGame = () => {
  const [useCamera, setUseCamera] = useState(true);
  const gameRef = useRef(null);
  const shapeElements = useRef(new Map());
  const zoneElements = useRef(new Map());
  const { cursor, update } = useHandCursor(gameRef, shapeElements, zoneElements);
  const [gestureHeld, setGestureHeld] = useState(null); // shape id being held by gesture

  const initialShapes = [
    { id: 'diamond', color: '#c44ed0', type: 'diamond' },
    { id: 'triangle', color: '#ffff00', type: 'triangle' },
    { id: 'square', color: '#7b0f80', type: 'square' },
    { id: 'rectangle', color: '#a0e39a', type: 'rectangle' },
    { id: 'circle', color: '#f05c3f', type: 'circle' },
    { id: 'pentagon', color: '#4287f5', type: 'pentagon' },
  ];

  const [shapes, setShapes] = useState([...initialShapes]);

  const dropZones = [
    { id: 'triangle-zone', accepts: 'triangle', label: 'triangle' },
    { id: 'rectangle-zone', accepts: 'rectangle', label: 'rectangle' },
    { id: 'diamond-zone', accepts: 'diamond', label: 'diamond' },
    { id: 'square-zone', accepts: 'square', label: 'square' },
    { id: 'circle-zone', accepts: 'circle', label: 'circle' },
    { id: 'pentagon-zone', accepts: 'pentagon', label: 'pentagon' },
  ];

  const [placedShapes, setPlacedShapes] = useState({});
  const [activeId, setActiveId] = useState(null);

  const randomizeShapes = () => {
    const shuffled = [...initialShapes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShapes(shuffled);
  };

  useEffect(() => {
    randomizeShapes();
  }, []);

  // Handle gesture grab/drop events
  useEffect(() => {
    if (!useCamera) return;

    if (cursor.justGrabbed) {
      setGestureHeld(cursor.justGrabbed);
    }
    if (cursor.justDropped) {
      const { shapeId, zoneId } = cursor.justDropped;
      const shape = shapes.find(s => s.id === shapeId);
      const dropZone = dropZones.find(d => d.id === zoneId);
      if (dropZone && shape && shape.type === dropZone.accepts) {
        setPlacedShapes(prev => ({ ...prev, [shape.id]: dropZone.id }));
      }
      setGestureHeld(null);
    }
    if (!cursor.isGrabbing) {
      setGestureHeld(null);
    }
  }, [cursor, useCamera]);

  const onLandmarks = useCallback(
    (landmarks) => {
      update(landmarks);
    },
    [update]
  );

  // Mouse/keyboard dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        start: ['Space', 'Enter'],
        cancel: ['Escape'],
        end: ['Space', 'Enter'],
      },
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const shape = shapes.find(s => s.id === active.id);
    const dropZone = dropZones.find(d => d.id === over.id);
    if (dropZone && shape.type === dropZone.accepts) {
      setPlacedShapes(prev => ({ ...prev, [shape.id]: dropZone.id }));
    }
  }

  const resetGame = () => {
    setPlacedShapes({});
    setGestureHeld(null);
    randomizeShapes();
  };

  const activeShape = shapes.find(s => s.id === activeId);
  const gestureShape = shapes.find(s => s.id === gestureHeld);

  const score = Object.keys(placedShapes).length;
  const isGameComplete = score === shapes.length;

  const [randomizedDropZones, setRandomizedDropZones] = useState([...dropZones]);

  useEffect(() => {
    const shuffled = [...dropZones];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomizedDropZones(shuffled);
  }, [placedShapes]);

  // Register shape/zone DOM refs
  const registerShape = useCallback((id, el) => {
    if (el) shapeElements.current.set(id, el);
    else shapeElements.current.delete(id);
  }, []);

  const registerZone = useCallback((id, el) => {
    if (el) zoneElements.current.set(id, el);
    else zoneElements.current.delete(id);
  }, []);

  return (
    <div ref={gameRef} className="w-full h-full bg-blue-400 p-6 flex flex-col relative">
      {/* Camera Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white text-xl font-bold">
          Score: {score} / {shapes.length}
          {isGameComplete && <span className="ml-4 text-yellow-300">Game Complete!</span>}
        </div>
        <div className="flex">
          <button
            className={`px-3 py-1 rounded-l-lg text-sm font-medium ${
              !useCamera ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(false)}
          >
            Mouse
          </button>
          <button
            className={`px-3 py-1 rounded-r-lg text-sm font-medium ${
              useCamera ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-800"
            }`}
            onClick={() => setUseCamera(true)}
          >
            Hand Gesture
          </button>
        </div>
      </div>

      {/* Webcam Feed */}
      <WebcamFeed enabled={useCamera} onLandmarks={onLandmarks} />

      {useCamera && (
        <p className="text-white text-xs text-center mb-2">
          Point with index finger to move. Extend thumb + index to grab. Tuck thumb to release.
        </p>
      )}

      {/* Virtual cursor */}
      {useCamera && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursor.x - 12,
            top: cursor.y - 12,
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: cursor.isGrabbing ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 255, 0, 0.7)",
            border: "2px solid white",
            transition: "background-color 0.1s",
          }}
        />
      )}

      {/* Floating shape following cursor while held */}
      {useCamera && gestureShape && (
        <div
          className="fixed pointer-events-none z-40 opacity-70"
          style={{ left: cursor.x - 24, top: cursor.y - 24 }}
        >
          <ShapeComponent color={gestureShape.color} type={gestureShape.type} />
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex">
          <div className="w-1/2 pr-2">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg shadow-md">
              <div className="grid grid-cols-3 gap-2">
                {shapes.map(shape => (
                  !placedShapes[shape.id] && (
                    <DraggableShape
                      key={shape.id}
                      id={shape.id}
                      color={shape.color}
                      type={shape.type}
                      compact={true}
                      registerRef={registerShape}
                      isGestureHeld={gestureHeld === shape.id}
                    />
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2 flex justify-end">
            <div className="flex flex-col space-y-3">
              {randomizedDropZones.map(zone => (
                <DropZone
                  key={zone.id}
                  id={zone.id}
                  label={zone.label}
                  placedShape={shapes.find(s => placedShapes[s.id] === zone.id)}
                  registerRef={registerZone}
                  isHovered={useCamera && cursor.isGrabbing && gestureHeld && (() => {
                    const el = zoneElements.current.get(zone.id);
                    if (!el) return false;
                    const r = el.getBoundingClientRect();
                    return cursor.x >= r.left && cursor.x <= r.right && cursor.y >= r.top && cursor.y <= r.bottom;
                  })()}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80">
              <ShapeComponent
                color={activeShape.color}
                type={activeShape.type}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isGameComplete && (
        <button
          onClick={resetGame}
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded self-center"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

// Draggable shape component
function DraggableShape({ id, color, type, compact, registerRef, isGestureHeld }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({ id });

  const combinedRef = useCallback((el) => {
    setNodeRef(el);
    registerRef(id, el);
  }, [setNodeRef, registerRef, id]);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isGestureHeld ? 0.4 : 1,
  };

  return (
    <div
      ref={combinedRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-2 rounded-md flex items-center justify-center cursor-grab touch-manipulation transition-opacity ${
        isGestureHeld ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <ShapeComponent color={color} type={type} compact={compact} />
    </div>
  );
}

// Shape component for rendering different shapes
function ShapeComponent({ color, type, compact }) {
  const size = compact ? "w-12 h-12" : "w-16 h-16";
  const rectSize = compact ? "w-14 h-10" : "w-20 h-12";

  switch (type) {
    case 'circle':
      return (
        <div
          className={`${size} rounded-full border-2 border-black`}
          style={{ backgroundColor: color }}
        />
      );
    case 'square':
      return (
        <div
          className={`${size} border-2 border-black`}
          style={{ backgroundColor: color }}
        />
      );
    case 'rectangle':
      return (
        <div
          className={`${rectSize} border-2 border-black`}
          style={{ backgroundColor: color }}
        />
      );
    case 'triangle':
      return (
        <div className={`relative ${size} flex items-center justify-center`}>
          <div
            className="absolute"
            style={{
              width: '0',
              height: '0',
              borderLeft: compact ? '20px solid transparent' : '25px solid transparent',
              borderRight: compact ? '20px solid transparent' : '25px solid transparent',
              borderBottom: `${compact ? '34px' : '43px'} solid ${color}`,
              filter: 'drop-shadow(0px 0px 1px black)'
            }}
          />
        </div>
      );
    case 'diamond':
      return (
        <div
          className={`${size} border-2 border-black transform rotate-45`}
          style={{ backgroundColor: color }}
        />
      );
    case 'pentagon':
      return (
        <div className={`relative ${size} flex items-center justify-center`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
          >
            <polygon
              points="50,5 95,35 80,90 20,90 5,35"
              fill={color}
              stroke="black"
              strokeWidth="3"
            />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

// Drop zone component
function DropZone({ id, label, placedShape, registerRef, isHovered }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const combinedRef = useCallback((el) => {
    setNodeRef(el);
    registerRef(id, el);
  }, [setNodeRef, registerRef, id]);

  return (
    <div className="flex items-center">
      <div
        ref={combinedRef}
        className={`w-24 h-20 rounded-lg flex items-center justify-center mr-4 transition-colors ${
          isOver || isHovered ? 'bg-yellow-200 ring-2 ring-yellow-400' : 'bg-blue-300'
        }`}
      >
        {placedShape && (
          <ShapeComponent color={placedShape.color} type={placedShape.type} />
        )}
      </div>
      <span className="text-xl font-bold text-black">{label}</span>
    </div>
  );
}

export default ShapeMatchingGame;
