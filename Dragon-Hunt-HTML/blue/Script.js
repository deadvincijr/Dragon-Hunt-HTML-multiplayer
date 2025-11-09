// Your web app's Firebase configuration
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

// Get services
const analytics = firebase.analytics();
const database = firebase.database(); // This gets the database service


// --- Firebase application logic ---

// 
// THIS IS THE FIRST FIX (Line 28)
// We call .ref() ON the database service, and only pass the path.
//
const karlHealthRef = database.ref('players/Karl/health');

// Function to set Karl's health in the Realtime Database
function setKarlHealth(healthValue) {
    karlHealthRef.set(healthValue)
        .then(() => {
            console.log(`Karl's health set to ${healthValue} successfully!`);
        })
        .catch((error) => {
            console.error("Error setting Karl's health:", error);
        });
}


// --- Your displayisleinfo function ---
// (This code is all fine)
let pastselectedisland = 0;
function displayisleinfo(selected) {
    let isledecriptionboxjs = document.getElementById("isledescriptionbox"); 
    if (!isledecriptionboxjs) {
        console.error("Element with ID 'isledescriptionbox' not found.");
        return; 
    }
    if (pastselectedisland === selected) {
        if (confirm("Do you want to travel to the selected island?")) {
            window.location.href = "https://deadvincijr.github.io/Dragon-Hunt/Dragon%20Hunt%20HTML/Island%201/Index.html";
        }
    } else {
        if (selected === 1) {
            isledecriptionboxjs.innerHTML = "A relatively unknown island. Most dragons stay away from it as the fog makes it hard to see. Here, the snowstorms are so bad you can't see 15 feet in front of you. You can only stay here for 2 turns without some kind of protection.";
        } else if (selected === 2) {
            isledecriptionboxjs.innerHTML = "The Northernmost island. Believe to be home of several dragons, this island holds many relics, but also the danger of dragons finding you on their home turf.  This island is where many lesser dragons flee to avoid the power of the apex dragons which have carved out empires for themselves.";
        } else if (selected === 3) {
            isledecriptionboxjs.innerHTML = "Terrain is very rocky and has lots of caves and hiding spots but has extremely high dragon encounters for those unlucky enough to not find a cave.";
        } else if (selected === 4) {
            isledecriptionboxjs.innerHTML = "An island about the size of a small neighborhood. All dragons go here all the time, but there is a cave with enough room for one person so they can hide.";
        } else if (selected === 5) {
            isledecriptionboxjs.innerHTML = "This is the place of many battles. The most legendary of which is said to have created a great wizard who blasted his whole family in his search for power. The island's terrain isn't particularly dangerous, although most of the known dragons are known to visit it from time to time.";
        } else if (selected === 6) {
            isledecriptionboxjs.innerHTML = "There is lots of treasure here and relics and no apparent danger. Dragons rarely visit it.";
        } else if (selected === 7) {
            isledecriptionboxjs.innerHTML = "This island is completely uninhabitable and you can't go here without some form of special power.";
        } else if (selected === 8) {
            isledecriptionboxjs.innerHTML = "A desolate wasteland ravaged by battles gone. This island is only habitable for one turn before it takes a toll on you. I have no idea why you would go here.";
        } else if (selected === 9) {
            isledecriptionboxjs.innerHTML = "Very muddy and murky. The island itself is considered to have dangerous wildlife and although they're rare, does have dragons attacks.";
        }
        pastselectedisland = selected;
    }
}

// THIS LINE IS CRITICAL - keep it!
window.displayisleinfo = displayisleinfo;


// --- Event listeners and real-time data display ---

document.addEventListener('DOMContentLoaded', async () => { 

    //
    // THIS IS THE SECOND FIX (Line 98)
    // Same as before, just pass the path to database.ref()
    //
    const KarlXposRef = database.ref('players/Karl/X');
    const karllocalx = 20;

    try {
        await KarlXposRef.set(karllocalx);
        console.log("Karl's X position (players/Karl/X) set to 20 in DB.");

        const snapshot = await KarlXposRef.get();

        if (snapshot.exists()) {
            const KarlcloudX = snapshot.val();
        } else {
            alert("Error: Karl's X position not found after setting it.");
        }
    } catch (error) {
        console.error("An error occurred with Karl's X position operations:", error);
        alert("An error occurred: " + error.message);
    }
    const setHealthButton = document.getElementById('set-health-button');
    if (setHealthButton) {
        setHealthButton.addEventListener('click', () => {
            setKarlHealth(100); 
        });
    }
    
    const updateHealthButton = document.getElementById('update-health-button');
    const newKarlHealthInput = document.getElementById('newKarlHealth');
    if (updateHealthButton && newKarlHealthInput) {
        updateHealthButton.addEventListener('click', () => {
            const newHealthValue = parseInt(newKarlHealthInput.value, 10); 
            if (!isNaN(newHealthValue) && newKarlHealthInput.value.trim() !== '') { 
                setKarlHealth(newHealthValue); 
                newKarlHealthInput.value = ''; 
            } else {
                alert("Please enter a valid number for Karl's health.");
            }
        });
    }

    const karlHealthDisplay = document.getElementById('karl-health-display');
    if (karlHealthDisplay) {
        karlHealthRef.on('value', (snapshot) => {
            const currentHealth = snapshot.val();
            if (currentHealth !== null) {
                karlHealthDisplay.innerText = `Karl's Health: ${currentHealth}`;
            } else {
                karlHealthDisplay.innerText = `Karl's Health: Not set yet`;
            }
        });
    }
});