// This file is part of TossingCoins.

// TossingCoins is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// /TossingCoins is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with /TossingCoins.  If not, see <http://www.gnu.org/licenses/>.

function enterInput(event: KeyboardEvent): void {
  if (event.key == 'Enter') { // Checks if enter key is pressed to display coin amounts
    replyToss();
  }
}

// Once the window has loaded, records keys pressed
window.onload = () => document.addEventListener('keydown', enterInput);

let headsData: { [numberHeads: number]: number } = {}; // Stores the total amount of head

let runData = {
  heads: 0,
  tails: 0,
  currentSide: 'neither'
};

let highestRuns: number[] = [0, 0];

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
      runCounter('heads');

    } else if (headsAmount < tailsAmount) {
      tailsOutput += " ✅";
      runCounter('tails');
    } else { // If both have the same value
      headsOutput += " 💰";
      tailsOutput += " 💰";
      runCounter('neither');
    }

    htmlOutput = "Heads Amount: " + headsOutput + "<br>" + "Tails Amount: " + tailsOutput;
    countTable(); // Table drawn with data on the amount of heads
  }
  // Receives current value and changes it to `htmlOutput`
  (document.getElementById("tossOutput") as HTMLInputElement).innerHTML = htmlOutput;
}

// Creates table showing the number of heads and their frequencies
function countTable(): void {
  // Headers created
  let finalOutput = "<table><tr><th>Number of Heads</th><th>Frequency</th></tr>";
// tslint:disable-next-line: forin
  for (const item in headsData) { // Creates row for each item in headData
    finalOutput += "<tr><td>" + String(item) + "</td><td>" + String(headsData[item]) + "</td></tr>";
  }
  // Generates new table each time
  (document.getElementById("headsTable") as HTMLInputElement).innerHTML = finalOutput + "</table>";
}

// Determines the highest run as well as the current run
function runCounter(currentToss: string): void {
  if (currentToss === 'neither') { // It it's a tie
    runData.heads = 0;
    runData.tails = 0;
  }
  // Only the currentToss' counter can be increased
  // It can be increased if it was the previous side or there is no current side
  else if (currentToss === runData.currentSide || runData[currentToss] === 0) {
    if (currentToss === 'heads') {
      runData.heads += 1;
      runData.tails = 0;
    } else if (currentToss === 'tails') {
      runData.heads = 0;
      runData.tails += 1;
    }

    // Checks if current runs are greater than the highest runs
    if (runData.heads > highestRuns[0]) {
      highestRuns[0] = runData.heads;
    } else if (runData.tails > highestRuns[1]) {
      highestRuns[1] = runData.tails;
    }
    // Displays table showing highest runs
    runTable();

  }

  // Changes current side
  runData.currentSide = currentToss;
}

// Creates table showing runs
function runTable(): void {
  // Creates headers
  let finalOutput = '<table><tr><th>Coin Side</th><th>Highest Run</th></tr>';

  finalOutput += '<tr><td>Heads</td><td>' + String(highestRuns[0]) + '</td></tr>';
  finalOutput += '<tr><td>Tails</td><td>' + String(highestRuns[1]) + '</td></tr>';

  // Outputs table in the div `coinRuns`
  (document.getElementById('coinRuns') as HTMLInputElement).innerHTML = finalOutput + '</table>';
}
