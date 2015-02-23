/**
 * a line
 * calculated using bresenhams algorithm
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @constructor
 */
var Line = function(x0, y0, x1, y1) {
    
    this.points = [];
    
    if(x0 && y0 && x1 && y1) {
        this.calculate(x0, y0, x1, y1);
    }

};

Line.prototype.calculate = function(x0, y0, x1, y1) {
    
    // reset points
    this.points = [];
    
    var dx = Math.abs(x1 - x0);
	var dy = Math.abs(y1 - y0);

	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;

	var err = dx - dy;
	
    var e2;
    
	while(true) {

		this.points.push([x0, y0]);

		if ((x0 === x1) && (y0 === y1)) { break; }

		e2 = err << 1;

		if(e2 > -dy) {
			err -= dy;
			x0 += sx;
		}

		if(e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}

    return this.points;
};









