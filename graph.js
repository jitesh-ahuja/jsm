AmCharts.ready(function () {

    var currentYear = $(".year").val();

    //client chart
    clientChart(currentYear);

    $('#clientYear').on("change", function () {
        clientChart($(this).val());
    });

    function clientChart(year) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/home/getclientdata",
            data: JSON.stringify({ year: year }),
            dataType: "json",
            success: function (data) {
                DrawChart(data, "clientChart", "Client Count")
            }
        });
    }

    //job chart
    jobChart(currentYear);

    $('#jobYear').on("change", function () {
        jobChart($(this).val())
    });

    function jobChart(year) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/home/getjobdata",
            data: JSON.stringify({ year: year }),
            dataType: "json",
            success: function (data) {
                DrawChart(data, "jobChart", "Job Count")
            }
        });
    }

    //chart plot
    function DrawChart(data, containerId, title) {
        AmCharts.makeChart(containerId, {
            "type": "serial",
            "theme": "light",
            "pathToImages": App.getGlobalPluginsPath() + "amcharts/amcharts/images/",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,
            "fontFamily": 'Open Sans',
            "color": '#67B7DC',
            "dataProvider": data,
            "valueAxes": [{
                "axisAlpha": 1,
                "position": "left",
                "integersOnly": true,
            }],
            "startDuration": 0,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": title,
                "type": "column",
                "valueField": "count"
            }],
            "categoryField": "month",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
    }

});