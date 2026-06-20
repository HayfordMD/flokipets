import React from 'react';
import Svg from 'react-native-svg';
import { PetTraits } from './types';
import { Body } from './layers/Body';
import { Eyes } from './layers/Eyes';
import { Ears } from './layers/Ears';
import { NoseMouth } from './layers/NoseMouth';
import { Limbs } from './layers/Limbs';

interface Props {
  traits: PetTraits;
  size?: number;
}

export function ComposedPet({ traits, size = 150 }: Props) {
  const { body, eyes, ears, noseMouth, limbs, bodyColor, outlineColor } = traits;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 1. Back Layers */}
      <Ears variant={ears} color={bodyColor} outlineColor={outlineColor} />
      
      {/* 2. Limbs (Arms/Feet) */}
      <Limbs variant={limbs} color={bodyColor} outlineColor={outlineColor} />
      
      {/* 3. Main Body */}
      <Body variant={body} color={bodyColor} outlineColor={outlineColor} />
      
      {/* 4. Facial Features (Front Layers) */}
      <Eyes variant={eyes} outlineColor={outlineColor} />
      <NoseMouth variant={noseMouth} outlineColor={outlineColor} />
    </Svg>
  );
}
