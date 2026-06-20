import React from 'react';
import { Path, Ellipse } from 'react-native-svg';
import { LayerProps, LimbsVariant } from '../types';

interface Props extends LayerProps {
  variant: LimbsVariant;
}

export function Limbs({ variant, color = '#FFF', outlineColor = '#000' }: Props) {
  if (variant === 'none') return null;

  switch (variant) {
    case 'long':
      return (
        <>
          {/* Arms */}
          <Path d="M 20,60 Q -10,70 10,90" fill="none" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
          <Path d="M 80,60 Q 110,70 90,90" fill="none" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
          {/* Hands */}
          <Ellipse cx="10" cy="90" rx="6" ry="6" fill={color} stroke={outlineColor} strokeWidth="3" />
          <Ellipse cx="90" cy="90" rx="6" ry="6" fill={color} stroke={outlineColor} strokeWidth="3" />
          {/* Feet */}
          <Ellipse cx="35" cy="95" rx="8" ry="5" fill={color} stroke={outlineColor} strokeWidth="4" />
          <Ellipse cx="65" cy="95" rx="8" ry="5" fill={color} stroke={outlineColor} strokeWidth="4" />
        </>
      );
    case 'stubby':
    default:
      return (
        <>
          {/* Arms */}
          <Ellipse cx="15" cy="65" rx="8" ry="6" fill={color} stroke={outlineColor} strokeWidth="4" transform="rotate(-30 15 65)" />
          <Ellipse cx="85" cy="65" rx="8" ry="6" fill={color} stroke={outlineColor} strokeWidth="4" transform="rotate(30 85 65)" />
          {/* Feet */}
          <Ellipse cx="40" cy="90" rx="10" ry="6" fill={color} stroke={outlineColor} strokeWidth="4" />
          <Ellipse cx="60" cy="90" rx="10" ry="6" fill={color} stroke={outlineColor} strokeWidth="4" />
        </>
      );
  }
}
