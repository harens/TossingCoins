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

import Chartist = require("chartist");

// Credit to konklone/ssl-redirect.html
const host = "harens.me";
if (host == window.location.host && window.location.protocol != "https:")
  window.location.protocol = "https"; // Forces a redirect to HTTPS

function enterInput(event: KeyboardEvent): void {
  if (event.key == "Enter") {
    // Checks if enter key is pressed to display coin amounts
    replyToss();
  }
}

// Once the window has loaded, records keys pressed
window.onload = () => document.addEventListener('keydown', enterInput);

let headsData: {[headsAmount: number]: number} = {}; // Stores the total amount of head

// Displays the current amount of heads and tails
// Function is run when button is clicked
function replyToss(): void {
  let coinOutput: string; // Final heads/tails result
  let totalAmount: number; // Final total tosses

  let currentAmount = (document.getElementById(
    "totalTosses"
  ) as HTMLInputElement).innerHTML; // Current displayed value for total tosses

  if (currentAmount === "") { // IF there is no displayed value
    totalAmount = 0
  } else {
    let amountList = currentAmount.split(" ")
    totalAmount = Number(amountList[amountList.length - 1]) // Last item of lisr
  }

  // Inputted Value
  // Converted to int (results in NaN if not possible)
  const coinAmount = Number((document.getElementById("coinToss") as HTMLInputElement).value);

  const headsAmount = Math.round(Math.random() * coinAmount); // Random number between 0 and coinAmount
  const tailsAmount = coinAmount - headsAmount;

  if (coinAmount <= 0 || isNaN(coinAmount)) { // Input has to be a number that is greater than 0
    coinOutput = "INVALID OPTION";
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
      runCounter('heads'); // Determines how many heads there are in a row
    } else if (headsAmount < tailsAmount) {
      tailsOutput += " ✅";
      runCounter('tails');
    } else { // If both have the same value
      headsOutput += " 💰";
      tailsOutput += " 💰";
      runCounter('neither');
    }

    coinOutput = "Heads Amount: " + headsOutput + "<br>" + "Tails Amount: " + tailsOutput;
    let amountOutput = "Total Tosses: " + String(totalAmount += coinAmount);

    lineGraph();
    drawTable(['Number of Heads', 'Frequency'], headsData, 'headsTable'); // Table drawn with data on the amount of heads

    (document.getElementById(
      "totalTosses"
    ) as HTMLInputElement).innerHTML = amountOutput;
  }
  // Receives current value and changes it to `coinOutput`
  (document.getElementById(
    "tossOutput"
  ) as HTMLInputElement).innerHTML = coinOutput;
}

// drawTable Parameters:
// tableHeaders: Two strings in a list denoting the headers
// Data: Dictionary/List containing relevant information
// elementID: Where to be placed in the index.html
// side: Denotes the side of the coin for runs
function drawTable(tableHeaders: string[], data: {[headsAmount: number]: number} | number[], elementID: string): void {
  // Headers created
  let finalOutput = "<table><tr><th>" + tableHeaders[0] + "</th><th>" + tableHeaders[1] + "</th></tr>";
  let list_counter = 0; // Iterates through highestRuns
  for (const item in data) { // Creates row for each item in headData
    if (Array.isArray(data)) { // If it's a list, and therefore coin runs
      const coin_side = ['Heads', 'Tails'];
      finalOutput += "<tr><td>" + coin_side[list_counter] + "</td><td>" + highestRuns[list_counter] + "</td></tr>";
    } else { // If it's a dictionary, and therefore Heads amount
      finalOutput += "<tr><td>" + String(item) + "</td><td>" + String(data[item]) + "</td></tr>";
    }
    list_counter++;
  }
  (document.getElementById(elementID) as HTMLInputElement).innerHTML = finalOutput + "</table>";
}

// Current run of heads and tails
let runData: {[value: string]: number} = {
  heads: 0,
  tails: 0,
};

// Last side of the coin that was greatest
let currentSide = 'neither';

// Stores the highest repetitions of heads and tails
let highestRuns: number[] = [0, 0];

// Determines the highest run as well as the current run
function runCounter(currentToss: string): void {
  if (currentToss === 'neither') { // It it's a tie
    runData.heads = 0;
    runData.tails = 0;
  }
  // Only the currentToss' counter can be increased
  // It can be increased if it was the previous side or if it's the new run
  else if (currentToss === currentSide || runData[currentToss] === 0) {
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
    drawTable(['Coin Side', 'Highest Run'], highestRuns, 'coinRuns');
    barGraph(); // Draws a graph with the data
  }
  // Changes current side
  currentSide = currentToss;
}

let screenWidth: number;

if (window.screen.width >= 600) {
  screenWidth = window.screen.width - 100;
} else{
  screenWidth = window.screen.width - 5;
}

// Draws graph for the number of heads
function lineGraph(): void {

  // Labels axes
  (document.getElementById("xLine") as HTMLInputElement).innerHTML = "Number of Heads";
  (document.getElementById("yLine") as HTMLInputElement).innerHTML = "Frequency";

  let labelItems: string[] = [];
  let seriesHeads: number[] = [];

  // Adds data from dictionaries to lists
  for (let item in headsData){
    labelItems.push(item);
    seriesHeads.push(headsData[item] + 1)
  }
  new Chartist.Line('.ct-line', {
    labels: labelItems,
    series: [seriesHeads]
  }, {
    axisY: {
      onlyInteger: true
    }, // Taking away width gives room for the footer
    width: screenWidth,
    height: 200
  });
}


// Draws graph with run data
function barGraph(): void {

  // Sets the y axes
  (document.getElementById("xChart") as HTMLInputElement).innerHTML = "Highest run";

  new Chartist.Bar('.ct-chart', {
    labels: ['Heads', 'Tails'],
    series: [
      [highestRuns[0], highestRuns[1]]
    ]
  }, {
    axisX: {
      onlyInteger: true
    }, // Taking away width gives room for the footer
    width: screenWidth,
    height: 200,
    reverseData: true,
    horizontalBars: true
  }
  )
}
