import React from 'react';
import { Path, Circle } from 'react-native-svg';
import { LayerProps, EarsVariant } from '../types';

interface Props extends LayerProps {
  variant: EarsVariant;
}

export function Ears({ variant, color = '#FFF', outlineColor = '#000' }: Props) {
  switch (variant) {
    case 'pointy':
      return (
        <>
          <Path d="M 25,50 Q 5,10 45,35 Z" fill={color} stroke={outlineColor} strokeWidth="4" strokeLinejoin="round" />
          <Path d="M 75,50 Q 95,10 55,35 Z" fill={color} stroke={outlineColor} strokeWidth="4" strokeLinejoin="round" />
        </>
      );
    case 'floppy':
      return (
        <>
          <Path d="M 25,40 Q -10,60 15,80 Q 30,70 35,45 Z" fill={color} stroke={outlineColor} strokeWidth="4" strokeLinejoin="round" />
          <Path d="M 75,40 Q 110,60 85,80 Q 70,70 65,45 Z" fill={color} stroke={outlineColor} strokeWidth="4" strokeLinejoin="round" />
        </>
      );
    case 'bear':
    default:
      return (
        <>
          <Circle cx="25" cy="30" r="15" fill={color} stroke={outlineColor} strokeWidth="4" />
          <Circle cx="75" cy="30" r="15" fill={color} stroke={outlineColor} strokeWidth="4" />
        </>
      );
  }
}
