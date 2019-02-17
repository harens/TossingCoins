// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.ts":[function(require,module,exports) {
"use strict"; // This file is part of TossingCoins.
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

function enterInput(event) {
  if (event.key == 'Enter') {
    // Checks if enter key is pressed to display coin amounts
    replyToss();
  }
} // Once the window has loaded, records keys pressed


window.onload = function () {
  return document.addEventListener('keydown', enterInput);
};

var headsData = {}; // Stores the total amount of head
// Displays the current amount of heads and tails
// Function is run when button is clicked

function replyToss() {
  var htmlOutput; // Final outputted result
  // Inputted Value
  // Converted to int (results in NaN if not possible)

  var coinAmount = Number(document.getElementById("coinToss").value);
  var headsAmount = Math.floor(Math.random() * coinAmount); // Random number between 0 and coinAmount

  var tailsAmount = coinAmount - headsAmount;

  if (coinAmount <= 0 || isNaN(coinAmount)) {
    // Input has to be a number that is greater than 0
    htmlOutput = "INVALID OPTION";
  } else {
    // If key does not exist, NaN is returned, which is falsey, and so it is then created with a value of 1
    // If it does exist, it increases by 1
    headsData[headsAmount] = headsData[headsAmount] + 1 || 1; // String values created of relevant amounts
    // This is so that the greatest amount can be shown

    var headsOutput = String(headsAmount);
    var tailsOutput = String(tailsAmount); // Value which is greatest gets a tick

    if (headsAmount > tailsAmount) {
      headsOutput += " ✅";
      runCounter('heads'); // Determines how many heads there are in a row
    } else if (headsAmount < tailsAmount) {
      tailsOutput += " ✅";
      runCounter('tails');
    } else {
      // If both have the same value
      headsOutput += " 💰";
      tailsOutput += " 💰";
      runCounter('neither');
    }

    htmlOutput = "Heads Amount: " + headsOutput + "<br>" + "Tails Amount: " + tailsOutput;
    drawTable(['Number of Heads', 'Frequency'], headsData, 'headsTable'); // Table drawn with data on the amount of heads
  } // Receives current value and changes it to `htmlOutput`


  document.getElementById("tossOutput").innerHTML = htmlOutput;
} // drawTable Parameters:
// tableHeaders: Two strings in a list denoting the headers
// Data: Dictionary/List containing relevant information
// elementID: Where to be placed in the index.html
// side: Denotes the side of the coin for runs


function drawTable(tableHeaders, data, elementID) {
  // Headers created
  var finalOutput = "<table><tr><th>" + tableHeaders[0] + "</th><th>" + tableHeaders[1] + "</th></tr>";
  var list_counter = 0; // Iterates through highestRuns

  for (var item in data) {
    // Creates row for each item in headData
    if (Array.isArray(data)) {
      // If it's a list, and therefore coin runs
      var coin_side = ['Heads', 'Tails'];
      finalOutput += "<tr><td>" + coin_side[list_counter] + "</td><td>" + highestRuns[list_counter] + "</td></tr>";
    } else {
      // If it's a dictionary, and therefore Heads amount
      finalOutput += "<tr><td>" + String(item) + "</td><td>" + String(data[item]) + "</td></tr>";
    }

    list_counter++;
  }

  document.getElementById(elementID).innerHTML = finalOutput + "</table>";
} // Current run of heads and tails


var runData = {
  heads: 0,
  tails: 0
}; // Last side of the coin that was greatest

var currentSide = 'neither'; // Stores the highest repetitions of heads and tails

var highestRuns = [0, 0]; // Determines the highest run as well as the current run

function runCounter(currentToss) {
  if (currentToss === 'neither') {
    // It it's a tie
    runData.heads = 0;
    runData.tails = 0;
  } // Only the currentToss' counter can be increased
  // It can be increased if it was the previous side or if it's the new run
  else if (currentToss === currentSide || runData[currentToss] === 0) {
      if (currentToss === 'heads') {
        runData.heads += 1;
        runData.tails = 0;
      } else if (currentToss === 'tails') {
        runData.heads = 0;
        runData.tails += 1;
      } // Checks if current runs are greater than the highest runs


      if (runData.heads > highestRuns[0]) {
        highestRuns[0] = runData.heads;
      } else if (runData.tails > highestRuns[1]) {
        highestRuns[1] = runData.tails;
      } // Displays table showing highest runs


      drawTable(['Coin Side', 'Highest Run'], highestRuns, 'coinRuns');
    } // Changes current side


  currentSide = currentToss;
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62077" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.map