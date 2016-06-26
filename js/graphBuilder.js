function graphBuilder(){
  var width = 600,
      height = 400;

  var color = d3.scale.category20();

  var data = {
    "nodes":[
      {"name":"You","size":10,"color":"#e74c3c"}
    ],
    "links":[]
  }

  var svg = d3.select("#graphContainer").append("svg")
      .attr("id", "sociogramContainer")
      .attr("width", width)
      .attr("height", height);

  force = initForce(height, width, data, svg)

  d3.select('#createNewFriend').on('click', function() {
    if(force){
      force.stop();
    }

    var friendName = document.getElementById("friendName").value
    document.getElementById("friendName").value = "";

    data.nodes.push({"name": friendName,"size":5,"color":"blue"})
    var id = data.nodes.length - 1

      for(var i = 0; i < data.nodes.length - 1; i++){
          if(document.getElementById(i).checked == true){
            data.links.push({"source":parseInt(id),"target":i,"width":2,"length":100})
          }
      }

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "friendName";
    checkbox.id = id;
    checkbox.checked = true;

    var span = document.createElement('span')
    var label = document.createElement('label')
    label.htmlFor = id;
    label.appendChild(document.createTextNode(friendName + " "));

    span.appendChild(checkbox)
    span.appendChild(label)

    var container = document.getElementById("friendCheckboxes")
    container.appendChild(span);

    d3.select('#graphContainer *').remove();

    svg = d3.select("#graphContainer").append("svg")
        .attr("id", "sociogramContainer")
        .attr("width", width)
        .attr("height", height);

    force = initForce(height, width, data, svg);
  });
}

function initForce(height, width, data, svg){
  var force = d3.layout.force()
      .charge(-200)
      .linkDistance(200)
      .size([width, height]);

  parse(data, force, svg);

  return force
}

function parse(graph, force, svg){
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .distance(function(d) { return Math.round(100/d.width); })
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke", function(d) { return d.color; })
        .style("stroke-width", function(d) { return d.width; });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.size; })  .style("fill", function(d) { return d.color; })
        .call(force.drag);

    var texts = svg.selectAll("text.label")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class", "label")
      .attr("fill", "white")
      .text(function(d) {  return d.name;  });

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

    texts.attr("transform", function(d) {
      var x = d.x + 15;
      return "translate(" + x +  "," + d.y + ")";
    });
    });
}
