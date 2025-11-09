// --- 1. FIREBASE V8 CONFIG ADDED ---
// (Using the same config as your other file)
const firebaseConfig = {
  apiKey: "AIzaSyBmrxwZ4F7E3Xfa_gi0tfiS7JH3NqxgjXY",
  authDomain: "dragon-hunt-html.firebaseapp.com",
  databaseURL: "https://dragon-hunt-html-default-rtdb.firebaseio.com",
  projectId: "dragon-hunt-html",
  storageBucket: "dragon-hunt-html.firebasestorage.app",
  messagingSenderId: "724852876791",
  appId: "1:724852876791:web:ce453714f44472bad27af2",
  measurementId: "G-9ESB16Y3M0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const analytics = firebase.analytics();

// --- 1. MOVED THESE VARIABLES UP HERE ---
const localXdispP = document.getElementById('localxdisp');
const localYdispP = document.getElementById('localydisp'); 


// --- 2. YOUR EXISTING HELPER FUNCTION ---
// This is a helper function to check if two rectangle objects are overlapping
function areRectsOverlapping(r1, r2) {
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

// --- 3. YOUR EXISTING KEYDOWN LISTENER ---
document.addEventListener('keydown', function(event) {
  
  const key = event.key.toLowerCase();
  const yourperson = document.getElementById('you');
  
  // Get all elements with the class 'obstacles'
  const obstacles = document.querySelectorAll('.obstacles'); 

  const logPosition = function() {
    const style = window.getComputedStyle(yourperson);
    const yourxposition = style.getPropertyValue('left');
    const youryposition = style.getPropertyValue('bottom');
    console.log(yourxposition + youryposition);
    
    // --- 2. UPDATE P-TAGS ---
    localXdispP.textContent = yourxposition;
    localYdispP.textContent = youryposition; 
    
    // --- 3. SAVE X AND Y TO FIREBASE ---
    const blueXref = database.ref('players/blue/x'); // <-- CHANGED
    blueXref.set(yourxposition);

    const blueYref = database.ref('players/blue/y'); // <-- CHANGED
    blueYref.set(youryposition);
  };

  // --- Get player's current position BEFORE any checks ---
  const playerRect = yourperson.getBoundingClientRect();
  
  // --- Get binoculars' position ---
  const binoculars = document.getElementById('binoculars');
  let binocularsRect = null;
  if (binoculars) {
      binocularsRect = binoculars.getBoundingClientRect();
  }


  if (key === 'd') {
    console.log('The "d" key was pressed!');
    
    // 1. Define the player's future position
    const futureRect = {
      top: playerRect.top,
      bottom: playerRect.bottom,
      left: playerRect.left + 2,
      right: playerRect.right + 2
    };

    // 2. Check if the future position hits any obstacle
    let canMove = true;
    for (const obstacle of obstacles) {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (areRectsOverlapping(futureRect, obstacleRect)) {
        canMove = false;
        break; // Found a collision, no need to check others
      }
    }
    
    // --- Check for binocular collision (does NOT block movement) ---
    if (binocularsRect && areRectsOverlapping(futureRect, binocularsRect)) {
        alert("You found the binoculars"); 
        
        // --- 4. FIREBASE SAVE CODE PLUGGED IN ---
        const binocularsRef = database.ref('players/blue/relics/binoculars'); // <-- CHANGED
        binocularsRef.set(true)
          .then(() => console.log("Binoculars saved to Firebase!"))
          .catch((error) => console.error("Firebase save error:", error));
    }

    // 3. Check boundaries (like you had before)
    const style = window.getComputedStyle(yourperson);
    const currentX = parseInt(style.getPropertyValue('left'), 10);
    
    // 4. Only move if boundary is OK AND we can move
    if (currentX + 2 <= 1290 && canMove) {
      $('#you').animate({
          left: '+=2px' 
      }, 0, logPosition);
    }

  } else if (key === 'a') {
    console.log('The "a" key was pressed!');
    
    const futureRect = {
      top: playerRect.top,
      bottom: playerRect.bottom,
      left: playerRect.left - 2,
      right: playerRect.right - 2
    };

    let canMove = true;
    for (const obstacle of obstacles) {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (areRectsOverlapping(futureRect, obstacleRect)) {
        canMove = false;
        break;
      }
    }
    
    // --- Check for binocular collision (does NOT block movement) ---
    if (binocularsRect && areRectsOverlapping(futureRect, binocularsRect)) {
        alert("You found the binoculars");
        
        // --- 4. FIREBASE SAVE CODE PLUGGED IN ---
        const binocularsRef = database.ref('players/blue/relics/binoculars'); // <-- CHANGED
        binocularsRef.set(true)
          .then(() => console.log("Binoculars saved to Firebase!"))
          .catch((error) => console.error("Firebase save error:", error));
    }
    
    const style = window.getComputedStyle(yourperson);
    const currentX = parseInt(style.getPropertyValue('left'), 10);

    if (currentX - 2 > 0 && canMove) {
      $('#you').animate({
          left: '-=2px'
      }, 0, logPosition);
    }
  } else if (key === 's') {
    console.log('The "s" key was pressed!');
    
    // Moving "down" on screen increases the 'top' value
    const futureRect = {
      top: playerRect.top + 2,
      bottom: playerRect.bottom + 2,
      left: playerRect.left,
      right: playerRect.right
    };

    let canMove = true;
    for (const obstacle of obstacles) {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (areRectsOverlapping(futureRect, obstacleRect)) {
        canMove = false;
        break;
      }
    }
    
    // --- Check for binocular collision (does NOT block movement) ---
    if (binocularsRect && areRectsOverlapping(futureRect, binocularsRect)) {
        alert("You found the binoculars");
        
        // --- 4. FIREBASE SAVE CODE PLUGGED IN ---
        const binocularsRef = database.ref('players/blue/relics/binoculars'); // <-- CHANGED
        binocularsRef.set(true)
          .then(() => console.log("Binoculars saved to Firebase!"))
          .catch((error) => console.error("Firebase save error:", error));
    }
    
    const style = window.getComputedStyle(yourperson);
    const currentY = parseInt(style.getPropertyValue('bottom'), 10);

    if (currentY - 2 >= 0 && canMove) {
      $('#you').animate({
          bottom: '-=2px'
      }, 0, logPosition);
    }
  } else if (key === 'w') {
    console.log('The "w" key was pressed!');

    // Moving "up" on screen decreases the 'top' value
    const futureRect = {
      top: playerRect.top - 2,
      bottom: playerRect.bottom - 2,
      left: playerRect.left,
      right: playerRect.right
    };

    let canMove = true;
    for (const obstacle of obstacles) {
      const obstacleRect = obstacle.getBoundingClientRect();
      if (areRectsOverlapping(futureRect, obstacleRect)) {
        canMove = false;
        break;
      }
    }
    
    // --- Check for binocular collision (does NOT block movement) ---
    if (binocularsRect && areRectsOverlapping(futureRect, binocularsRect)) {
        alert("You found the binoculars");
        
        // --- 4. FIREBASE SAVE CODE PLUGGED IN ---
        const binocularsRef = database.ref('players/blue/relics/binoculars'); // <-- CHANGED
        binocularsRef.set(true)
          .then(() => console.log("Binoculars saved to Firebase!"))
          .catch((error) => console.error("Firebase save error:", error));
    }

    const style = window.getComputedStyle(yourperson);
    const currentY = parseInt(style.getPropertyValue('bottom'), 10);

    if (currentY + 2 <= 790 && canMove) {
      $('#you').animate({
          bottom: '+=2px'
      }, 0, logPosition);
    }
  }
});