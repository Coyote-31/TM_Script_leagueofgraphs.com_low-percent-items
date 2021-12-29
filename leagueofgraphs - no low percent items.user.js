// ==UserScript==
// @name         leagueofgraphs - no low percent items
// @namespace    https://www.leagueofgraphs.com/
// @version      1.2
// @description  No more items with low % use.
// @author       Coyote
// @match        https://www.leagueofgraphs.com/*/champions/items/*
// @icon         https://lolg-cdn.porofessor.gg/img/s/favicon_v2.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
'use strict';

// Minimum percent item required to be display
const minPercent = 0.5;

// Count script loads
let scriptCount = 0;

// Toggler
let displayLowPercent = false;

waitForKeyElements(".data_table", gmMain);

function gmMain () {

    scriptCount++;
    console.log("Script Coyote Loaded #" + scriptCount);

    // load on click button
    let seeMoreBtns = document.getElementsByClassName("see_more_button");

    for (let seeMoreBtn of seeMoreBtns) {
        seeMoreBtn.addEventListener('click', lowPercentEraser);
    }

    // Create toggle btn to diplay/hide low % items
    let divContainer = $(".overflow-container").first();

    if (!$("#low-percent-btn").length) {
        divContainer.append('<div id="low-percent-btn" class="filter filterHeader">'
                            + '<a>'
                            + '<div class="noselect filterHeader">'
                            + '<label class="switch" style="display: inline-block; margin: 0rem; margin-right: 0.5rem; padding: 0rem; -ms-transform: translateY(0.15rem); transform: translateY(0.15rem);">'
                            + '<input id="checkbox-low-percent" type="checkbox" style="margin-bottom: 0rem">'
                            + '<span class="slider round"></span>'
                            + '</label>'
                            + '< 0.5%'
                            + '</div>'
                            + '</div>');
    }

    lowPercentEraser();
}


function lowPercentEraser(){

    if (!displayLowPercent) {
        console.log('Erased !');

        let dataTables = document.getElementsByClassName("data_table");

        for (let dataTable of dataTables) {
            let rows = dataTable.getElementsByTagName('tr');
            rowsCleaner(rows);
        }
    }
}

function rowsCleaner(rows) {
    for (let row of rows) {
        let progressBarTxts = row.getElementsByClassName("progressBarTxt");

        if (progressBarTxts.length > 0) {
            let percent = progressBarTxts[0].innerHTML.replace('%', '');

            if (percent < minPercent) {
                row.hidden = true;
            }
        }
    }
}

$(function(){
    $("#checkbox-low-percent").change(function(){
        console.log("test checkbox :");
        if (this.checked) {
            console.log(this.checked);
            displayLowPercent = true;
            lowPercentDisplay();
        }
        else {
            console.log(this.checked);
            displayLowPercent = false;
            lowPercentEraser();
        }
    });
});

function lowPercentDisplay() {

    console.log('Displayed !');

    let dataTables = document.getElementsByClassName("data_table");

    for (let dataTable of dataTables) {
        let rows = dataTable.getElementsByTagName('tr');
        rowsDisplay(rows);
    }
}

function rowsDisplay(rows) {
    for (let row of rows) {
        let progressBarTxts = row.getElementsByClassName("progressBarTxt");

        if (progressBarTxts.length > 0) {
            let percent = progressBarTxts[0].innerHTML.replace('%', '');

            if (percent < minPercent) {
                progressBarTxts[0].innerHTML = progressBarTxts[0].innerHTML;
                row.hidden = false;
            }
        }
    }
}
