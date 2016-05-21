var BigM = require('../routes/BigM')
var jsPDF = require('jspdf')
var getVariables = function(postVariables) {
    var $scope = {}
    var userId = Math.round(Math.random() * 1000000000);
    $scope.constants = {
        "raw": 1,
        "x1": 1,
        "x2": 2,
        "x3": 4,
        "total": 15,
    };
    console.log($scope.constants)
    var constants = $scope.constants;
    var salaryChange = false;
    var hraChange = false;
    var flag = true;
    $scope.variables = {
        "c1": {
            "name": "CTC/Total Salary",
            "input": true,
            "value": postVariables.ctc,
            "slider": {
                "min": 0,
                "max": 10000000,
                "step": 1000
            }
        },
        "months": {
            "name": "Months Worked",
            "input": true,
            "value": postVariables.months,
            "slider": {
                "min": 0,
                "max": 12,
                "step": 1
            }
        },
        "residence": {
            "name": "Residence",
            "value": postVariables.rented,
            description: "You can even pay rent to your parents/relatives",
            "selector": {
                "prompt": "Type of residence",
                "value": postVariables.rented,
                "options": [{
                    "text": "Rented",
                    "value": "Rented"
                }, {
                    "text": "Owned",
                    "value": "Owned"
                }, {
                    "text": "Owned by Parents / Joint Family",
                    "value": "Owned by Parents / Joint Family"
                }, ]
            }
        },
        "city": {
            "name": "City of Residence",
            "value": "Mumbai",
            "percent": 0.5,
            "selector": {
                "prompt": "Select your city",
                "value": "Mumbai",
                "options": [{
                    "text": "Delhi",
                    "value": "Delhi",
                }, {
                    "text": "Mumbai",
                    "value": "Mumbai"
                }, {
                    "text": "Chennai",
                    "value": "Chennai"
                }, {
                    "text": "Kolkatta",
                    "value": "Kolkatta"
                }, {
                    "text": "Others",
                    "value": "Others"
                }, ]
            }
        },
        "ma": {
            "name": "Medical Re-imbursements",
            // "description": "Exception can be claimed on production of bills of expenses of dependent parents",
            "description": "Medical bills of any of the close family member can be claimed",
            "input": true,
            "value": 15000,
            "slider": {
                "min": 0,
                "max": 15000,
                "step": 100
            }
        },
        "meal": {
            "name": "Food Coupons",
            "input": true,
            "value": 12050,
            "slider": {
                "min": 0,
                "max": 12050,
                "step": 50
            }
        },
        "cea": {
            "name": "Children Education Sponsorship",
            "input": true,
            "value": Math.min(postVariables.child*1200,2400),
            "selector": {
                "prompt": "Number of children",
                "value": 0,
                "options": [{
                    "text": "0",
                    "value": 0
                }, {
                    "text": "1",
                    "value": 1
                }, {
                    "text": "More than 1",
                    "value": 2
                }, ]
            }
        },
        "lta": {
            "name": "Vacation travelling sponsorship(LTA)",
            description: "Travelling fare bills should be presented to employer",
            "input": true,
            "value": 0,
            "slider": {
                "min": 0,
                "max": 20000,
                "step": 100
            },
            "selector": {
                "prompt": "number of people",
                "value": Math.min(postVariables.child > 0 ? postVariables.child + 2 : 1,4),
                "options": [{
                    "text": "1",
                    "value": 1
                }, {
                    "text": "2",
                    "value": 2
                }, {
                    "text": "3",
                    "value": 3
                }, {
                    "text": "4",
                    "value": 4
                }, ]
            }
        },
        "ca": {
            "name": "Coveyance Allowance",
            "description": "Move to zero if your employer is providing conveyance facility",
            "input": true,
            "value": 19200,
            "slider": {
                "min": 0,
                "max": 1600 * 12,
                "step": 100
            }
        },
        "da": {
            "name": "Dearness Allowance",
            "input": true,
            "value": 0,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "fc": {
            "name": "Variable income (sales incentive)",
            "input": true,
            "value": 0,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "c2": {
            "name": "Constant 2",
            "hide": true,
            "value": 0,
        },
        "c3": {
            "name": "Constant 3",
            "hide": true,
            "input": true,
            "value": 0,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "x1": {
            "name": "Basic Salary",
            "value": 0,
            "input": true,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "x2": {
            "name": "House Rental Allowance",
            "value": 0,
            "input": true,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "x3": {
            "name": "Rental Paid Annually",
            "value": postVariables.rent?postVariables.rent:0,
            "input": true,
            "slider": {
                "min": 0,
                "max": 1000000,
                "step": 1000
            }
        },
        "pfesi": {
            "name": "PF and ESI",
            "value": 0,
            "pfvalue": 0,
            "esivalue": 0,
            "input": true,
            "hide": false,
            "checkbox": {
                "disabled": true,
                "prompt": "Deduct pf and esi?",
                "value": postVariables.pfDeduct
            }
        },
        "z": {
            "name": "HRA(tax exempted)",
            "value": 0
        },
        "c4": {
            "name": "Other Allowances",
            "hide": true,
            "value": 0
        },
        "taxable": {
            "name": "Gross Taxable Income",
            "value": 0
        },
        "recommended": {
            name: "Recommended Tax Investments",
            value: 215000,
            input: true,
            "slider": {
                "min": 0,
                "max": 215000,
                "step": 1000
            }
        },
        "nettax": {
            "name": "Net Taxable Income",
            "value": 0
        },
        "tax": {
            "name": "Tax",
            "value": 0
        },
        "saveTax": {
            "name": "Tax Saved",
            "value": 0
        }
    }
    var limits = {
        x1: 0,
        x2: 0,
        x3: 0
    }
    if(postVariables.rent)
        limits.x3=postVariables.rent;
    console.log(postVariables.rent)
    var getTax = function(money) {
        var m = 0
        if (money > 1000000)
            m = (money - 1000000) * .3 + 125000
        else if (money > 500000)
            m = (money - 500000) * .2 + 25000
        else if (money > 250000)
            m = (money - 250000) * .1 - 5000
        return m > 0 ? Math.round(m * 1.03) : 0
    }

    var optimise = function(onesixsevenfive) {
        var multiplier = onesixsevenfive ? 1.1675 : 1;
        var solver = new BigM(BigM.MAXIMIZE, [0, 0, 0, 1]);
        if (limits.x1) {
            solver.addConstraint([1, 0, 0, 0], BigM.GREATER_OR_EQUAL_THAN, limits.x1);
            solver.addConstraint([1, 0, 0, 0], BigM.LOWER_OR_EQUAL_THAN, limits.x1);
        }
        if (limits.x2) {
            solver.addConstraint([0, 1, 0, 0], BigM.GREATER_OR_EQUAL_THAN, limits.x2)
            solver.addConstraint([0, 1, 0, 0], BigM.LOWER_OR_EQUAL_THAN, limits.x2)
        }
        if (limits.x3)
            solver.addConstraint([0, 0, 1, 0], BigM.EQUALS, limits.x3)
        solver.addConstraint([$scope.variables.city.percent, 0, 0, -1], BigM.GREATER_OR_EQUAL_THAN, 0);
        solver.addConstraint([0, 1, 0, -1], BigM.GREATER_OR_EQUAL_THAN, 0);
        solver.addConstraint([-0.1, 0, 1, -1], BigM.GREATER_OR_EQUAL_THAN, 0);
        solver.addConstraint([multiplier, 1, 0, 0], BigM.GREATER_OR_EQUAL_THAN, $scope.variables.c1.value - $scope.variables.c2.value - multiplier * $scope.variables.c3.value - Math.max(0, $scope.variables.c4.value));
        solver.addConstraint([multiplier, 1, 0, 0], BigM.LOWER_OR_EQUAL_THAN, $scope.variables.c1.value - $scope.variables.c2.value - multiplier * $scope.variables.c3.value - Math.max(0, $scope.variables.c4.value));
        return solver.solve()
    }


    var findUnknowns = function(checkboxValue, which) {
        $scope.variables.residence.value = $scope.variables.residence.selector.value;
        nohra = $scope.variables.residence.value == "Owned";
        if (nohra)
            return
        $scope.variables.c3.value = $scope.variables.da.value + $scope.variables.fc.value
        $scope.variables.c2.value = $scope.variables.ma.value + $scope.variables.lta.value + $scope.variables.cea.value + $scope.variables.ca.value + $scope.variables.meal.value;
        var res = optimise(checkboxValue);
        if (which == undefined || which & 1) {
            $scope.variables.x1.slider.max = Math.round(res[0])
            $scope.variables.x1.value = Math.round(res[0])
        }
        if (which == undefined || which & 2) {
            $scope.variables.x2.slider.max = Math.round(res[1])
            $scope.variables.x2.value = Math.round(res[1])
        }
        if (which == undefined || which & 4) {
            $scope.variables.x3.slider.max = Math.round(res[2])
            $scope.variables.x3.value = Math.round(res[2])
        }
        if (which == undefined || which & 8) {
            $scope.variables.z.value = Math.round(res[3])
        }
        // console.log('checkbox : ' + checkboxValue)
        // console.log('city : ' + $scope.variables.city.percent)
        console.log('c1 : ' + $scope.variables.c1.value)
        console.log('c2 : ' + $scope.variables.c2.value)
        console.log('c3 : ' + $scope.variables.c3.value)
        console.log('x1 : ' + res[0])
        console.log('x2 : ' + res[1])
        console.log('x3 : ' + res[2])
        console.log('z : ' + res[3])
        console.log('c4 : ' + $scope.variables.c4.value)
        console.log('limits : ' + limits.x1 + " " + limits.x2 + " " + limits.x3)
        console.log('res : ' + res)
        console.log('---------------------')
    }

    var setMaxLTA = function() {
        if ($scope.variables.c1.value > 600000)
            $scope.variables.lta.slider.max = 19950 * $scope.variables.lta.selector.value;
        else
            $scope.variables.lta.slider.max = 7550 * $scope.variables.lta.selector.value;
    }
    setMaxLTA();
    var lastLTA;
    var nohra;
    $scope.email = ''
    $scope.find = function(key, variable, method) {
        $scope.variables.taxable.multiline = []
        var onesixsevenfivebool = ($scope.variables.pfesi.checkbox.value || $scope.variables.pfesi.hide);
        var onesixsevenfive = ($scope.variables.pfesi.checkbox.value || $scope.variables.pfesi.hide) ? 1.1675 : 1;
        if (key == "c1") {
            setMaxLTA();
            $scope.variables.lta.value = Math.round(Math.min((10.7 * variable.value * 5) / (100 * 12), $scope.variables.lta.slider.max));
        } else if (key == "months") {
            $scope.variables.ca.slider.max = $scope.variables.months.value * 1600;
            $scope.variables.ca.value = $scope.variables.ca.slider.max;
            $scope.variables.meal.slider.max = Math.round(50 * 241 / 12 * $scope.variables.months.value);
            $scope.variables.meal.value = $scope.variables.meal.slider.max;
        } else if (key == "residence") {
            $scope.variables.residence.value = $scope.variables.residence.selector.value;
            nohra = $scope.variables.residence.value == "Owned";
            if (nohra) {
                $scope.variables.z.hide = true;
                $scope.variables.z.value = 0;
                $scope.variables.x3.hide = true;
                $scope.variables.x3.value = 0;
                $scope.variables.x2.hide = true;
                $scope.variables.x2.value = 0;
                $scope.variables.x1.slider.max = Math.round(($scope.variables.c1.value - onesixsevenfive * $scope.variables.c3.value - $scope.variables.c2.value) / onesixsevenfive);
                $scope.variables.x1.slider.value = $scope.variables.x1.slider.max;
                $scope.variables.x2.value = 0;
                $scope.variables.z.value = 0;
            } else {
                $scope.variables.z.hide = false;
                $scope.variables.x3.hide = false;
                $scope.variables.x2.hide = false;
                findUnknowns(onesixsevenfivebool);
            }
        } else if (key == "city") {
            $scope.variables.city.value = $scope.variables.city.selector.value;
            var city = $scope.variables.city.value;
            if (city == "Mumbai" || city == "Chennai" || city == "Delhi" || city == "Kolkatta")
                $scope.variables.city.percent = 0.5;
            else
                $scope.variables.city.percent = 0.4;
        } else if (key == "lta") {
            setMaxLTA();
            if (lastLTA != $scope.variables.lta.slider.max) {
                lastLTA = $scope.variables.lta.slider.max;
                $scope.variables.lta.value = $scope.variables.lta.slider.max
            }
            $scope.variables.lta.value = Math.min($scope.variables.lta.slider.max, $scope.variables.lta.value);
        } else if (key == "cea") {
            $scope.variables.cea.value = $scope.variables.cea.selector.value * 1200;
            $scope.variables.lta.selector.value = $scope.variables.cea.selector.value > 0 ? $scope.variables.cea.selector.value + 2 : 1;
        } else if (key == "x1") {
            if (!nohra) {
                limits.x1 = $scope.variables.x1.value
                var which = constants.total - constants.x1;
                which -= limits.x2 ? constants.x2 : 0;
                which -= limits.x3 ? constants.x3 : 0;
                if (limits.x2) {
                    $scope.variables.c4.hide = false;
                    $scope.variables.c4.value = Math.round(Math.max(0, $scope.variables.c1.value - $scope.variables.c2.value - onesixsevenfive * $scope.variables.c3.value - onesixsevenfive * $scope.variables.x1.value - $scope.variables.x2.value));
                    salaryChange = false;
                    if ($scope.variables.c4.value == 0) {
                        which += constants.x2;
                        limits.x2 = 0;
                    }
                    findUnknowns(onesixsevenfivebool, which)
                } else {
                    findUnknowns(onesixsevenfivebool, which)
                    $scope.variables.c4.hide = true;
                    $scope.variables.c4.value = 0;
                    $scope.variables.x3.value = $scope.variables.x3.slider.max;
                    $scope.variables.x2.value = $scope.variables.x2.slider.max;
                    salaryChange = true;
                }
            } else {
                $scope.variables.x2.value = 0;
                $scope.variables.x3.value = 0;
                $scope.variables.z.value = 0;
            }
        } else if (key == "x2") {
            limits.x2 = $scope.variables.x2.value
            var which = constants.total - constants.x2;
            which -= limits.x1 ? constants.x1 : 0;
            which -= limits.x3 ? constants.x3 : 0;
            findUnknowns(onesixsevenfivebool, which)
            if (limits.x1) {
                $scope.variables.c4.hide = false;
                $scope.variables.c4.value = Math.round(Math.max(0, $scope.variables.c1.value - $scope.variables.c2.value - onesixsevenfive * $scope.variables.c3.value - onesixsevenfive * $scope.variables.x1.value - $scope.variables.x2.value));
                if ($scope.variables.c4.value == 0) {
                    which += constants.x1;
                    limits.x1 = 0;
                }
                hraChange = false;
                findUnknowns(onesixsevenfivebool, which)
            } else {
                findUnknowns(onesixsevenfivebool, which)
                hraChange = true;
                $scope.variables.c4.hide = true;
                $scope.variables.c4.value = 0;
                $scope.variables.x3.value = $scope.variables.x3.slider.max;
                $scope.variables.x1.value = $scope.variables.x1.slider.max;
            }

        } else if (key == "x3") {
            limits.x3 = $scope.variables.x3.value
            var which = constants.total - constants.x3;
            which -= limits.x1 ? constants.x1 : 0;
            which -= limits.x2 ? constants.x2 : 0;
            findUnknowns(onesixsevenfivebool, which)
        }

        if (!(key == "x1" || key == "x2" || key == "x3")) {
            limits = {
                x1: 0,
                x2: 0,
                x3: postVariables.rent?postVariables.rent:0
            }
            findUnknowns(onesixsevenfivebool)
            $scope.variables.residence.value = $scope.variables.residence.selector.value;
            nohra = $scope.variables.residence.value == "Owned";
            if (nohra)
                $scope.variables.x1.slider.max = Math.round(($scope.variables.c1.value - onesixsevenfive * $scope.variables.c3.value - $scope.variables.c2.value) / onesixsevenfive);
            $scope.variables.x1.value = $scope.variables.x1.slider.max;
            $scope.variables.x2.value = $scope.variables.x2.slider.max;
            $scope.variables.x3.value = $scope.variables.x3.slider.max;
        } else {
            // $scope.variables.z.value = Math.round(Math.max(Math.min($scope.variables.city.percent * $scope.variables.x1.value, $scope.variables.x2.value, $scope.variables.x3.value - 0.1 * $scope.variables.x1.value), 0))
        }
        $scope.variables.pfesi.description = "PF : " + $scope.variables.pfesi.pfvalue + ", ESI : " + $scope.variables.pfesi.esivalue;
        if (optimise(false)[0] >= 180000 && $scope.variables.x1.value >= 180000) {
            // console.log('in psi')
            // $scope.variables.pfesi.hide = false;
            $scope.variables.pfesi.checkbox.disabled = false;
            if (flag) {
                $scope.variables.pfesi.checkbox.value = true;
                flag = false;
            }
            if ($scope.variables.pfesi.checkbox.value) {
                $scope.variables.pfesi.pfvalue = Math.round(12 * $scope.variables.x1.value / 100);
                $scope.variables.pfesi.esivalue = Math.round(4.75 * $scope.variables.x1.value / 100);
                $scope.variables.pfesi.value = $scope.variables.pfesi.pfvalue + $scope.variables.pfesi.esivalue;
                $scope.variables.pfesi.description = "PF : " + $scope.variables.pfesi.pfvalue + ", ESI : " + $scope.variables.pfesi.esivalue;
            } else {
                $scope.variables.pfesi.description = "PF : " + 0 + ", ESI : " + 0;
                $scope.variables.pfesi.value = 0;
            }
        } else {
            flag = true;
            $scope.variables.pfesi.checkbox.value = true;
            $scope.variables.pfesi.checkbox.disabled = true;
            $scope.variables.pfesi.pfvalue = Math.round(12 * $scope.variables.x1.value / 100);
            $scope.variables.pfesi.esivalue = Math.round(4.75 * $scope.variables.x1.value / 100);
            $scope.variables.pfesi.value = $scope.variables.pfesi.pfvalue + $scope.variables.pfesi.esivalue;
            $scope.variables.pfesi.description = "PF : " + $scope.variables.pfesi.pfvalue + ", ESI : " + $scope.variables.pfesi.esivalue;
        }

        $scope.variables.taxable.multiline = ["Basic Salary : " + $scope.variables.x1.value,
            "Children Education Sponsorship : " + ($scope.variables.cea.value - $scope.variables.cea.value),
            "Medical Re-imbursements : " + Math.max($scope.variables.ma.value - 15000, 0),
            "Food Coupons : " + Math.max($scope.variables.meal.value - $scope.variables.meal.slider.max, 0),
            "HRA amount : " + ($scope.variables.residence.value != "Owned" ? ($scope.variables.x2.value - $scope.variables.z.value) : 0),
            "Vacation travelling Sponsorship (LTA) : " + Math.max($scope.variables.lta.value - $scope.variables.lta.slider.max, 0),
            // "PF and ESI : " + Math.max($scope.variables.pfesi.value - 150000, 0),
            "DA amount : " + $scope.variables.da.value,
            "Variable income (sales incentive) : " + $scope.variables.fc.value,
            "CA amount : " + Math.max(0, $scope.variables.ca.value - 19200),
            "Others : " + $scope.variables.c4.value
        ];

        if ($scope.variables.residence.value == "Owned") {
            $scope.variables.x2.value = 0;
            $scope.variables.x3.value = 0;
            $scope.variables.z.value = 0;
        }
        $scope.variables.taxable.value = Math.round(
            $scope.variables.x1.value +
            Math.max($scope.variables.ma.value - 15000, 0) +
            Math.max($scope.variables.meal.value - $scope.variables.meal.slider.max, 0) +
            $scope.variables.x2.value -
            $scope.variables.z.value +
            Math.max($scope.variables.lta.value - $scope.variables.lta.slider.max, 0) +
            $scope.variables.da.value +
            $scope.variables.fc.value +
            (0 /*$scope.variables.ca.value - 19200*/ ) +
            // Math.max($scope.variables.pfesi.value - 150000, 0) +
            $scope.variables.c4.value);
        if ($scope.variables.pfesi.checkbox.value && !$scope.variables.pfesi.hide) {
            var m = ["PF amount : " + (0 /*-$scope.variables.pfesi.pfvalue*/ ),
                "ESI amount : " + (0 /*-$scope.variables.pfesi.esivalue*/ )
            ]
            $scope.variables.taxable.multiline = $scope.variables.taxable.multiline.concat(m)
            $scope.variables.taxable.value -= Math.round(0 /*$scope.variables.pfesi.pfvalue*/ + 0 /*$scope.variables.pfesi.esivalue*/ );
        }
        if (key != "recommended") {
            var r = Math.min(
                $scope.variables.taxable.value > 500000 ? $scope.variables.taxable.value - 250000 : $scope.variables.taxable.value - 300000,
                215000
            )
            $scope.variables.recommended.value = r > 0 ? r : 0
        }
        $scope.variables.nettax.value = $scope.variables.taxable.value - $scope.variables.recommended.value
        $scope.variables.tax.value = getTax($scope.variables.nettax.value);
        $scope.variables.saveTax.value = getTax($scope.variables.c1.value) - getTax($scope.variables.nettax.value);
        if ($scope.variables.saveTax.value > 0)
            $scope.variables.saveTax.hide = false;
        else
            $scope.variables.saveTax.hide = true;
    }
        $scope.email = postVariables.email;
        $scope.find("c1", $scope.variables.c1);

    $scope.downloadCSV = function() {

        var data = "Instant Salary Tax Saver Report" +
            "\nCofidential" +
            "\n\nMost Tax Efficient way to Structure your Salary :-" +
            "\nIncome Description,Amount(Rs)\n" +
            "\nBasic Salary," + $scope.variables.x1.value +
            "\nMedical Reimbursement," + $scope.variables.ma.value +
            "\nFood coupons," + $scope.variables.meal.value +
            "\nChildren Education fees sponsorship," + $scope.variables.cea.value +
            "\nVacation Travelling Fare sponsorship," + $scope.variables.lta.value +
            "\nConveyance Allowance," + $scope.variables.ca.value +
            "\nProvident fund(PF)," + $scope.variables.pfesi.value > 0 ? $scope.variables.pfesi.pfvalue : 0 +
            "\nEmployee State Insurance (ESI)," + $scope.variables.pfesi.value > 0 ? $scope.variables.pfesi.esivalue : 0 +
            "\nDearness Allowance," + $scope.variables.da.value +
            "\nHouse Rent Allowance," + $scope.variables.x2.value +
            "\nVariable Income (sales incentive)," + $scope.variables.fc.value +
            "\nTOTAL CTC," + $scope.variables.c1.value +
            "\nLess: Exemptions from Income Tax," + ($scope.variables.c1.value - $scope.variables.taxable.value) +
            "\nLess: Recommended Tax Investments ," + $scope.variables.recommended.value +
            "\nTaxable salary," + $scope.variables.nettax.value +
            "\nTax Due," + $scope.variables.tax.value +
            "\nTotal Tax savings," + $scope.variables.saveTax.value +
            "\nRecommended Rent to be Paid," + $scope.variables.x3.value +

            "\n\n\nRecommended Tax investments,Amount(Rs)" +
            "\nInvestments u/s 80C" +
            "\nEmployee's Provident Fund," + Math.min($scope.variables.pfesi.pfvalue, 150000) +
            "\nTuition Fees" +
            "\nLife Insurance Premium" +
            "\nEquity Mutual Funds" +
            "\nHome Loan Principal Repayment" +
            "\nPublic Provident Fund(PPF)" +
            "\n5 Year Fixed Deposit with Bank" +
            "\n5 Years Post Office Deposit" +
            "\nNational Pension Scheme" +
            "\nSection 80D -Mediclaim Premium ( Family Members)," + $scope.variables.ma.value +
            "\nTotal (Max)," + $scope.variables.recommended.value +

            "\n\n\nTax Hero OPC" +
            "\nCopyright Reserved 2016";

        $('<a></a>')
            .attr('href', 'data:application/csv;charset=utf8,' + encodeURIComponent(data))
            .attr('download', 'Instant Tax Saver Report.csv')
            .attr('id', 'downloadFile')
            .html('')
            .appendTo('body');

        $('#downloadFile').ready(function() {
            $('#downloadFile')
                .get(0)
                .click();
            $('#downloadFile').remove()
        });

    }

    $scope.downloadPDF = function() {
        var columns = [{
            title: "Income Description",
            dataKey: "income"
        }, {
            title: "Amount (in Rs)",
            dataKey: "amount"
        }];
        var data = [
            ["Basic Salary", $scope.variables.x1.value],
            ["Medical Reimbursement", $scope.variables.ma.value],
            ["Food coupons", $scope.variables.meal.value],
            ["Children Education fees sponsorship", $scope.variables.cea.value],
            ["Vacation Travelling Fare sponsorship", $scope.variables.lta.value],
            ["Conveyance Allowance", $scope.variables.ca.value],
            ["Provident fund(PF)", $scope.variables.pfesi.value > 0 ? $scope.variables.pfesi.pfvalue : 0],
            ["Employee State Insurance (ESI)", $scope.variables.pfesi.value > 0 ? $scope.variables.pfesi.esivalue : 0],
            ["Dearness Allowance", $scope.variables.da.value],
            ["House Rent Allowance", $scope.variables.x2.value],
            ["Variable Income (sales incentive)", $scope.variables.fc.value],
            ["TOTAL CTC", $scope.variables.c1.value],
            ["Less: Exemptions from Income Tax", ($scope.variables.c1.value - $scope.variables.taxable.value)],
            ["Less: Recommended Tax Investments ", $scope.variables.recommended.value],
            ["Taxable salary", $scope.variables.nettax.value],
            ["Tax Due", $scope.variables.tax.value],
            ["Total Tax savings", $scope.variables.saveTax.value]
        ];

        var rows = []
        data.forEach(function(d) {
            rows.push({
                income: d[0],
                amount: d[1]
            })
        })

        // Only pt supported (not mm or in)
        var doc = new jsPDF('p', 'pt');
        doc.autoTable(columns, rows, {
            theme: 'grid',
            margin: {
                top: 110
            },
            beforePageContent: function(data) {
                doc.setFontSize(22);
                doc.text("Instant Salary Tax Saver Report", 150, 30);
                doc.setFontSize(13);
                doc.text("Confidential", 40, 50)
                doc.setFontSize(16);
                doc.text("Most Tax Efficient way to Structure your Salary :-", 40, 90)
            },
            afterPageContent: function(data) {
                doc.text("Recommended Rent to be Paid : " + $scope.variables.x3.value, 50, doc.autoTableEndPosY() + 10);
            }
        });

        var columns = [{
            title: "Recommended Tax Investments",
            dataKey: "recommended"
        }, {
            title: "Amount (Rs)",
            dataKey: "amount"
        }];


        var data = [
            ["Investments u/s 80C", ""],
            ["Employee's Provident Fund", Math.min($scope.variables.pfesi.pfvalue, 150000)],
            ["Tuition Fees", ""],
            ["Life Insurance Premium ", ""],
            ["Equity Mutual Funds", ""],
            ["Home Loan Principal Repayment ", ""],
            ["Public Provident Fund(PPF)", ""],
            ["5 Year Fixed Deposit with Bank", ""],
            ["5 Years Post Office Deposit", ""],
            ["National Pension Scheme", ""],
            ["Section 80D -Mediclaim Premium ( Family Members)", $scope.variables.ma.value],
            ["Total (Max)", $scope.variables.recommended.value]
        ];

        console.log(data)

        var rows = []
        data.forEach(function(d) {
            rows.push({
                recommended: d[0],
                amount: d[1]
            })
        })
        doc.autoTable(columns, rows, {
            startY: doc.autoTableEndPosY() + 30,
            theme: 'grid',
            afterPageContent: function(data) {
                doc.text("Tax Hero OPC", 40, doc.autoTableEndPosY() + 30);
                doc.text("Copyright Reserved 2016", 40, doc.autoTableEndPosY() + 60);


                var imgData = 'data:image/png;base64,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';
                doc.addImage(imgData, 'png', 200, doc.autoTableEndPosY() + 20, 30, 45);
                var imgData = 'data:image/png;base64,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'
                doc.addImage(imgData, 'png', 40, doc.autoTableEndPosY() + 70, 30, 30);
            }
        });
        return doc;
        // doc.save('Instant Tax Saver Report.pdf');
    }
    return $scope.downloadPDF();
}

module.exports = getVariables;