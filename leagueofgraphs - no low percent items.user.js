// ==UserScript==
// @name         leagueofgraphs - no low percent items
// @namespace    https://www.leagueofgraphs.com/
// @version      1.5.1
// @description  No more items with low % use.
// @author       Coyote
// @license MIT
// @match        https://www.leagueofgraphs.com/*/champions/items/*
// @icon         https://lolg-cdn.porofessor.gg/img/s/favicon_v2.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    https://github.com/Coyote-31/User-Scripts_leagueofgraphs.com/blob/master/leagueofgraphs%20-%20no%20low%20percent%20items.user.js
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

waitForKeyElements("#topItemsTable", main, false);

function main () {
    scriptCount++;
    console.log("Script Coyote Loaded #" + scriptCount);

    // load on click button
    let seeMoreBtns = document.getElementsByClassName("see_more_button");

    for (let seeMoreBtn of seeMoreBtns) {
        seeMoreBtn.addEventListener('click', lowPercentEraser);
    }

    $.each($(".sortable_column"), function (i, obj) {
        obj.addEventListener('click', lowPercentEraser);
    })

    $.each($("#onlyMythicItemsSelectorCheckbox"), function (i, obj) {
        obj.addEventListener('change', lowPercentEraser);
    })

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
                row.hidden = false;
            }
        }
    }
}
