export type BodyVariant = 'blob' | 'box' | 'oval';
export type EyesVariant = 'happy' | 'angry' | 'dots';
export type EarsVariant = 'pointy' | 'floppy' | 'bear';
export type NoseMouthVariant = 'smile' | 'dog' | 'surprised';
export type LimbsVariant = 'stubby' | 'long' | 'none';

export interface PetTraits {
  body: BodyVariant;
  eyes: EyesVariant;
  ears: EarsVariant;
  noseMouth: NoseMouthVariant;
  limbs: LimbsVariant;
  bodyColor: string;
  outlineColor: string;
}

export interface LayerProps {
  color?: string;
  outlineColor?: string;
}
