import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Modal, Easing } from 'react-native';

const SYMBOLS = ['🐶', '🐱', '💖', '🐾', '💎', '🍒', '🪙'];
const BET_INCREMENTS = [0.1, 0.5, 1, 5, 50, 100, 1000, 100000];
const MOCK_USD_PRICE = 0.00014; // $0.00014 USD per Floki

export default function SlotMachine() {
  const [flokiBalance, setFlokiBalance] = useState(1000);
  const [globalJackpot, setGlobalJackpot] = useState(40123.4);
  const [betIndex, setBetIndex] = useState(2); // Default to index 2 (which is 1 Floki)
  
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState('');
  
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const betAmount = BET_INCREMENTS[betIndex];

  // Animation values for reels
  const [reel1Anim] = useState(() => new Animated.Value(0));
  const [reel2Anim] = useState(() => new Animated.Value(0));
  const [reel3Anim] = useState(() => new Animated.Value(0));

  const handleDecreaseBet = () => {
    if (betIndex > 0) setBetIndex(betIndex - 1);
  };

  const handleIncreaseBet = () => {
    if (betIndex < BET_INCREMENTS.length - 1) setBetIndex(betIndex + 1);
  };

  const spinReel = (animValue: Animated.Value, duration: number) => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 10,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleSpin = () => {
    if (isSpinning || flokiBalance < betAmount) return;

    setIsSpinning(true);
    setWinMessage('');
    
    // Deduct bet and add to jackpot (mock logic)
    setFlokiBalance(prev => Number((prev - betAmount).toFixed(2)));
    setGlobalJackpot(prev => Number((prev + 0.1).toFixed(2)));

    // Start UI animations
    spinReel(reel1Anim, 1000);
    spinReel(reel2Anim, 1500);
    spinReel(reel3Anim, 2000);

    // Flashing effect during spin
    const flashInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 100);

    // Stop and evaluate result after 2 seconds
    setTimeout(() => {
      clearInterval(flashInterval);
      
      // Determine final result (Mocking the Lambda's logic locally)
      const result = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ];
      setReels(result);
      
      evaluateWin(result);
      setIsSpinning(false);
    }, 2000);
  };

  const evaluateWin = (result: string[]) => {
    const [r1, r2, r3] = result;
    
    // Jackpot check
    if (r1 === '💎' && r2 === '💎' && r3 === '💎') {
      if (globalJackpot >= 40000) {
        setFlokiBalance(prev => Number((prev + globalJackpot).toFixed(2)));
        setWinMessage(`JACKPOT! You won ${globalJackpot.toFixed(2)} Floki!`);
        setGlobalJackpot(0); // Reset jackpot
        return;
      }
    }

    // 3 of a kind
    if (r1 === r2 && r2 === r3) {
      const win = betAmount * 10;
      setFlokiBalance(prev => Number((prev + win).toFixed(2)));
      setWinMessage(`Big Win! +${win.toFixed(2)} Floki`);
      return;
    }

    // 2 of a kind
    if (r1 === r2 || r2 === r3 || r1 === r3) {
      const win = betAmount * 2;
      setFlokiBalance(prev => Number((prev + win).toFixed(2)));
      setWinMessage(`Win! +${win.toFixed(2)} Floki`);
      return;
    }

    // Loss
    setWinMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: Balance & How to Play */}
      <View style={styles.topBar}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Your Floki</Text>
          <Text style={styles.balanceValue}>{flokiBalance.toFixed(2)} 🪙</Text>
        </View>
        <Pressable style={styles.howToPlayBtn} onPress={() => setShowHowToPlay(true)}>
          <Text style={styles.howToPlayText}>How To Play</Text>
        </Pressable>
      </View>

      {/* Jackpot Ticker */}
      <View style={styles.jackpotContainer}>
        <Text style={styles.jackpotLabel}>GLOBAL JACKPOT</Text>
        <Text style={styles.jackpotValue}>{globalJackpot.toFixed(2)}</Text>
      </View>

      {/* Main Slot Machine Machine Area */}
      <View style={styles.machineBody}>
        <View style={styles.reelsContainer}>
          {reels.map((symbol, i) => {
            const anim = i === 0 ? reel1Anim : i === 1 ? reel2Anim : reel3Anim;
            const translateY = anim.interpolate({
              inputRange: [0, 10],
              outputRange: [0, 200], // Will loop by wrapping in UI
            });
            return (
              <Animated.View key={i} style={[styles.reelWrapper, { transform: [{ translateY }] }]}>
                <Text style={styles.symbol}>{symbol}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Win Message Area */}
      <View style={styles.messageArea}>
        <Text style={styles.winText}>{winMessage}</Text>
      </View>

      {/* Controls Area */}
      <View style={styles.controlsContainer}>
        <Text style={styles.betLabel}>Bet Amount</Text>
        <View style={styles.betStepper}>
          <Pressable 
            style={[styles.stepBtn, betIndex === 0 && styles.stepBtnDisabled]} 
            onPress={handleDecreaseBet}
            disabled={betIndex === 0 || isSpinning}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </Pressable>
          
          <Text style={styles.betAmountText}>{betAmount}</Text>
          
          <Pressable 
            style={[styles.stepBtn, betIndex === BET_INCREMENTS.length - 1 && styles.stepBtnDisabled]} 
            onPress={handleIncreaseBet}
            disabled={betIndex === BET_INCREMENTS.length - 1 || isSpinning}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </Pressable>
        </View>

        <Pressable 
          style={[styles.spinBtn, (isSpinning || flokiBalance < betAmount) && styles.spinBtnDisabled]} 
          onPress={handleSpin}
          disabled={isSpinning || flokiBalance < betAmount}
        >
          <Text style={styles.spinBtnText}>
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </Text>
        </Pressable>
      </View>

      {/* How To Play Modal */}
      <Modal visible={showHowToPlay} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How To Play</Text>
            <Text style={styles.modalText}>Match symbols to win Floki!</Text>
            <Text style={styles.modalText}>• 3 of a Kind = 10x Bet</Text>
            <Text style={styles.modalText}>• 2 of a Kind = 2x Bet</Text>
            <Text style={styles.modalText}>• 3 💎 = GLOBAL JACKPOT (if over 40k)</Text>
            <View style={styles.divider} />
            <Text style={styles.modalSubtitle}>Market Price</Text>
            <Text style={styles.modalText}>1 Floki = ${MOCK_USD_PRICE}</Text>
            
            <Pressable style={styles.closeModalBtn} onPress={() => setShowHowToPlay(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121A', // FlokiPets dark theme
    alignItems: 'center',
    paddingTop: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 12,
  },
  balanceLabel: {
    color: '#ADB5BD',
    fontSize: 12,
  },
  balanceValue: {
    color: '#FFB020',
    fontSize: 20,
    fontWeight: 'bold',
  },
  howToPlayBtn: {
    padding: 10,
    borderColor: '#FFB020',
    borderWidth: 1,
    borderRadius: 8,
  },
  howToPlayText: {
    color: '#FFB020',
    fontWeight: '600',
  },
  jackpotContainer: {
    backgroundColor: 'rgba(255, 176, 32, 0.15)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFB020',
    marginBottom: 30,
    alignItems: 'center',
  },
  jackpotLabel: {
    color: '#FFB020',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  jackpotValue: {
    color: '#FFD000',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 176, 32, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  machineBody: {
    backgroundColor: '#2C3E50',
    padding: 20,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#4A5568',
    width: '90%',
    alignItems: 'center',
  },
  reelsContainer: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    gap: 15,
  },
  reelWrapper: {
    backgroundColor: '#fff',
    width: 80,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  symbol: {
    fontSize: 50,
  },
  messageArea: {
    height: 40,
    justifyContent: 'center',
    marginTop: 15,
  },
  winText: {
    color: '#48BB78',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(72, 187, 120, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  controlsContainer: {
    width: '90%',
    marginTop: 'auto',
    marginBottom: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  betLabel: {
    color: '#F8F9FA',
    fontSize: 16,
    marginBottom: 10,
  },
  betStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  stepBtn: {
    backgroundColor: '#4A5568',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.5,
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  betAmountText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    width: 120,
    textAlign: 'center',
  },
  spinBtn: {
    backgroundColor: '#FFB020',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFB020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spinBtnDisabled: {
    backgroundColor: '#718096',
    shadowOpacity: 0,
  },
  spinBtnText: {
    color: '#1A202C',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C3E50',
    padding: 30,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFB020',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalSubtitle: {
    color: '#F8F9FA',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  modalText: {
    color: '#ADB5BD',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    marginVertical: 15,
  },
  closeModalBtn: {
    marginTop: 20,
    backgroundColor: '#4A5568',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
