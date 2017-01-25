/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _table = {}, _columns = [], _rows = [],
        _sitesList = [];


    var getTableColumns = function () {
        var columns = [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "id" },
            { "data": "motifName" },
            { "data": "strength" },
            { "data": "startPosition" },
            { "data": "finishPosition" },
            { "data": "sequence" }
        ];
        return columns;
    };


    var getDataFromSite = function(siteID) {
        var site =  _sitesList[siteID];
        return {
            "id": siteID + 1,
            "motifName": site.motifName,
            "strength": site.strength,
            "startPosition": site.scorePosition,
            "finishPosition": site.scorePosition + site.siteLength - 1,
            "sequence": site.motifSequence,
            "strand": site.strand
        };
    };


    var getTableRows = function() {
        var rows = new Array(_sitesList.length);
        for (var i = 0; i < _sitesList.length; i++) {
            rows[i] = getDataFromSite(i);
        }
        return rows;
    };


    var createTable = function() {
        _columns = getTableColumns();
        _table = {
            columnDefs: [
                { targets: [4, 5], width: "5%"}
            ],
            buttons: [
                'csv'
            ],
            columns: getTableColumns()
        };

        var table = $('#example').DataTable(_table);

        $('#example tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        } );

        return table;
    };


    var format = function (d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td>Motif sequence:</td>'+
            '<td>'+d.sequence+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>Motif strand:</td>'+
            '<td>'+d.strand+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>Sequence ID:</td>'+
            '<td>And any further details here (images etc)...</td>'+
            '</tr>'+
            '</table>';
    };


    var redrawTableWithSites = function(sites) {
        var table = $('#example').DataTable();
        _sitesList = sites;
        _rows = getTableRows();

        table.clear();
        table
            .rows.add(_rows)
            .draw();
    };


    return {
        redrawTableWithSites: redrawTableWithSites,
        createTable: createTable
    };

}());