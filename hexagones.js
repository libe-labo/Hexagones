window.addEventListener('load', function() {
    var config = {
        colors: {
            borders: '#ffffff',
            empty: '#c6c6c6'
        },
        colorFrom: 'Couleur'
    };

    var svg = d3.select(d3.select('#map')[0][0].getSVGDocument()),
        allData = [];

    var or = svg.select('#ARegions'), // Anciennes régions
        r = svg.select('#Regions'), // Régions
        d = svg.select('#Dpts'); // Départements

    svg.select('#Labels').selectAll('*').style('pointer-events', 'none').attr('fill', 'rgb(255, 255, 255)');

    var setColors = function() {
        or.selectAll('polygon').attr('fill', 'transparent').style('pointer-events', 'none').attr('stroke', config.colors.borders);
        r.selectAll('polygon').attr('fill', 'transparent').style('pointer-events', 'none').attr('stroke', config.colors.borders);
        d.selectAll('polygon').attr('fill', config.colors.empty).attr('stroke', config.colors.borders);

        for (var i = 0; i < allData.length; ++i) {
            var selection = d3.select('NOTHING');

            color = config.colorFrom(allData[i]);

            var id = '_x3' + String(allData[i].ID)[0] + '_' + String(allData[i].ID).slice(1);
            selection = d.select('#' + id);

            selection
                .attr('fill', color)
                .attr('x-color', color)
                .on('mouseenter', (function(selection, idx) {
                    return function() {
                        // Darken color
                        var d3This = d3.select(this);
                        d3This.attr('fill', d3.rgb(d3This.attr('x-color')).darker());
                    };
                })(selection, i))
                .on('mouseleave', (function(selection, idx) {
                    return function() {
                        // Reset color
                        var d3This = d3.select(this);
                        d3This.attr('fill', d3.rgb(d3This.attr('x-color')));
                    };
                })(selection, i));
        }
    };

    if (typeof(config.colorFrom) === typeof('')) {
        config.colorFrom = (function() {
            var key = config.colorFrom;
            return function(d) {
                return d[key];
            };
        })();
    }

    d3.tsv('data.tsv', function(data) {
        allData = data;

        setColors();
    });
});
