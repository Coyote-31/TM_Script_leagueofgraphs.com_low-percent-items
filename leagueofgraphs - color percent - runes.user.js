// ==UserScript==
// @name         leagueofgraphs - color percent - runes
// @namespace    https://www.leagueofgraphs.com/
// @version      1.1.0
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
const lowPopLimit = 10.0;
const lowPopColor = "coral"; // coral

const mediumPopLimit = 50.0;
const mediumPopColor = "gold"; // gold

const highPopColor = "#2AA3CC"; // lightseagreen

// Victory :
const lowVicLimit = 48.0;
const lowVicColor = "coral"; // coral

const mediumVicLimit = 50.0;
const mediumVicColor = "gold"; // gold

const highVicColor = "#2DEB90"; // greenyellow - lawngreen - lightgreen

// Count script loads
let scriptCount = 0;

// Toggler
let displayLowPercent = false;

waitForKeyElements("#runesColumn", main);

function main () {

    scriptCount++;
    console.log("Script Coyote Loaded #" + scriptCount);

    // Globals
    let percentsPopGlobal = $("td.globalPopularityCell .progressBarTxt");
    let percentsVicGlobal = $("td.globalWinrateCell .progressBarTxt");

    colorPop(percentsPopGlobal);
    colorVic(percentsVicGlobal);

    // Runes tooltips in img
    let runeImgs = $("table.perksTable td > img");
    colorPopup(runeImgs);

}

function colorPop (percents) {
    $.each(percents, function(i, percent) {

        let number = percent.innerHTML.replace('%', '');

        if (0.0 <= number && number < lowPopLimit) {
            percent.style.color = lowPopColor;

        } else if (lowPopLimit <= number && number < mediumPopLimit) {
            percent.style.color = mediumPopColor;
            
        } else if (mediumPopLimit <= number && number < 100.0) {
            percent.style.color = highPopColor;
        }
    });
}

function colorVic (percents) {
    
    $.each(percents, function(i, percent) {

        let number = percent.innerHTML.replace('%', '');

        if (0.0 <= number && number < lowVicLimit) {
            percent.style.color = lowVicColor;

        } else if (lowVicLimit <= number && number < mediumVicLimit) {
            percent.style.color = mediumVicColor;
            
        } else if (mediumVicLimit <= number && number < 100.0) {
            percent.style.color = highVicColor;
        }
    });
}

function colorPopup (runeImgs) {

    const regex = /<highlight>\d{1,3}\.\d%<\/highlight>/g;

    $.each(runeImgs, function(i, /** @type {HTMLElement} */ runeImg) {

        let tooltip = runeImg.getAttribute("tooltip");

        let numbers = tooltip.match(regex);
        
        if (numbers != null) {
    
            // Popularity
            let popNumPercent = numbers[0].replace("<highlight>", "").replace("</highlight>", "");
            let popNum = popNumPercent.replace("%", '');

            if (0.0 <= popNum && popNum < lowPopLimit) {
                runeImg.setAttribute("tooltip", tooltip.replace(popNumPercent, "<span style=\"color:" + lowPopColor + " !important;\">" + popNumPercent + "</span>"));
    
            } else if (lowPopLimit <= popNum && popNum < mediumPopLimit) {
                runeImg.setAttribute("tooltip", tooltip.replace(popNumPercent, "<span style=\"color:" + mediumPopColor + " !important;\">" + popNumPercent + "</span>"));
                
            } else if (mediumPopLimit <= popNum && popNum < 100.0) {
                runeImg.setAttribute("tooltip", tooltip.replace(popNumPercent, "<span style=\"color:" + highPopColor + " !important;\">" + popNumPercent + "</span>"));
            }
    
            // refresh tooltip :
            tooltip = runeImg.getAttribute("tooltip");

            // Victory
            let vicNumPercent = numbers[1].replace("<highlight>", "").replace("</highlight>", "");
            let vicNum = vicNumPercent.replace("%", '');

            let vicNumPercentReplaced = "";
            let isIdenticalNum = numbers[0] === numbers[1];
            let tooltipParts;

            if (0.0 <= vicNum && vicNum < lowVicLimit) {

                vicNumPercentReplaced = "<span style=\"color:" + lowVicColor + " !important;\">" + vicNumPercent + "</span>";

                if (isIdenticalNum) {
                    tooltipParts = tooltip.split(vicNumPercent);
                    tooltipParts[0] = tooltipParts[0] + vicNumPercent;
                    tooltipParts[1] = tooltipParts[1] + vicNumPercentReplaced;
                    tooltip = tooltipParts.join("");
                    runeImg.setAttribute("tooltip", tooltip);   
                } else {
                    runeImg.setAttribute("tooltip", tooltip.replace(vicNumPercent, vicNumPercentReplaced));
                }
                runeImg.style.outline = "1px solid " + lowVicColor;
                runeImg.style.borderRadius = "1rem";
    
            } else if (lowVicLimit <= vicNum && vicNum < mediumVicLimit) {

                vicNumPercentReplaced = "<span style=\"color:" + mediumVicColor + " !important;\">" + vicNumPercent + "</span>";

                if (isIdenticalNum) {
                    tooltipParts = tooltip.split(vicNumPercent);
                    tooltipParts[0] = tooltipParts[0] + vicNumPercent;
                    tooltipParts[1] = tooltipParts[1] + vicNumPercentReplaced;
                    tooltip = tooltipParts.join("");
                    runeImg.setAttribute("tooltip", tooltip);
                } else {
                    runeImg.setAttribute("tooltip", tooltip.replace(vicNumPercent, vicNumPercentReplaced));
                }
                runeImg.style.outline = "1px solid " + mediumVicColor;
                runeImg.style.borderRadius = "1rem";
                
            } else if (mediumVicLimit <= vicNum && vicNum < 100.0) {

                vicNumPercentReplaced = "<span style=\"color:" + highVicColor + " !important;\">" + vicNumPercent + "</span>";

                if (isIdenticalNum) {
                    tooltipParts = tooltip.split(vicNumPercent);
                    tooltipParts[0] = tooltipParts[0] + vicNumPercent;
                    tooltipParts[1] = tooltipParts[1] + vicNumPercentReplaced;
                    tooltip = tooltipParts.join("");
                    runeImg.setAttribute("tooltip", tooltip);
                } else {
                    runeImg.setAttribute("tooltip", tooltip.replace(vicNumPercent, vicNumPercentReplaced));
                }
                runeImg.style.outline = "1px solid " + highVicColor;
                runeImg.style.borderRadius = "1rem";
            }
        }

    });
}
