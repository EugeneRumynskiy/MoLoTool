/**
 * Main UI module
 */
/**
 * markupUI             (to be refactored)      base file
 *
 * motifMath            (empty)                 algorithms to calculate some general stuff like "round" function
 * inputParsing         (good)                  extraction of data from input window
 * pSlider              (good)                  changing of p-value with range slider
 *
 * motifSegmentation    (good)
 * motif                (good)
 *
 * motifTable           (good)                  displaying of information produced in tables
 *
 * markupModule         (to be done)
 * sequenceConstructor               (to be refactored)      displaying of information produced in html text
 *
 * motifPicker
 * motifLibrary
 * motifHandler                                 motif discovery pipeline -
 * inputParsing
 * colorPicker
 *
 * moduleExample
 *
 *
 * errorHandler         (to be done )
 */

//Global data to save ajax request
//http://epifactors.autosome.ru/protein_complexes - как сделать поиск
// http://paletton.com/#uid=52Q0p1ki6rV87JXdgxQmgnFqvj3ki6rV87JXdgxQmgnFqvj3kdLmDeBKZcjw8bCe2ce5+
$(function() {
    uiBuilder.buildUI();
    motifHandler.handleMotifs();
    window.addEventListener("resize", comparisonMode.turnOffLocks);
    //$('#motif-list').delay(8000).children().first().children().trigger("click");

   // $("#BCL6B_HUMAN.H10MO.D").click();
});