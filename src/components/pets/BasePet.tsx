import React from 'react';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';

interface BasePetProps {
  color?: string;
  size?: number;
}

export function BasePet({ color = '#FFD700', size = 100 }: BasePetProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* 
        This is an SVG! Notice how the "fill" property is completely dynamic 
        based on the "color" prop passed to this component!
      */}
      
      {/* Left Ear */}
      <Path 
        d="M 25,50 Q 5,10 45,35 Z" 
        fill={color} 
        stroke="#1E3A8A" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />
      
      {/* Right Ear */}
      <Path 
        d="M 75,50 Q 95,10 55,35 Z" 
        fill={color} 
        stroke="#1E3A8A" 
        strokeWidth="4" 
        strokeLinejoin="round" 
      />
      
      {/* Main Head/Body */}
      <Ellipse 
        cx="50" 
        cy="60" 
        rx="35" 
        ry="30" 
        fill={color} 
        stroke="#1E3A8A" 
        strokeWidth="4" 
      />
      
      {/* Left Eye */}
      <Circle cx="35" cy="55" r="4" fill="#1E3A8A" />
      
      {/* Right Eye */}
      <Circle cx="65" cy="55" r="4" fill="#1E3A8A" />
      
      {/* Cute Nose */}
      <Ellipse cx="50" cy="63" rx="6" ry="4" fill="#1E3A8A" />
      
      {/* Little Smile */}
      <Path 
        d="M 40,72 Q 50,82 60,72" 
        fill="none" 
        stroke="#1E3A8A" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </Svg>
  );
}
