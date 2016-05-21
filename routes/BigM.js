var longConstant = 10;
var BigM = function(mode, f, debugContainer) {
    this._f = f;
    this._mode = mode;
    this._numberOfColumnsToPivot = f.length;
    this._debugContainer = debugContainer;
    this._constraints = [];
    this._matrix = null;
};

BigM.MINIMIZE = 0;
BigM.MAXIMIZE = 1;

BigM.EQUALS = 0;
BigM.LOWER_OR_EQUAL_THAN = 1;
BigM.GREATER_OR_EQUAL_THAN = 2;


BigM.prototype.addConstraint = function(expression, operator, value) {
    this._constraints.push([expression, operator, value]);

    if (operator != BigM.EQUALS) {
        ++this._numberOfColumnsToPivot;
    }
}

BigM.prototype.solve = function() {
    // console.log(this._constraints)
    this._matrix = [];
    this._matrix[0] = [
        [1, 0]
    ]; // The first row is composed by vectors. Each cell is a 2D vector that represents a + bM


    for (var i = 0; i < this._f.length; ++i) {
        var totalM = 0;

        for (var j = 0; j < this._constraints.length; ++j) {
            if (this._constraints[j][1] != BigM.LOWER_OR_EQUAL_THAN) {
                totalM += this._constraints[j][0][i];
            }
        }

        if (this._mode == BigM.MAXIMIZE) {
            totalM = -totalM;
        }

        this._matrix[0].push([-this._f[i], totalM]);
    }

    var rhs = 0;

    for (var i = 0; i < this._constraints.length; ++i) {
        if (this._constraints[i][1] == BigM.GREATER_OR_EQUAL_THAN) {
            if (this._mode == BigM.MINIMIZE) {
                this._matrix[0].push([0, -1]);
            } else {
                this._matrix[0].push([0, 1]);
            }
        } else {
            this._matrix[0].push([0, 0]);
        }

        if (this._constraints[i][1] != BigM.LOWER_OR_EQUAL_THAN) {
            rhs += this._constraints[i][2];
        }
    }

    for (var i = 0; i < this._constraints.length; ++i) {
        this._matrix[0].push([0, 0]);
    }

    if (this._mode == BigM.MAXIMIZE) {
        rhs = -rhs;
    }

    this._matrix[0].push([0, rhs]);

    for (var i = 0; i < this._constraints.length; ++i) {
        this._matrix.push([0].concat(this._constraints[i][0]));
        var vars = [];
        var artificialVars = [];

        for (var j = 0; j < this._constraints.length; ++j) {
            vars.push(0);
            artificialVars.push(0);
        }

        if (this._constraints[i][1] == BigM.GREATER_OR_EQUAL_THAN) {
            vars[i] = -1;
        } else if (this._constraints[i][1] == BigM.LOWER_OR_EQUAL_THAN) {
            vars[i] = 1;
        }

        if (this._constraints[i][1] != BigM.LOWER_OR_EQUAL_THAN) {
            artificialVars[i] = 1;
        }

        this._matrix[i + 1] = this._matrix[i + 1].concat(vars).concat(artificialVars);
        this._matrix[i + 1].push(this._constraints[i][2]);
    }

    this._display();

    while (!this._isSolved()) {
        var c = this._getColumnToPivot();
        var r = this._getRowToPivot(c);
        if(!this._pivot(r, c)){
        	break
        	solution = []
        	for(var i=0;i<longConstant;++i)
        		solution.push(0)
        	return solution;
        }
        this._display();
    }

    // Rounding.

    for (var i = 0; i < this._matrix.length; ++i) {
        for (var j = 0; j < this._matrix[i].length; ++j) {
            if (i == 0) {
                this._matrix[i][j][0] = Math.round(1000 * this._matrix[i][j][0]) / 1000;
                this._matrix[i][j][1] = Math.round(1000 * this._matrix[i][j][1]) / 1000;
            } else {
                this._matrix[i][j] = Math.round(1000 * this._matrix[i][j]) / 1000;
            }
        }
    }

    this._debug('Rounding');
    this._display();

    // Solution
    var solution = [];

    for (var i = 1; i < this._f.length + 1; ++i) {
        var value = NaN;
        var pivoted = true;

        for (var j = 0; j < this._matrix.length && pivoted; ++j) {
            if (isNaN(value) && j != 0 && this._matrix[j][i] == 1) {
                value = this._matrix[j][this._matrix[j].length - 1];
            } else if (j == 0) {
                if (this._matrix[j][i][0] != 0 || this._matrix[j][i][1] != 0) {
                    pivoted = false;
                }
            } else if (this._matrix[j][i] != 0) {
                pivoted = false;
            }
        }

        if (pivoted && !isNaN(value)) {
            solution.push(value);
        } else {
            solution.push(0);
        }
    }

    this._debug('Solution: [' + solution.join(', ') + ']');
    return solution;
}

BigM.prototype._isSolved = function() {
    for (var i = 1; i < this._numberOfColumnsToPivot + 1; ++i) {
        if (this._mode == BigM.MINIMIZE) {
            if (this._matrix[0][i][1] > 0 || (this._matrix[0][i][1] == 0 && this._matrix[0][i][0] > 0)) {
                return false;
            }
        } else if (this._matrix[0][i][1] > 0 || (this._matrix[0][i][1] == 0 && this._matrix[0][i][0] < 0)) {
            return false;
        }
    }

    return true;
}

BigM.prototype._getColumnToPivot = function() {
    // For minimizations, the choosen column has the most positive indicator. M is a large positive value.
    // For maximizations, the choosen column has the most negative indicator. M is a large positive value.

    var index = 1;

    for (var i = 2; i < this._numberOfColumnsToPivot + 1; ++i) {
        if (this._mode == BigM.MINIMIZE) {
            if (this._matrix[0][i][1] == this._matrix[0][index][1]) {
                if (this._matrix[0][i][0] > this._matrix[0][index][0]) {
                    index = i;
                }
            } else if (this._matrix[0][i][1] > this._matrix[0][index][1]) {
                index = i;
            }
        } else if (this._matrix[0][i][1] == this._matrix[0][index][1]) {
            if (this._matrix[0][i][0] < this._matrix[0][index][0]) {
                index = i;
            }
        } else if (this._matrix[0][i][1] < this._matrix[0][index][1]) {
            index = i;
        }
    }

    return index;
}

BigM.prototype._getRowToPivot = function(col) {
    var minIndex = -1;
    var minRatio = -1;

    for (var i = 1; i < this._matrix.length; ++i) {
        if (this._matrix[i][col] != 0) {
            var ratio = this._matrix[i][this._matrix[i].length - 1] / this._matrix[i][col];

            if ((ratio > 0 || (ratio == 0 && this._matrix[i][col] > 0)) && (ratio < minRatio || minRatio == -1)) {
                minIndex = i;
                minRatio = ratio;
            }
        }
    }

    return minIndex;
}

BigM.last = {}
BigM.prototype._pivot = function(row, col) {
    this._debug('Pivoting row ' + row + ', column ' + col);
    if ((row < 0 || col < 0) || (row == BigM.last.row && col == BigM.last.col)) {
		BigM.last = {}
        return false;
    }
    BigM.last.row = row;
    BigM.last.col = col;

    if (this._matrix[row][col] != 1) {
        var originalValue = this._matrix[row][col];

        for (var i = 0; i < this._matrix[row].length; ++i) {
            this._matrix[row][i] /= originalValue;
        }
    }

    for (var i = 0; i < this._matrix.length; ++i) {
        if (i != row) {
            var originalValue = (i == 0) ? [this._matrix[i][col][0], this._matrix[i][col][1]] : this._matrix[i][col];

            for (var j = 0; j < this._matrix[i].length; ++j) {
                if (i == 0) {
                    this._matrix[i][j][0] = this._zeroRound(this._matrix[i][j][0] - originalValue[0] * this._matrix[row][j]);
                    this._matrix[i][j][1] = this._zeroRound(this._matrix[i][j][1] - originalValue[1] * this._matrix[row][j]);
                } else {
                    this._matrix[i][j] = this._zeroRound(this._matrix[i][j] - originalValue * this._matrix[row][j]);
                }
            }
        }
    }
    return true;
}

BigM.prototype._zeroRound = function(a) {
    if (a > -1e-10 && a < 1e-10) {
        return 0;
    }

    return a;
}

BigM.prototype._debug = function(msg) {
    if (this._debugContainer != null) {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(msg));
        this._debugContainer.appendChild(p);
    }
    // console.log(msg);
}

BigM.prototype._display = function() {
    if (this._debugContainer != null) {
        var table = document.createElement('table');
        table.setAttribute('border', 1);

        // Headers
        var header = document.createElement('thead');
        var headerInnerHTML = '<th>I</th>';

        for (var i = 0; i < this._f.length; ++i) {
            headerInnerHTML += '<th>x<sub>' + (i + 1) + '</sub></th>';
        }

        for (var i = 0; i < this._constraints.length; ++i) {
            headerInnerHTML += '<th>s<sub>' + (i + 1) + '</sub></th>';
        }

        for (var i = 0; i < this._constraints.length; ++i) {
            headerInnerHTML += '<th>a<sub>' + (i + 1) + '</sub></th>';
        }

        headerInnerHTML += '<th>RHS</th>';
        header.innerHTML = headerInnerHTML;
        table.appendChild(header);

        // Body
        var body = document.createElement('tbody');

        for (var i = 0; i < this._matrix.length; ++i) {
            var row = document.createElement('tr');

            for (var j = 0; j < this._matrix[i].length; ++j) {
                if (i == 0) {
                    var cell = '<td>';

                    if (this._matrix[i][j][0] != 0) {
                        cell += this._matrix[i][j][0];
                    }

                    if (this._matrix[i][j][1] != 0) {
                        if (this._matrix[i][j][1] >= 0 && this._matrix[i][j][0] != 0) {
                            cell += '+';
                        }

                        if (this._matrix[i][j][1] != 1) {
                            cell += (this._matrix[i][j][1] != -1) ? this._matrix[i][j][1] : '-';
                        }

                        cell += '<b>M</b>';
                    }

                    if (this._matrix[i][j][0] == 0 && this._matrix[i][j][1] == 0) {
                        cell += '0';
                    }

                    cell += '</td>';
                    row.innerHTML += cell;
                } else {
                    row.innerHTML += '<td>' + this._matrix[i][j] + '</td>';
                }
            }

            body.appendChild(row);
        }

        table.appendChild(body);
        this._debugContainer.appendChild(table);
    }
}

module.exports = BigM
