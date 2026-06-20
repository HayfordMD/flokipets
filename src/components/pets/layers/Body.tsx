import React from 'react';
import { Path, Ellipse, Rect } from 'react-native-svg';
import { LayerProps, BodyVariant } from '../types';

interface Props extends LayerProps {
  variant: BodyVariant;
}

export function Body({ variant, color = '#FFF', outlineColor = '#000' }: Props) {
  switch (variant) {
    case 'blob':
      return (
        <Path 
          d="M 50,30 C 80,30 90,60 80,80 C 70,100 30,100 20,80 C 10,60 20,30 50,30 Z" 
          fill={color} 
          stroke={outlineColor} 
          strokeWidth="4" 
        />
      );
    case 'box':
      return (
        <Rect 
          x="20" y="30" 
          width="60" height="60" 
          rx="10" 
          fill={color} 
          stroke={outlineColor} 
          strokeWidth="4" 
        />
      );
    case 'oval':
    default:
      return (
        <Ellipse 
          cx="50" cy="60" 
          rx="35" ry="40" 
          fill={color} 
          stroke={outlineColor} 
          strokeWidth="4" 
        />
      );
  }
}
