/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _moduleName = "motifTable",
        _dtTable = undefined,
        _tableID = "#motif-table";

    var create = function(motifFeatureTitles, motifFeaturesRequest) {
        features.create(motifFeatureTitles, motifFeaturesRequest);

        _dtTable = $(_tableID).DataTable(createTable());
        buildUIComponent();

        return _dtTable;
    };


    var createTable = function () {
        var tableObject = function () {
            return {
                "lengthMenu": [[10, 15, 50, -1], [10, 15, 50, "All"]],
                "pageLength": 15,
                columnDefs: [
                    {targets: [2, 3, 4], width: "7%"}
                ],
                dom: 'Bftlip<"clear">',
                columns: createColumns(),
                buttons: createButtons()
            };
        };

        var createColumns = function () {
            var unitDetails = [{
                    "title": 'Info',
                    "width": '1%',
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                }],

                featuresWidth = {
                    "Motif ID": "8%",
                    "Seq name": "8%",

                    "-log10(P-value)": "3%",
                    "P-value": "3%",
                    "Start": "2%",
                    "End": "2%",
                    "Sequence": "8%",

                    "Strand": "2%",
                    "Logo":"4%",
                    "Uniprot ID":"6%",
                    "Family":"6%",
                    "Subfamily":"6%",
                    "Gene name":"3%"
                },

                featuresToShow = $.map(features.getFeatures(false), function (feature) {
                    return {"data": feature, "title": feature, "width": featuresWidth[feature]};
                }),

                featuresToHide = $.map(features.getFeatures(true), function (feature) {
                    return {"data": feature, "title": feature, "visible": false, "width": featuresWidth[feature]};

                }),

                columns = [].concat(unitDetails, featuresToShow, featuresToHide);

            return columns;
        };


        var createButtons = function () {
            return [
                { extend: 'colvis',
                    text: 'Select columns',
                    columns: ':gt(0)'
                },

                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'LEGAL',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                },

                {
                    text: 'TSV',
                    extend: 'csvHtml5',
                    fieldSeparator: '\t',
                    extension: '.tsv',
                    exportOptions: {
                        columns: 'th:not(:first-child)'
                    }
                }
            ]
        };

        return tableObject();
    };


    var buildUIComponent = function () {
        $('#motif-table').find('tbody')
            .on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr'),
                    row =_dtTable.row( tr );

                if ( row.child.isShown() ) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });
    };


    var getHiddenColumnsTitles = function () {
        return _dtTable
            .columns( function (idx ) {
                return _dtTable.column(idx).visible() == false;
            })
            .dataSrc()
            .toArray();
    };


    var format = function (data) {
        var titles = getHiddenColumnsTitles(),
            htmlBox = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';

        for (var i = 0; i < titles.length; i++) {
            htmlBox += '<tr>' +
                '<td>' + titles[i] + ':</td>' +
                '<td>' + data[titles[i]] + '</td>' +
                '</tr>';
        }

        htmlBox += '</table>';
        return htmlBox;
    };


    var redrawTableWithUpdates = function(tabsUpdate) {
        clearTable();

        for(var i = 0; i < tabsUpdate.length; i++) {
            _dtTable.rows.add(getRows(tabsUpdate[i]));
        }

        _dtTable.draw();
    };


    var getRows = function(tabUpdate) {
        var sites = tabUpdate.sites,
            tabId = tabUpdate.tabId;

        return $.map(sites, function(site) {
            return features.getFrom(site, tabId);
        });
    };


    var clearTable = function () {
        _dtTable.clear().draw();
    };


    return {
        clearTable: clearTable,
        redrawTableWithUpdates: redrawTableWithUpdates,
        create: create
    };
}());