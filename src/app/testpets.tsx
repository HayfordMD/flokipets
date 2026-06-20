import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ComposedPet } from '@/components/pets/ComposedPet';
import { PetTraits, BodyVariant, EyesVariant, EarsVariant, NoseMouthVariant, LimbsVariant } from '@/components/pets/types';

const COLORS = ['#FFD700', '#FF8C00', '#4ADE80', '#60A5FA', '#A78BFA', '#F472B6', '#FFF'];
const BODIES: BodyVariant[] = ['blob', 'box', 'oval'];
const EYES: EyesVariant[] = ['happy', 'angry', 'dots'];
const EARS: EarsVariant[] = ['pointy', 'floppy', 'bear'];
const NOSES: NoseMouthVariant[] = ['smile', 'dog', 'surprised'];
const LIMBS: LimbsVariant[] = ['stubby', 'long', 'none'];

export default function TestPetsScreen() {
  const [traits, setTraits] = useState<PetTraits>({
    body: 'blob',
    eyes: 'happy',
    ears: 'pointy',
    noseMouth: 'smile',
    limbs: 'stubby',
    bodyColor: '#FFD700',
    outlineColor: '#1E3A8A'
  });

  const randomize = () => {
    setTraits({
      body: BODIES[Math.floor(Math.random() * BODIES.length)],
      eyes: EYES[Math.floor(Math.random() * EYES.length)],
      ears: EARS[Math.floor(Math.random() * EARS.length)],
      noseMouth: NOSES[Math.floor(Math.random() * NOSES.length)],
      limbs: LIMBS[Math.floor(Math.random() * LIMBS.length)],
      bodyColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      outlineColor: '#1E3A8A' // keep outline consistent for now
    });
  };

  const updateTrait = <K extends keyof PetTraits>(key: K, value: PetTraits[K]) => {
    setTraits(prev => ({ ...prev, [key]: value }));
  };

  const renderSelector = <T extends string>(title: string, options: T[], current: T, traitKey: keyof PetTraits) => (
    <View style={styles.selectorSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {options.map(opt => (
          <TouchableOpacity 
            key={opt}
            style={[styles.pill, current === opt && styles.activePill]}
            onPress={() => updateTrait(traitKey, opt as any)}
          >
            <Text style={[styles.pillText, current === opt && styles.activePillText]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Studio Sandbox</Text>
        <TouchableOpacity style={styles.randomButton} onPress={randomize}>
          <Text style={styles.randomButtonText}>🎲 Randomize</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Canvas */}
      <View style={styles.previewCanvas}>
        <ComposedPet traits={traits} size={250} />
      </View>

      {/* Trait Selectors */}
      <ScrollView style={styles.controls} contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* Colors Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionTitle}>Body Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {COLORS.map(color => (
              <TouchableOpacity 
                key={color}
                style={[
                  styles.colorBox, 
                  { backgroundColor: color },
                  traits.bodyColor === color && styles.activeColorBox
                ]}
                onPress={() => updateTrait('bodyColor', color)}
              />
            ))}
          </ScrollView>
        </View>

        {renderSelector('Body Shape', BODIES, traits.body, 'body')}
        {renderSelector('Eyes', EYES, traits.eyes, 'eyes')}
        {renderSelector('Ears', EARS, traits.ears, 'ears')}
        {renderSelector('Mouth / Nose', NOSES, traits.noseMouth, 'noseMouth')}
        {renderSelector('Limbs', LIMBS, traits.limbs, 'limbs')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  randomButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  randomButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  previewCanvas: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  controls: {
    flex: 1,
    paddingHorizontal: 16,
  },
  selectorSection: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10
  },
  scrollRow: {
    flexDirection: 'row'
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    marginRight: 10
  },
  activePill: {
    backgroundColor: '#3B82F6'
  },
  pillText: {
    color: '#4B5563',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  activePillText: {
    color: 'white'
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB'
  },
  activeColorBox: {
    borderColor: '#3B82F6',
    borderWidth: 3
  }
});
