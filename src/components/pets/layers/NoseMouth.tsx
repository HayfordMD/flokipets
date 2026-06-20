import React from 'react';
import { Ellipse, Path, Circle } from 'react-native-svg';
import { LayerProps, NoseMouthVariant } from '../types';

interface Props extends LayerProps {
  variant: NoseMouthVariant;
}

export function NoseMouth({ variant, outlineColor = '#000' }: Props) {
  switch (variant) {
    case 'dog':
      return (
        <>
          <Ellipse cx="50" cy="63" rx="6" ry="4" fill={outlineColor} />
          <Path d="M 50,67 L 50,72" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          <Path d="M 40,70 Q 50,75 50,72 Q 50,75 60,70" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'surprised':
      return (
        <>
          <Circle cx="50" cy="70" r="5" fill="none" stroke={outlineColor} strokeWidth="3" />
        </>
      );
    case 'smile':
    default:
      return (
        <>
          <Path d="M 40,70 Q 50,80 60,70" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
        </>
      );
  }
}
