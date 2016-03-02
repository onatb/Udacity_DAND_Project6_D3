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

        var result = (survived / total) * 100;
        
        //Append the survival rate to the page
        svg.append("text")
          .attr("class", "mid-percent")
          .attr("text-anchor", "middle")
          .attr("dy", -45)
          .text(result.toFixed(2) + " %");

        svg.append("text")
          .attr("class", "mid-text")
          .attr("text-anchor", "middle")
          .attr("dy", -20)
          .text("of the selected passengers survived");
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
            .attr("dy", -80)
            .style("font-size", "12px")
            .text("Try Clicking Women, Children And Upper-class Passengers")
            .transition()
            .duration(2000)
            .style("opacity", 0)
            .remove();
          d.clicked = 0;
        }
        d3.select(".text-hover").remove();
        d3.select(".mid-percent").remove();
        d3.select(".mid-text").remove();
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

    function first_run (limbo) {
      // This function shows the story on page load

      var first_run_text = ["Although There Was Some Luck Involved In Surviving,", "Some Groups Of People", "Were More Likely To Survive Than Others,", "Try Clicking On Different Features", "Can You Figure Out", "Which Group Has The Highest Survival Rate ?"]
      var y = -75;
          
      // Show the story
      svg.selectAll(".first-run-text")
        .data(first_run_text)
        .enter()
        .append("text")
        .attr("class", "first-run-text")
        .attr("text-anchor", "middle")
        .attr("dy", function(d) {
          return y += 20;
        })
        .style("opacity", 0)
        .text(function(d) {
          return d
        })
        .transition()
        .duration(10000)
        .style("opacity", 100);
    }

    // Make a deep copy of olimbo so that these 2 will refer to different objects
    var limbo = JSON.parse(JSON.stringify(olimbo));
    
    //  Show story for a while then create the chart and remove the story
    first_run(limbo);

    setTimeout(function(){
      update_donut(limbo);
      d3.selectAll(".first-run-text")
        .transition()
        .duration(7500)
        .style("opacity", 0)
        .remove();
    }, 5000);

  }
  // Get the chart data
  d3.json("../data/titanic_initial.json", function(error, json) {
    if (error) 
      return console.warn(error);
    else
      get_olimbo(json);
  });
        
}