import React from 'react';
import { Circle, Path } from 'react-native-svg';
import { LayerProps, EyesVariant } from '../types';

interface Props extends LayerProps {
  variant: EyesVariant;
}

export function Eyes({ variant, outlineColor = '#000' }: Props) {
  switch (variant) {
    case 'happy':
      return (
        <>
          <Path d="M 30,55 Q 35,45 40,55" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <Path d="M 60,55 Q 65,45 70,55" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'angry':
      return (
        <>
          <Path d="M 28,48 L 42,53" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="35" cy="55" r="4" fill={outlineColor} />
          
          <Path d="M 72,48 L 58,53" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="65" cy="55" r="4" fill={outlineColor} />
        </>
      );
    case 'dots':
    default:
      return (
        <>
          <Circle cx="35" cy="55" r="5" fill={outlineColor} />
          <Circle cx="65" cy="55" r="5" fill={outlineColor} />
        </>
      );
  }
}
