/**
 * Created by kourpa on 2/9/17.
 */
var equation;
var scope = [];
var dependentVariable;
var independentVariable;
var saved_params = {};

var checkEquation = function(){
    var eq = $("#equation")[0].value.replace(/ /g,'');
    var iv = $("#independent")[0].value;
    var params = {};
    var error = false;
    var message = "\n";
    var tmpEquation;
    var tmpScope;

    var items = eq.split("'=");
    if(items.length != 2){
        error = true;
        message += "Improper Equation! \n"
    }
    else {
        try {
            var e = "", last = "";
            for(var i = 0; i < items[1].length; i++){
                var c = items[1][i];
                if(isLetter(c) && isLetter(last)){
                    e += '*';
                }
                e += c;
                last = c;
            }

            $("#equation")[0].value = (items[0] + "'=" + e);
            tmpEquation = math.parse(e).compile();
        }
        catch (e) {
            message += e + "\n";
            error = true;
        }
    }

    i = 0;
    var p;
    while(p = $(".parameter")[i++]){
        var param = p.value.replace(/ /g,'');
        var split = param.split("=");

        if(isNaN(split[1])){
            message += "Invalid Parameter Value: " + split[1] + "\n";
            error = true;
        }
        else {
            params[split[0]] = split[1];
        }
    }

    // Just in case math.js doesn't like this function
    try {
        tmpScope = params;
        tmpScope[items[0]] = 1;
        tmpScope[iv] = 1;
        tmpEquation.eval(tmpScope);
    }
    catch(e){
        message += e + "\n";
        error = true;
    }
    ///////////////////////////////////////////////////////

    if(error){
        notification(message + "\n");

    }
    else {
        scope = tmpScope;
        equation = tmpEquation;
        dependentVariable = items[0];
        independentVariable = iv;
    }
};

var resetEquation = function(){
    $("#equation")[0].value = "x'=x^2-ay+b";
    $("#independent")[0].value = "y";
    saved_params = {};
    populateParameters();
    checkEquation();
    initGraph();
};

var setEquation = function(){
    checkEquation();
    initGraph();
};

var addParameter = function(p, v){
    $(".parameters").append('<div></div><input ' +
                                    'class="centered border parameter" ' +
                                    'type="text" ' +
                                    'value="' + p + ' = ' + v + '" ' +
                                    'title="Parameter ' + p + '"' +
                                    'onkeyup="restrictInput(this, \'' + p +' = \')"' +
                                    'onkeydown="restrictInput(this, \'' + p +' = \')"' +
                                    '></div>')
};

var clearParamters  = function(){
    $(".parameter").remove();
};

var restrictInput = function(element, s){
    var value = element.value;
    element.value = s + value.slice(4);
    saved_params[s[0]] = value.slice(4);
};

var populateParameters = function(){
    var eq = $("#equation")[0].value.replace(/ /g,'');
    var iv = $("#independent")[0].value;
    var s = eq.split("'=");

    clearParamters();
    if(s[0] == null || s [1] == null)
        return;

    s[1] = s[1].replace(/[^a-zA-Z]/gi, '');
    s[1] = s[1].replace(/(.)(?=.*\1)/g, "");
    s[1] = s[1].replace(s[0], '');
    s[1] = s[1].replace(iv, '');

    for(var i = 0; i < s[1].length; i++){
        addParameter(s[1][i], saved_params[s[1][i]] || 1);
    }
};


var notification = function(e){
    $("#accordian").notify(e,
        {
            autoHide: false,
            position:"right top",
            arrowShow: false
        });
};

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

