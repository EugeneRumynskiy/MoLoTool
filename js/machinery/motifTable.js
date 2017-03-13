/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _table = {}, _columns = [], _rows = [],
        _sitesList = [], _primarySequence = {};

    var create = function() {
        var table = $('#motif-table').DataTable(getTable());
        buildUIComponent(table);

        //temporary

        new $.fn.dataTable.Buttons( table, {
            name: 'commands',
            buttons: [{
                text: '<i class="fa fa-lg fa-clipboard"></i>',
                extend: 'copy',
                className: 'export-copy_',
                name: "myB"
            }]
        } );
        table.buttons(1, null).container().appendTo( "#dtTest" );
        console.log(table);
        console.log(table.buttons().container());
        //

        return table;
    };

    var getTable = function () {
        return {
            columnDefs: [
                { targets: [4, 5], width: "5%"}
            ],
            dom: 'Bfrtip',
            buttons: getButtons(),
            columns: getColumns()
        };
    };


    var getColumns = function () {
        return [
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
    };


    var getButtons = function () {
        return [
            { extend: 'colvis', text: 'Select Columns', columns: ':gt(0)'},
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
        ]
    };


    var buildUIComponent = function (table) {
        $('#motif-table').find('tbody')
            .on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr'),
                    row = table.row( tr );

                if ( row.child.isShown() ) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    row.child(format(row.data())).show();
                    console.log(row.data());
                    tr.addClass('shown');
                }
            });
    };


    var format = function (data) {
        // `data` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td>Motif sequence:</td>'+
            '<td>' + data.sequence + '</td>'+
            '</tr>'+
            '<tr>' +
            '<td>Motif strand:</td>'+
            '<td>' + data.strand + '</td>'+
            '</tr>' +
            '<tr>' +
            '<td>Additional information:</td>' +
            '<td>' + _primarySequence["title"] + '</td>'+
            '</tr>'+
            '</table>';
    };


    var redrawTableWithSites = function(sites, primarySequence, userRequestedMotifs) {
        var table = $('#motif-table').DataTable();

        _sitesList = sites;
        _rows = getRows(userRequestedMotifs);
        _primarySequence = primarySequence;

        //console.log(userRequestedMotifs);
        table.clear();
        table
            .rows.add(_rows)
            .draw();
    };


    var getRows = function(userRequestedMotifs) {
        var rows = new Array(_sitesList.length); //that IS optimal
        for (var siteID = 0; siteID < _sitesList.length; siteID++) {
            rows[siteID] = getDataFromID(siteID);
        }
        return rows;
    };


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


    return {
        redrawTableWithSites: redrawTableWithSites,
        create: create
    };

}());