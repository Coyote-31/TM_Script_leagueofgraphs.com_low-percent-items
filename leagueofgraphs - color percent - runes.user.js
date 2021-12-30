// ==UserScript==
// @name         leagueofgraphs - color percent - runes
// @namespace    https://www.leagueofgraphs.com/
// @version      0.1.1
// @description  Color percentage on runes page.
// @author       Coyote
// @license MIT
// @match        https://www.leagueofgraphs.com/*/champions/runes/*
// @icon         https://lolg-cdn.porofessor.gg/img/s/favicon_v2.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    https://github.com/Coyote-31/User-Scripts_leagueofgraphs.com/blob/master/leagueofgraphs%20-%20color%20percent%20-%20runes.user.js
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
'use strict';

//// config (% and color) ////

// Popularity :
const lowPopLimit = 20.0;
const lowPopColor = "coral"; // coral

const mediumPopLimit = 50.0;
const mediumPopColor = "lightseagreen"; // lightseagreen - dodgerblue

const highPopColor = "lightgreen"; // greenyellow - lawngreen - lightgreen

// Victory :
const lowVicLimit = 48.0;
const lowVicColor = "coral"; // coral

const mediumVicLimit = 50.0;
const mediumVicColor = "lightseagreen"; // lightseagreen - dodgerblue

const highVicColor = "lightgreen"; // greenyellow - lawngreen - lightgreen

// Count script loads
let scriptCount = 0;

// Toggler
let displayLowPercent = false;

waitForKeyElements("#runesColumn", main);

function main () {

    scriptCount++;
    console.log("Script Coyote Loaded #" + scriptCount);

}

function colorPop () {}

function colorVic () {}
