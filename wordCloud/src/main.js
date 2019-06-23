/*
when bound to input of the type file will process the selected file

returns words string from input file text
 */
function processFile(files){
    try{
        let file = files[0];
        let reader = new FileReader();

        reader.onload = function(){
            $("#input_text").val(this.result);
        };

        reader.readAsText(file);
    }
    catch(err){
        let output = "Failed to read file";
        $("#input_text").val(output);
    }
}



/*
input_string is expect to be a string.
alphabetic boolean
by_count boolean
list of words to filter

return a map of the words found in the input string { word : count }
 */
function processInput(input_string, alphabetic, by_count, filter, start){
    if(typeof input_string === "string"){
        let m = {};
        let split_string = input_string.split(/[\n, ]/);

        for(let i = 0; i < split_string.length; i++){
            let w = split_string[i];

            if(filter && filter.includes(w)) continue;
            if(start && !w.startsWith(start)) continue;

            if(m[w]){
                m[w]++;
            }
            else {
                m[w] = 1
            }
        }

        //convert to proper output
        let out = [];
        for(let key in m){
            let value = m[key];
            out.push({text: key, size: value})
        }

        if(by_count === true) {
            out.sort((a, b) => {
                return b.size - a.size;
            });
        }

        if(alphabetic === true){
            out.sort((a, b) => {
                return a.text.localeCompare(b.text);
            });
        }

        return out;
    }

    return [];
}

/*
extract filter input to a list of words

returns list of words
 */
function processFilterList(input_string){
    if(typeof input_string === "string"){
        return input_string.split(/[\n, ]+/)
    }

    return [];
}

/*
changes active tab given tab string
 */
function switchTab(event, tab){
    let wordCloudElement = $("#wordCloud");
    let rawOutputElement = $("#raw_output");

    $(".tablink").toggleClass("active", false);
    $("#" + tab).toggleClass("active", true);

    switch(tab){
        case "visual":
            wordCloudElement.toggleClass("active", true);
            rawOutputElement.toggleClass("active", false);
            break;
        case "raw":
            rawOutputElement.toggleClass("active", true);
            wordCloudElement.toggleClass("active", false);
            break;
        default:
    }
}

/*
respond to num of words being changed
 */
function numWordsChanged(value) {
    let numWordsInputElement = $("#num_word_input");
    let numWordsSliderElement = $("#num_word_slider");

    let max = numWordsSliderElement.attr("max");
    let min = numWordsSliderElement.attr("min");

    try {
        value = parseInt(value);
    }
    catch(err){
        value = max;
    }

    if(value > max) value = max;
    if(value < min) value = min;

    numWordsInputElement.val(value);
    numWordsSliderElement.val(value);
}

/*
return a string from the input box
 */
function getInputString(){
    return $("#input_text").val();
}

/*
get whether or not we are sorting alphabetically
 */
function getAlphaBool(){
    let alphaElement = $("#alpha_checkbox:checkbox:checked");
    let alpha = false;

    if(alphaElement.length > 0) alpha = true;

    return alpha;
}

/*
get whether or not we are sorting by count
 */
function getCountBool(){
    let alphaElement = $("#count_checkbox:checkbox:checked");
    let count = false;

    if(alphaElement.length > 0) count = true;

    return count;
}

function getFilterList(){
    let str = $("#filtered_text").val();
    return processFilterList(str);
}

function getStartString(){
    let start = $("#filter_string").val();
    return start;
}

function getMin(){
    let minElement = $("#min_count");
    let min = minElement.val();
    return min;
}

function getMax(){
    let maxElement = $("#max_count");
    let max = maxElement.val();
    return max;
}

function getCount(){
    let countElement = $("#num_word_slider");
    let count = countElement.val();
    return count;
}


/*
the actual logic for this application

Responds when the run button is hit
verifies input and executes logic
 */
function run(){
    let wordCloudElement = $("#wordCloud");
    let rawOutputElement = $("#raw_output");
    let width = wordCloudElement.width();
    let height = wordCloudElement.height();

    let input = getInputString();
    let alpha = getAlphaBool();
    let count = getCountBool();
    let filters = getFilterList();
    let start = getStartString();
    let min = getMin();
    let max = getMax();
    let maxCount = getCount();

    let m = processInput(input, alpha, count, filters, start);
    m = m.filter(o =>
        o.size >= min && o.size <= max
    );

    m = m.slice(0, maxCount);

    let raw = JSON.stringify(m).split("},{");

    rawOutputElement.empty();
    for(let i = 0; i < raw.length; i++){
        rawOutputElement.append("<p>" + raw[i] + "</p><br>")
    }

    //setup word cloud
    wordCloudElement.empty();

    d3.wordcloud()
        .selector('#wordCloud')
        .size([width, height])
        .words(m)
        .start();
}

