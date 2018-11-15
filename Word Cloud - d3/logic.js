var yellow = d3.interpolateYlGn(0), // "rgb(255, 255, 229)"
    yellowGreen = d3.interpolateYlGn(0.5), // "rgb(120, 197, 120)"
    green = d3.interpolateYlGn(1); // "rgb(0, 69, 41)"

function successHandle (data) {
    console.log(data)
    var job_descriptions = ""
    data.forEach(function(d) {
        job_descriptions = job_descriptions.concat(" ", d.job_description)
        return job_descriptions
    })
    
    // change the string to lowercase
    var str = job_descriptions.toLowerCase()
    var wordCounter = {}
    var str_split = str.split(/[,' '/()-:\n|''""•·%]/)

    // cluster words together
    var newstr = []
    str_split.forEach(function(word) {
        word = word.replace("analysis", "analytic")
        word = word.replace("analyses", "analytic")
        word = word.replace("analytical", "analytic")
        word = word.replace("analyze", "analytic")
        word = word.replace("analyst", "analytic")
        word = word.replace("analytics", "analytic")
        word = word.replace("analytic", "analytics")
        word = word.replace("approaches", "approach")
        word = word.replace("projects", "project")
        word = word.replace("products", "product")
        word = word.replace("production", "product")
        word = word.replace("techniques", "Tech")
        word = word.replace("technology", "Tech")
        word = word.replace("technologies", "Tech")
        word = word.replace("technical", "Tech")
        word = word.replace("statistical", "statistics")
        word = word.replace("communicate", "communication")
        word = word.replace("communications", "communication")
        word = word.replace("teams", "team")
        word = word.replace("optimize", "optimization")
        word = word.replace("databases", "database")
        word = word.replace("datasets", "database")
        word = word.replace("helping", "help")
        word = word.replace("problems", "problem")
        word = word.replace("modelings", "model")
        word = word.replace("modeling", "model")
        word = word.replace("models", "model")
        word = word.replace("customers", "customer")
        word = word.replace("scientist", "science")
        word = word.replace("understanding", "understand")
        word = word.replace("building", "build")
        word = word.replace("management", "manage")
        word = word.replace("planning", "plan")
        word = word.replace("plans", "plan")
        word = word.replace("designing", "design")
        word = word.replace("engineering", "engineer")
        word = word.replace("experienced", "Exp")
        word = word.replace("experience", "Exp")
        word = word.replace("responsible", "responsibility")
        word = word.replace("responsibilities", "responsibility")
        word = word.replace("develops", "develop")
        word = word.replace("operational", "operations")
        word = word.replace("performing", "perform")
        word = word.replace("performance", "perform")
        word = word.replace("solving", "solve")
        word = word.replace("implementing", "implement")
        word = word.replace("implementation", "implement")
        word = word.replace("mathematical", "mathematics")
        word = word.replace("math", "mathematics")
        word = word.replace("growing", "grow")
        word = word.replace("growth", "grow")
        word = word.replace("sql", "SQL")
        word = word.replace("python", "Python")
        word = word.replace("•", "")
        newstr.push(word)
    })

    for (var i=0; i < newstr.length; i++){
        var word = newstr[i]
        if (word in wordCounter) {
            wordCounter[word] += 1
        }
        else {
            wordCounter[word] = 1
        }
    }

    newstr.forEach(function(word){
        if (word in wordCounter) wordCounter[word] += 1
        else wordCounter[word] = 1
    })

    newstr.reduce(function(acc, word){
        // console.log(`accumulator = ${Object.keys(wordCounter)}, current value = ${word}`)
        if (word in wordCounter) wordCounter[word] += 1
        else wordCounter[word] = 1
        return wordCounter
    }, {}) 

    function isInArray(value, array) {
        return array.indexOf(value) > -1
    }

    // Word Cloud 1: stop words
    Object.entries(wordCounter).forEach(function([key, value]){ 
        if(isInArray(key, stopswords)) {
            delete wordCounter[key]
        }
    })
    var divisor = parseInt(500)
    var numberOfKeywords = parseInt(350)

    // Word Cloud 2: target words
    // Object.entries(wordCounter).forEach(function([key, value]){ 
    //     if(!isInArray(key, target_words)) {
    //         delete wordCounter[key]
    //     }
    // })

    // var divisor = parseInt(80)
    // var numberOfKeywords = parseInt(15)
    
    
    // Draw the cloud
    var frequency_list = []
    var frequency = []
    Object.entries(wordCounter).forEach(function([key, value]) {
        frequency_list.push({"text": key, "size": parseInt(value)/divisor})
    })
    
    Object.entries(wordCounter).forEach(function([key, value]) {
        frequency.push(parseInt(value))
    })

    console.log(frequency_list[0])

    function compareNumbers(a, b){
        return b.size - a.size
    }

    frequency_list.sort(compareNumbers)
    console.log(frequency_list.slice(0, numberOfKeywords))

    // present as table
    frequency_list.slice(0, numberOfKeywords).forEach(function(d, i) {
        d3.select('tbody')
            .append('tr')
            .append('td').text(`${d.text}, ${d.size * divisor}`)
    })
    
    console.log(frequency_list.slice(numberOfKeywords, numberOfKeywords+1)[0]["size"])

    var color = d3.scale.linear()
            .domain([frequency_list.slice(numberOfKeywords, numberOfKeywords+1)[0]["size"]/divisor, d3.max(frequency)/divisor])
            .range(["brown", "steelblue"])
            .interpolate(d3.interpolateHcl)
    

    d3.layout.cloud().size([1000, 800])
            .words(frequency_list.slice(0, numberOfKeywords))
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

    function draw(words) {
        d3.select("body").append("svg")
                .attr("width", 800)
                .attr("height", 600)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(300,250)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
}

function errorHandle(error) {
    return console.warn(error)
}   