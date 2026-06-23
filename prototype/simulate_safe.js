const ITERATIONS = 5000;

function getFeedback(guess, secret) {
    let perfect = 0;
    let exists = 0;
    let sCopy = [...secret];
    let gCopy = [...guess];
    
    for (let i = 0; i < 4; i++) {
        if (gCopy[i] === sCopy[i]) {
            perfect++;
            sCopy[i] = null;
            gCopy[i] = -1;
        }
    }
    
    for (let i = 0; i < 4; i++) {
        if (gCopy[i] !== -1) {
            let idx = sCopy.indexOf(gCopy[i]);
            if (idx !== -1) {
                exists++;
                sCopy[idx] = null;
            }
        }
    }
    return { perfect, exists };
}

function generateAllCodes() {
    let codes = [];
    for (let i = 0; i < 10000; i++) {
        let str = i.toString().padStart(4, '0');
        codes.push([parseInt(str[0]), parseInt(str[1]), parseInt(str[2]), parseInt(str[3])]);
    }
    return codes;
}

let allCodes = generateAllCodes();
let winsIn5 = 0;

for (let iter = 0; iter < ITERATIONS; iter++) {
    let secret = allCodes[Math.floor(Math.random() * allCodes.length)];
    let possibleCodes = [...allCodes];
    let guesses = 0;
    
    // Hardcode first guess to be 0123 which is a good starting move
    let currentGuess = [0, 1, 2, 3];
    
    while (guesses < 5) {
        guesses++;
        let feedback = getFeedback(currentGuess, secret);
        
        if (feedback.perfect === 4) {
            winsIn5++;
            break;
        }
        
        // Filter possible codes
        possibleCodes = possibleCodes.filter(code => {
            let fb = getFeedback(currentGuess, code);
            return fb.perfect === feedback.perfect && fb.exists === feedback.exists;
        });
        
        if (possibleCodes.length === 0) break; // Should not happen
        
        // Pick random from remaining
        currentGuess = possibleCodes[Math.floor(Math.random() * possibleCodes.length)];
    }
}

console.log("Win rate in <= 5 tries (Greedy strategy):", (winsIn5 / ITERATIONS) * 100, "%");
