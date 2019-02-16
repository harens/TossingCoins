function enterInput(event: KeyboardEvent): void {
  if (event.key == 'Enter') { // Checks if enter key is pressed to display coin amounts
    replyToss();
  }
}

// Once the window has loaded, records keys pressed
window.onload = () => document.addEventListener('keydown', enterInput);

let headsData: { [numberHeads: number]: number } = {}; // Stores the total amount of heads

// Displays the current amount of heads and tails
// Function is run when button is clicked
function replyToss(): void {
  let htmlOutput: string; // Final outputted result

  const coinInput = (document.getElementById("coinToss") as HTMLInputElement).value; // Inputted Value
  const coinAmount = Number(coinInput); // Converted to int (results in NaN if not possible)

  const headsAmount = Math.floor(Math.random() * coinAmount); // Random number between 0 and coinAmount
  const tailsAmount = coinAmount - headsAmount;

  if (coinAmount <= 0 || isNaN(coinAmount)) { // Input has to be a number that is greater than 0
    htmlOutput = "INVALID OPTION";
  } else {
    // If key does not exist, NaN is returned, which is falsey, and so it is then created with a value of 1
    // If it does exist, it increases by 1
    headsData[headsAmount] = (headsData[headsAmount] + 1) || 1;
    // String values created of relevant amounts
    // This is so that the greatest amount can be shown
    let headsOutput = String(headsAmount);
    let tailsOutput = String(tailsAmount);

    // Value which is greatest gets a tick
    if (headsAmount > tailsAmount) {
      headsOutput += " ✅";
    } else if (headsAmount < tailsAmount) {
      tailsOutput += " ✅";
    } else { // If both have the same value
      headsOutput += " 💰";
      tailsOutput += " 💰";
    }

    htmlOutput = "Heads Amount: " + headsOutput + "<br>" + "Tails Amount: " + tailsOutput;
    drawTable(); // Table drawn with data on the amount of heads
  }
  // Receives current value and changes it to `htmlOutput`
  (document.getElementById("tossOutput") as HTMLInputElement).innerHTML = htmlOutput;
}

function drawTable(): void {
  // Headers created
  let finalOutput = "<table><tr><th>Number of Heads</th><th>Frequency</th></tr>";
// tslint:disable-next-line: forin
  for (const item in headsData) { // Creates row for each item in headData
    finalOutput += "<tr><td>" + String(item) + "</td><td>" + String(headsData[item]) + "</td></tr>";
  }
  // Generates new table each time
  (document.getElementById("headsTable") as HTMLInputElement).innerHTML = finalOutput + "</table>";
}
