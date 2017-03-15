/**
 * Created by Sing on 16.11.2016.
 */
//ToDo: add updateTable

var motifTable = (function () {
    var _moduleName = "motifTable",
        _dtTable = undefined, _rows = [],
        _sitesList = [], _primarySequence = {}, _tableID = "#motif-table";

    var create = function() {
        features.setFeatures();
        _dtTable = $(_tableID).DataTable(createTable());
        buildUIComponent();

        //temporary

        new $.fn.dataTable.Buttons( _dtTable, {
            name: 'commands',
            buttons: [{
                text: '<i class="fa fa-lg fa-clipboard"></i>',
                extend: 'copy',
                className: 'export-copy_',
                name: "myB"
            }]
        } );
        _dtTable.buttons(1, null).container().appendTo( "#dtTest" );

        return _dtTable;
    };



    var createTable = function () {
        var tableObject = function () {
            return {
                columnDefs: [
                    {targets: [2, 3, 4], width: "7%"}
                ],
                dom: 'Bfrtip',
                columns: createColumns(),
                buttons: createButtons()
            };
        };

        var createColumns = function () {
            var unitDetails = [{
                    "title": 'Additional info',
                    "width": '9%',
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                }],
                featuresToShow = $.map(features.getFeatures(false), function (feature) {
                    return {"data": feature, "title": feature};}),
                featuresToHide = $.map(features.getFeatures(true), function (feature) {
                    return {"data": feature, "title": feature, "visible": false };}),
                columns = [].concat(unitDetails, featuresToShow, featuresToHide);
            return columns;
        };


        var appendHTMLBoxesForColumns = function (columns) {
            var $table = $(_tableID), $headAndFootTr = $table.find("thead > tr, tfoot > tr"),
                htmlBox = "", htmlBoxTitle = "";
            console.log(columns);

            for(var i = 0; i < columns.length; i++) {
                htmlBoxTitle = columns[i].title;
                htmlBox = "<th>" + htmlBoxTitle + "</th>";
                $headAndFootTr.append(htmlBox);
            }
        };


        var createButtons = function () {
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


    var redrawTableWithSites = function(sites, primarySequence, userRequestedNames) {
        _sitesList = sites;
        _rows = getRows();
        _primarySequence = primarySequence;

        _dtTable.clear();
        _dtTable
            .rows.add(_rows)
            .draw();
    };


    var getRows = function() {
        var rows = new Array(_sitesList.length); //that IS optimal
        for (var siteID = 0; siteID < _sitesList.length; siteID++) {
            rows[siteID] = getFeaturesBySiteID(siteID);
        }
        return rows;
    };


    var getFeaturesBySiteID = function(siteID) {
        var site =  _sitesList[siteID];
        return features.getFrom(site);
    };


    return {
        redrawTableWithSites: redrawTableWithSites,
        create: create
    };

}());


var features = (function () {
    var _moduleName = "features",
        _logoUrl = "http://hocomoco.autosome.ru",
        _rowFeatures = null;
    //["direct_logo_url", "uniprot_id", "motif_families", "motif_subfamilies"];


    var setFeatures = function () {
        _rowFeatures = {"toHide": [], "toShow": []};
        _rowFeatures.toHide = [].concat(motifLibrary.getFeaturesForTable(), ["Strand"]);
        _rowFeatures.toShow = ["Motif ID", "Strength", "Start Position", "Finish Position", "Sequence"];
    };


    var getFeatures = function (isHidden) {
        if (_rowFeatures == null){
            errorHandler.logError({"fileName": _moduleName, "message": "features haven't been set"});
            return null;
        } else {
            if (isHidden === true) {
                return _rowFeatures.toHide;
            } else if (isHidden === false) {
                return _rowFeatures.toShow;
            } else {
                errorHandler.logError({"fileName": _moduleName, "message": "isHidden value must be true or false"});
                return null;
            }
        }
    };


    var getFrom = function (site) {
        var motifName = site.motifName;
        return $.extend({}, motifFeatures(motifName), siteFeatures(site));
    };


    var motifFeatures = function (motifName) {
        return motifLibrary.getMotifFeaturesForTable(motifName);
    };


    var siteFeatures = function (site) {
        return {
            "Motif ID": site.motifName,
            "Strength": site.strength,
            "Start Position": site.scorePosition,
            "Finish Position": site.scorePosition + site.siteLength - 1,
            "Sequence": site.motifSequence,
            "Strand": site.strand
        };
    };


    return {
        getFeatures: getFeatures,
        getFrom: getFrom,
        setFeatures: setFeatures

    };

}());
