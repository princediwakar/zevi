import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { theme } from '../theme';

interface PathConnectorProps {
  fromPosition: number; // -1 (left), 0 (center), 1 (right)
  toPosition: number;
  status: 'locked' | 'unlocked' | 'completed';
}

export const PathConnector = ({ fromPosition, toPosition, status }: PathConnectorProps) => {
  // Constants for geometry
  const NODE_SIZE = 80; // Approximate height of a node area including spacing
  const HEIGHT = 60; // Height of the connector area
  const WIDTH = 300; // Total width of the drawing area
  const CENTER_X = WIDTH / 2;
  const OFFSET_X = 70; // Horizontal offset for left/right positions

  const getX = (pos: number) => {
    if (pos === -1) return CENTER_X - OFFSET_X;
    if (pos === 1) return CENTER_X + OFFSET_X;
    return CENTER_X;
  };

  const startX = getX(fromPosition);
  const endX = getX(toPosition);
  
  // Bezier curve logic
  // If moving vertically (same X), straightforward line
  // If moving diagonally, we need control points
  
  const controlY1 = HEIGHT * 0.5;
  const controlY2 = HEIGHT * 0.5;

  const d = `M ${startX} 0 C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${HEIGHT}`;

  const color = status === 'locked' ? theme.colors.border.subtle : theme.colors.primary[300];
  const strokeWidth = 8;

  return (
    <View style={{ height: HEIGHT, width: '100%', alignItems: 'center' }}>
      <Svg width={WIDTH} height={HEIGHT}>
        {/* Background path for depth (optional) */}
        <Path
          d={d}
          stroke={theme.colors.neutral[200]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Active path */}
        {status !== 'locked' && (
             <Path
             d={d}
             stroke={color}
             strokeWidth={strokeWidth}
             fill="none"
             strokeLinecap="round"
             strokeDasharray={status === 'unlocked' ? "10, 5" : undefined} // Dashed for unlocked/current?
           />
        )}
      </Svg>
    </View>
  );
};
