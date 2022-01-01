// ==UserScript==
// @name         leagueofgraphs - color percent - runes
// @namespace    https://www.leagueofgraphs.com/
// @version      1.3.0
// @description  Color percentage on runes page.
// @author       Coyote
// @license MIT
// @match        https://www.leagueofgraphs.com/*/champions/runes/*
// @match        https://www.leagueofgraphs.com/champions/runes/*
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
const lowPopColor = "#f54c43"; // coral - orangered

const mediumPopLimit = 50.0;
const mediumPopColor = "#dfa33e"; // gold

const highPopColor = "#2AA3CC"; // lightseagreen

// Victory :
const lowVicLimit = 48.0;
const lowVicColor = "#f54c43"; // coral - orangered

const mediumVicLimit = 50.0;
const mediumVicColor = "#dfa33e"; // gold - goldenrod

const highVicColor = "#2DEB90"; // greenyellow - lawngreen - lightgreen

// Count script loads
let scriptCount = 0;

// Toggler
let displayLowPercent = false;

// Runes perks class to style
let classStyle3MainRunes = [ 
    ".perk-8439-36",    // Aftershock
    ".perk-8360-36",    // Unsealed Spellbook
    ".perk-8229-36",    // Arcane Comet
];   

let classStyle4MainRunes = [
    ".perk-8005-36",    // Press the Attack
    ".perk-8008-36",    // Lethal Tempo
    ".perk-8021-36",    // Fleet Footwork
    ".perk-8010-36",    // Conqueror

    ".perk-8112-36",    // Electrocute
    ".perk-8124-36",    // Predator
    ".perk-8128-36",    // Dark Harvest
    ".perk-9923-36"     // Hail of Blades
];

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
    let runeImgs = $("table.perksTable td img");
    colorPopup(runeImgs);

    // Rune Css style
    centerRunes();
    alignRunesTable();
    style3MainRunes();
    style4MainRunes();

    // Order
    addSortBtns();
}

function colorPop (percents) {
    $.each(percents, function(i, /** @type {HTMLElement} */ percent) {

        let number = percent.innerHTML.replace('%', '');

        if (0.0 <= number && number < lowPopLimit) {
            percent.style.color = lowPopColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", lowPopColor);

        } else if (lowPopLimit <= number && number < mediumPopLimit) {
            percent.style.color = mediumPopColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", mediumPopColor);
            
        } else if (mediumPopLimit <= number && number < 100.0) {
            percent.style.color = highPopColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", highPopColor);
        }
    });
}

function colorVic (percents) {
    
    $.each(percents, function(i, /** @type {HTMLElement} */ percent) {

        let number = percent.innerHTML.replace('%', '');

        if (0.0 <= number && number < lowVicLimit) {
            percent.style.color = lowVicColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", lowVicColor);

        } else if (lowVicLimit <= number && number < mediumVicLimit) {
            percent.style.color = mediumVicColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", mediumVicColor);
            
        } else if (mediumVicLimit <= number && number < 100.0) {
            percent.style.color = highVicColor;
            $(percent).first().parent().find(".full-progress-bar").css("background-color", highVicColor);
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
                runeImg.style.outline = "2px solid " + lowVicColor;
                runeImg.style.borderRadius = "3rem";
    
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
                runeImg.style.outline = "2px solid " + mediumVicColor;
                runeImg.style.borderRadius = "3rem";
                
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
                runeImg.style.outline = "2px solid " + highVicColor;
                runeImg.style.borderRadius = "3rem";
            }
        }

    });
}

function centerRunes() {

    $("tbody > tr > td[colspan]").removeAttr("colspan").removeClass("text-center")
        .parent("tr")
            .css("display", "flex")
            .css("flex-wrap", "nowrap")
            .css("justify-content", "center");
    $("table.data_table.perksTable td")
        .css("padding-left", "0.3rem")
        .css("padding-right", "0.3rem");
}

function alignRunesTable() {

    $(".data_table.perksTable").parents("td").css("width", "60%");
}

function style3MainRunes() {

    $.each(classStyle3MainRunes, function(i, /** @type {String} */ classStyle3MainRune) {
        $(classStyle3MainRune)
            .css("padding-left", "0.3rem")
            .css("padding-right", "0.3rem");
    });
}

function style4MainRunes() {

    $.each(classStyle4MainRunes, function(i, /** @type {String} */ classStyle4MainRune) {
        $(classStyle4MainRune)
            .css("padding-left", "0.15rem")
            .css("padding-right", "0.15rem");
    });
}

function addSortBtns() {

    // Delete ads
    $(".ads").remove();

    // Add btns //

    let tables = $(".perksTableContainerTable");

    tables.each(function() {

        let th = $(this).find("tr th");
        let margin = "margin";
        let marginValue=  "0px";
        let padding = "padding";
        let paddingValue = "0px";
        let background = "background";
        let backgroundValue= "none";

        $(th.get(1)).wrapInner("<button></button>").children("button").first()
            .on("click", sortPerksByPopularity)
                .css(margin, marginValue)
                .css(padding, paddingValue)
                .css(background, backgroundValue);

        $(th.get(2)).wrapInner("<button></button>").children("button").first()
            .on("click", sortPerksByVictory)
                .css(margin, marginValue)
                .css(padding, paddingValue)
                .css(background, backgroundValue);
    });
}

function sortPerksByPopularity() {

    // Sort perks
    let perksArray = $(".perksTableContainer").toArray().sort(function(a,b) {
        let aPercent = $(a).find("td.globalPopularityCell .progressBarTxt").html().replace('%', '');
        let bPercent = $(b).find("td.globalPopularityCell .progressBarTxt").html().replace('%', '');
        return bPercent - aPercent;
    })
    $(perksArray).appendTo($(".perksTableContainer").parent());
}

function sortPerksByVictory() {

    // Sort perks
    let perksArray = $(".perksTableContainer").toArray().sort(function(a,b) {
        let aPercent = $(a).find("td.globalWinrateCell .progressBarTxt").html().replace('%', '');
        let bPercent = $(b).find("td.globalWinrateCell .progressBarTxt").html().replace('%', '');
        return bPercent - aPercent;
    })
    $(perksArray).appendTo($(".perksTableContainer").parent());
}
