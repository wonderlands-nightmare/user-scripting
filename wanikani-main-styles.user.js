// ==UserScript==
// @name         WaniKani Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.2
// @description  try to take over the world!
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    
    style.className = 'custom-style';

    let reviewColour = '#00aaff';
    let lessonColour = '#ff00aa';
    let reviewColourDarker = '#0279b5';
    let lessonColourDarker = '#bd007e';
    let reviewColourLighter = '#80d4ff';
    let lessonColourLighter = '#fa7acf';
    let white = '#ffffff';
    let grey = '#f4f4f4';
    
    style.innerHTML = `
    .lessons-and-reviews .lessons-and-reviews__reviews-button .has-reviews { 
        animation: reviewPulse 2s infinite; 
    } 

    .lessons-and-reviews .lessons-and-reviews__lessons-button .has-lessons { 
        animation: lessonPulse 2s infinite; 
    } 

    .custom-critical-items { 
        padding: 12px 24px; 
        margin-bottom: 30px; 
        background: ${grey}; 
    } 

    .custom-critical-items section { 
        margin-bottom: 0; 
    } 

    .custom-critical-items section .progress-entries { 
        grid-template-columns: none; 
        display: flex; 
    } 

    .custom-critical-items section .progress-entry { 
        height: 40px; 
    } 

    .custom-critical-items section .progress-entry.radical, 
    .custom-critical-items section .progress-entry.kanji { 
        width: 40px; 
    } 

    .custom-critical-items .vocabulary-icon { 
        font-size: 21px; 
        height: 40px; 
    } 

    @keyframes reviewPulse { 
        0% { 
            box-shadow: 0 0 0 0  ${reviewColourDarker}; 
        } 
        70% { 
            box-shadow: 0 0 0 7px ${white}; 
        } 
        100% { 
            box-shadow: 0 0 0 0  ${reviewColourLighter}; 
        } 
    } 

    @keyframes lessonPulse { 
        0% { 
            box-shadow: 0 0 0 0  ${lessonColourDarker}; 
        } 
        70% { 
            box-shadow: 0 0 0 7px  ${white}; 
        } 
        100% { 
            box-shadow: 0 0 0 0  ${lessonColourLighter}; 
        } 
    }
    `;


    document.head.appendChild(style);
});