/**
 * Created by Sing on 16.11.2016.
 */

//add in markupUI
// <table class="table" data-sorting="true" data-paging="true" ></table>
//myTableFooTable.setTable(sites);
//myTableFooTable.showTable();

var myTableFooTable = (function () {
    var _table = {}, _columns = [], _rows = [],
        _sitesList = [];

    var getTableColumns = function () {
        var columns = [
            { "name": "id",             "title": "ID",             "breakpoints": "xs",       "data-type": "number"},
            { "name": "motifName",      "title": "Motif Name",     "breakpoints": "xs",       "data-type": "text"  },
            { "name": "motifStrength",  "title": "Strength",       "breakpoints": "xs",       "data-type": "number"},
            { "name": "startPosition",  "title": "Start",          "breakpoints": "xs",       "data-type": "number"},
            { "name": "finishPosition", "title": "Stop",           "breakpoints": "xs sm md", "data-type": "number"},
            { "name": "motifSequence",  "title": "Motif Sequence", "breakpoints": "xs sm md", "data-type": "text"  },
            { "name": "motifStrand",    "title": "Strand",         "breakpoints": "xs sm md", "data-type": "text"  }
        ];
        return columns;
    };

    var getDataFromSite = function(site) {
        return {
            "motifName": site.motifName,
            "startPosition": site.scorePosition,
            "finishPosition": site.scorePosition + site.siteLength - 1,
            "motifStrength": site.strength,
            "motifSequence": site.motifSequence,
            "motifStrand": site.strand
        }
    };

    var getTableRows = function() {
        var rows =
            [{
                "options": {
                    "expanded": true
                },

                "value": {
                }
            }];

        for (var i = 0; i < _sitesList.length; i++) {
            if (i == 0) {
                rows[i]["value"] = getDataFromSite(_sitesList[i]);
                rows[i]["value"]["id"] = i + 1;   //start from 1 not 0
            } else {
                rows.push(getDataFromSite(_sitesList[i]));
                rows[i]["id"] = i + 1;
            }
        }
        console.log(rows);
        return rows;
    };

    var setTable = function(sites) {
        _sitesList = sites;
        _columns = getTableColumns(),
        _rows = getTableRows(),
        _table = {
            "toggleColumn": "last",
            "filtering": {
                "enabled": true,
                "dropdownTitle": "Search in:"
            },

            "columns": _columns,
            "rows": _rows
        };
    };


    var showTable = function() {
        $('.table').footable(_table);
    };

    return {
        showTable: showTable,
        setTable: setTable
    };

}());