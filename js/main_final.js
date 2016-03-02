/*
There are two data sources:
1- "titanic.csv" data, is the main dataset including survival and demographic info. Stored in var "titanic_data"
2- "titanic.json" data,  is a helper dataset and stores chart info. This data is Stored in variables olimbo and limbo
  + "olimbo" is the original data, used for getting default settings
  + "limbo" is a deep copy of olimbo and all kind of changes are done in "limbo"
*/

function visualizer(titanic_data) {
  // This function gets the 'titanic.csv' data

  function get_olimbo(olimbo) {
    //This function gets the 'titanic.json' data
    
    // ### D3 chart setup ###     
    var screenWidth = window.innerWidth;

    var margin = {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20
        },
        width = Math.min(screenWidth, 500) - margin.left - margin.right,
        height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

    var svg = d3.select("#chart").append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
      .append("g").attr("class", "wrapper")
      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    var arc = d3.svg.arc()
      .innerRadius(width * 0.9 / 2)
      .outerRadius(width * 0.9 / 2 + 30);

    var pie = d3.layout.pie()
      .value(function(d) {
        return 30;
      })
      .padAngle(.01)
      .sort(null);
    // ### D3 chart setup ###

    // control variable, tracks whether user finds 100% survival rate
    var hundred = 0;

    //######### Added this inner_donut function after the first project review #########
    
    function inner_donut (results) {
      //This function displays another donut chart inside the outer one

      //Append the survival rate to the page
      var result = 0;

      results.forEach(function(d) {
        if(d.disp === "Survived")
          result = d.percent;
      });

      function fill_color (result) {
        if(result <= 55) return "#92D288";
        else if(result <= 80) return "#47A447";
        else return "#116F31";
      }
      
      svg.append("text")
        .attr("class", "mid-percent")
        .attr("text-anchor", "middle")
        .attr("dy", -45)
        .style("fill", fill_color(result))
        .text(result + " %");

      svg.append("text")
        .attr("class", "mid-text")
        .attr("text-anchor", "middle")
        .attr("dy", -20)
        .style("fill", fill_color(result))
        .text("of the selected passengers survived");

      // Help user find the max survival ratio by giving some hints according to their rate
      var hint = ["", "Have you tried adding 'Female' and 'Class 1' ?", "Try more features, you will find the 100% soon", "Great job! So close to 100%. Have you tried adding '1 Parch'?", "Well Done!"];

      svg.append("text")
        .attr("class", "mid-hint")
        .attr("text-anchor", "middle")
        .attr("dy", 10)
        .text(function() {
          if(hundred === 0) {
            if(result <= 55) return hint[1];
            else if(result <= 80) return hint[2];
            else if(result <=99) return hint[3];
            else return hint[4];
          } else
            return hint[0];
        });

        // If user finds the 100% survival ratio, don'show hints anymore
        if(result === "100.00") hundred =1;
        debugger;

      // Add a visual representation of the percent number. 
      //In this case add another donut chart that actually shows the percents in graph
      var inner_arc = d3.svg.arc()
        .innerRadius(width * 0.9 / 2.5)
        .outerRadius(width * 0.9 / 2.5 + 15);

      var inner_pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
          return d.freq;
        });

      svg.selectAll(".inner-arc")
        .data(inner_pie(results))
        .enter().append("path")
        .attr("class", "inner-arc")
        .attr("id", function(d, i) {
          return "innerArc_" + i;
        })
        .attr("d", inner_arc)
        .style("fill", function(d) {
          if(d.data.disp === "Survived") return fill_color(result);
          else return "#cccccc";
        });

      svg.selectAll(".inner-text")
        .data(results)
        .enter().append("text")
        .attr("class", "inner-text")
        .attr("x", 150) //Move the text from the start angle of the arc
        .attr("dy", 12) //Move the text down
        .append("textPath")
        .attr("xlink:href", function(d, i) {
          return "#innerArc_" + i;
        })
        .text(function(d) {
          return d.disp;
        });
    }

    function calculate_percent (titanic_data, limbo) {
      // This function calculates the survival rate and appends the percent to the page

      var query_string_survived = "person.survived === '1'",
          query_string_total = "";
      
      // Find all clicked items and calculate the survival rate
      for(var i = 0; i < limbo.length; i++) {
        if(limbo[i].clicked === 1) {
          query_string_survived += " && " + limbo[i].query_string;
          query_string_total += " && " + limbo[i].query_string;
        }
      }
      query_string_total = query_string_total.slice(4, query_string_total.length);
      
      var survived = 0,
          total = 0;
           
      titanic_data.forEach(function(person) {
        // eval() is only used in "Read–eval–print" loop as Google style guide stated
        if(eval(query_string_survived))
          survived += 1;
        if(eval(query_string_total))
          total += 1;
      });
      if(total !== 0) {

        var percent = (survived / total) * 100;
        percent = percent.toFixed(2);

        inner_donut([{"disp": "Survived", "freq": survived, "percent": percent},
                {"disp": "Died", "freq": total - survived, "percent": 1 - percent}]);
      }
    }

    function id_finder (limbo, i) {
      // This function finds the id of the given object in 'limbo'
    
      for(var j = 0; j < limbo.length; j += 1) {
        if(limbo[j]["id"] === i) 
          return j;
      }
    }

    function update_elements (d, limbo, type) {
      // If user clicks on an item, this function handles feature additions and deletions by 

      // If user clicks on a focused item, remove focus and update the chart
      if(type === "add") {
        d.clicked = 0;
        d3.select(".mid-percent").remove();
        d3.select(".mid-text").remove();
        d3.select(".mid-hint").remove();

        d3.selectAll(".inner-arc").remove();
        d3.selectAll(".inner-text").remove();

        var ix = id_finder(limbo, d["id"]);
        var features = [];
        
        d.range.forEach(function(i) {
          features.push(olimbo[i]);
        });
        limbo.splice(ix, 1);
        for(var j = features.length-1; j >= 0; j--) {
          limbo.splice(ix, 0, features[j]);
        }

      // If user clicks on an item, focus on it and delete the necessary things
      } else {

        // If user wants some hint, show the necessary things for a while and then remove its focus
        if(d["id"] === 0) {
          svg.append("text")
            .attr("class", "best-text")
            .attr("text-anchor", "middle")
            .attr("dy", -85)
            .text("Try Women, Children And Upper-class")
            .transition()
            .duration(4000)
            .style("opacity", 0)
            .remove();
          d.clicked = 0;
        }
        d3.select(".text-hover").remove();
        d3.select(".mid-percent").remove();
        d3.select(".mid-text").remove();
        d3.select(".mid-hint").remove();

        d3.selectAll(".inner-arc").remove();
        d3.selectAll(".inner-text").remove();

        d.on_click_remove.forEach(function(i) {
          limbo.splice(id_finder(limbo, i), 1);
        });
      }
      d3.selectAll(".listArc").remove();
      d3.selectAll(".listText").remove();
      update_donut(limbo);
      calculate_percent(titanic_data, limbo);
    }

    function update_donut (limbo) {
      // This function draws and updates the chart

      // First append some arcs and paths
      svg.selectAll(".listArc")
        .data(pie(limbo))
        .enter().append("path")
        .attr("class", "listArc")
        .attr("id", function(d) {
          return "listArc_" + d.data.id;
        })
        .attr("d", arc)
        .style("fill", function(d) {
          if(d.data.clicked === 1)
              return d.data.color_click
        })
        // If user hovers on an arc, show its explanation
        .on("mouseover", function(d) {
          if(d.data.clicked === 0) {
            d3.select(this).style("fill", d.data.color_hover);
            svg.append("text")
              .attr("class", "text-hover")
              .attr("text-anchor", "middle")
              .attr("dy", 95)
              .text(d.data.desc_hover);
          }
        })
        .on("mouseout", function(d) {
          if (d.data.clicked === 0) {
            d3.select(this).style("fill", "white");
            d3.select(".text-hover").remove();
          }
        })
        .on("click", function(d) {
          if(d.data.clicked === 0) {
            d.data.clicked = 1;
            d3.select(this)
              .style("fill", d.data.color_click);
            update_elements(d.data,limbo, "remove");
          } else {
            update_elements(d.data,limbo, "add");
          }
        });

      // Append some text insede arcs and bound these texts to paths
      svg.selectAll(".listText")
        .data(limbo)
        .enter().append("text")
        .attr("class", "listText")
        .attr("x", 11) //Move the text from the start angle of the arc
        .attr("dy", 18) //Move the text down
        .append("textPath")
        .attr("xlink:href", function(d) {
          return "#listArc_" + d.id;
        })
        .text(function(d) {
          return d.disp;
        })
        // If user hovers on a text, show its explanation
        .on("mouseover", function(d) {
          if(d.clicked === 0) {
            d3.select(d3.select(this).attr("href")).style("fill", d.color_hover);
            svg.append("text")
              .attr("class", "text-hover")
              .attr("text-anchor", "middle")
              .attr("dy", 95)
              .text(d.desc_hover);
          }
        })
        .on("mouseout", function(d) {
          if (d.clicked === 0) {
            d3.select(d3.select(this).attr("href")).style("fill", "white");
            d3.select(".text-hover").remove();
          }
        })
        .on("click", function(d) {
          if(d.clicked === 0) {
            d.clicked = 1;
            d3.select(d3.select(this).attr("href"))
              .style("fill", d.color_click);
            update_elements(d, limbo, "remove");
          } else { 
            update_elements(d, limbo, "add");
          }
        });
    }

    // Make a deep copy of olimbo so that these 2 will refer to different objects
    var limbo = JSON.parse(JSON.stringify(olimbo));
    
    update_donut(limbo);
  }

  // Get the chart data
  d3.json("../data/titanic_final.json", function(error, json) {
    if (error) 
      return console.warn(error);
    else
      get_olimbo(json);
  });
        
}