/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _table = {}, _columns = [], _rows = [],
        _sitesList = [], _primarySequence = {};


    var getDataFromID = function(siteID) {
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


    var setColumns = function () {
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


    var setRows = function() {
        var rows = new Array(_sitesList.length);
        for (var siteID = 0; siteID < _sitesList.length; siteID++) {
            rows[siteID] = getDataFromID(siteID);
        }
        return rows;
    };


    var createTable = function() {
        _table = {
            columnDefs: [
                { targets: [4, 5], width: "5%"}
            ],
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                {
                    text: 'My button',
                    action: function ( e, dt, node, config ) {
                        alert( 'Button activated' );
                    }
                }
            ],
            columns: setColumns()
        };

        var table = $('#example').DataTable(_table);

        $('#example tbody')
            .on('click', 'td.details-control', function () {
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



        $('#example tbody')
            .on( 'mouse' + 'enter', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;

                    while (start <= finish) {
                        segment = $('#' + start);
                        segment.addClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('id')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).addClass("first");
                    $('#' + lastID).addClass("last");


                }
            });

        $('#example tbody')
            .on( 'mouse' + 'leave', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;
                    while (start <= finish) {
                        segment = $('#' + start);
                        segment.removeClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('id')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).removeClass("first");
                    $('#' + lastID).removeClass("last");
                }
            });
        return table;
    };


    var format = function (d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td>Motif sequence:</td>'+
            '<td>' + d.sequence + '</td>'+
            '</tr>'+
            '<tr>' +
            '<td>Motif strand:</td>'+
            '<td>' + d.strand + '</td>'+
            '</tr>' +
            '<tr>' +
            '<td>Sequence ID:</td>' +
            '<td>' + _primarySequence["title"] + '</td>'+
            '</tr>'+
            '</table>';
    };


    var redrawTableWithSites = function(sites, primarySequence) {
        var table = $('#example').DataTable();

        _sitesList = sites;
        _rows = setRows();
        _primarySequence = primarySequence;

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