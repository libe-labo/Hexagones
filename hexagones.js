window.addEventListener('load', function() {
    var config = {
        colors: {
            borders: '#ffffff',
            empty: '#c6c6c6'
        },
        colorize: 'r', // d = Départements, r = Régions, or = Anciennes régions
        idFrom: 'Région',
        colorFrom: 'Couleur'
    };

    var svg = d3.select(d3.select('#map')[0][0].getSVGDocument()),
        allData = [];

    var or = svg.select('#ARegions'), // Anciennes régions
        r = svg.select('#Regions'), // Régions
        d = svg.select('#Dpts'), // Départements
        selections = { or : or , r : r , d : d };

    svg.select('#Labels').selectAll('*').style('pointer-events', 'none').attr('fill', 'rgb(255, 255, 255)');

    var setColors = function() {
        var i;

        // Reset everything
        for (i in selections) if (selections.hasOwnProperty(i)) {
            selections[i].selectAll('polygon').attr({
                fill: 'transparent',
                stroke: config.colors.borders
            }).style('pointer-events', 'none');
        }

        selections[config.colorize].selectAll('polygon').attr({
            fill: config.colors.empty
        }).style('pointer-events', 'all');

        // Colorize
        for (i = 0; i < allData.length; ++i) {
            var selection = d3.select('NOTHING');

            color = config.colorFrom(allData[i]);

            var id = String(allData[i][config.idFrom]);
            if (config.colorize === 'd') {
                id = '_x3' + id[0] + '_' + id.slice(1);
            }
            selection = selections[config.colorize].select('#' + id.toLowerCase());

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
