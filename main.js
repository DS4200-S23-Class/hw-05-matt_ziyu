(function(){
	console.log("linked");
})();
// Function to get the coordinates of the last point clicked 
function clickPoint(){
	this.classList.toggle("circle-click");
	var x = (this.getAttribute('cx') - MARG.right) / VIS_WIDTH * 9
	var y = ((HEIGHT - this.getAttribute('cy')) - MARG.bottom ) / (VIS_HEIGHT / 9)
	document.getElementById("cord").innerHTML = "The point last clicked is at "+"(" + x +","+ Math.round(y)+")";
}
// It tells all the circles when its clicked to show the coordinates of the point
function setup() {
	var list_cir = document.getElementsByClassName("circle");
	for (i = 0; i<list_cir.length; i++){
		list_cir[i].addEventListener("click",clickPoint);
	};
}
setup();

// First, we need a frame  
const WIDTH = 600;
const HEIGHT = 600;
const MARG = {left : 50, right : 50, top : 50, bottom : 50};

const FRAME1 = 
d3.select("#vis0")
    .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("id", "svg1");

const VIS_HEIGHT = HEIGHT- MARG.top - MARG.bottom;
const VIS_WIDTH = WIDTH - MARG.left - MARG.right;


d3.csv("data/scatter-data.csv").then((data) => { 

    // d3.csv parses a csv file 
    // .then() passes the data parsed from the file to a function
    // in the body of this function is where you will build your 
    // vis 
  
    // let's check our data
    console.log(data); //Notice this data has 3 columns
    // add our circles with styling 

      // find max X
    const MAX_X = 9;
    const MAX_Y = 9;
  // Note: data read from csv is a string, so you need to
  // cast it to a number if needed 

// Define scale functions that maps our data values 
// (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_X)]) // add some padding  
            .range([0, VIS_WIDTH]);
    const Y_SCALE = d3.scaleLinear() 
            .domain([0, (MAX_Y)]) // add some padding  
            .range([0, -VIS_HEIGHT]); 
    console.log(data)
    var svg0 = d3.select("#svg1");

    svg0.selectAll("circle") 
        .data(data) // this is passed from  .then()
        .enter()  
        .append("circle")
          .attr("cx", (d) => { return d.x * VIS_WIDTH / 9 + MARG.left; }) // use x for cx
          .attr("cy", (d) => { return VIS_HEIGHT + MARG.top - d.y * VIS_HEIGHT / 9; }) // use y for cy
          .attr("r", 12)  // set r 
          .attr("fill", (d) => { return d.color; }) // fill by color
          .attr("class", "circle");
    svg0.append("g") 
          .attr("transform", "translate(" + MARG.left + 
                "," + (VIS_HEIGHT + MARG.top) + ")") 
          .call(d3.axisBottom(X_SCALE)) 
            .attr("font-size", '20px'); 
    svg0.append("g") 
          .attr("transform", "translate(" + MARG.left + 
                  "," + (VIS_HEIGHT + MARG.top) + ")") 
            .call(d3.axisLeft(Y_SCALE))
            .attr("font-size", '20px') ; 
    setup();
  });

setup();
// Function to get the coordinates of the last point clicked 

//Function that adds the point whenever a user creates one from the website
function addPoint(){
const MAX_X = 9;
const MAX_Y = 9;
const X_SCALE = d3.scaleLinear() 
    .domain([0, 9]) // add some padding  
    .range([0, VIS_WIDTH]);
const Y_SCALE = d3.scaleLinear() 
    .domain([0, 9]) // add some padding  
    .range([0, VIS_HEIGHT]); 
var vx = document.getElementById("x_cord").options[document.getElementById("x_cord").selectedIndex].value;
var vy = document.getElementById("y_cord").options[document.getElementById("y_cord").selectedIndex].value;
//var myCircle = document.createElementNS(document.getElementById("List"),"circle"); //to create a circle. for rectangle use "rectangle"
    var myCircle = document.createElementNS('http://www.w3.org/2000/svg',"circle"); //to create a circle. for rectangle use "rectangle"
   //Change the x,y coordinates to the scale of the graph
	myCircle.setAttributeNS(null,"cx",vx * VIS_WIDTH / 9 + MARG.left);
    myCircle.setAttributeNS(null,"cy",VIS_HEIGHT + MARG.top - vy * VIS_HEIGHT / 9);
    myCircle.setAttributeNS(null,"r",12);
    myCircle.setAttributeNS(null,"class","circle");
    document.getElementById("svg1").appendChild(myCircle)
    console.log(myCircle);
    setup();
}
//Whenever the button is clicekd we call add point to add it to the graph
document.getElementById("Add")
		.addEventListener('click', addPoint);
const FRAME = 
d3.select("#vis1")
    .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("id", "svg2");
function main(){
    var svg = d3.select("#svg2")

    var X_SCALE = d3.scaleBand().range([0, VIS_WIDTH]).padding(0.4),
        Y_SCALE =  d3.scaleLinear().range([VIS_HEIGHT - 50,0]);

    var g = svg.append("g").attr("transform", "translate(" +100+","+100+")");

    d3.csv("data/bar-data.csv").then(function(data){
        X_SCALE.domain(data.map((d)=>{return d.category;}));
        Y_SCALE.domain([0,d3.max(data, (d)=> {return d.amount;})]);
        g.append("g").attr('transform','translate(0,' + (VIS_HEIGHT - 50) + ')')
            .call(d3.axisBottom(X_SCALE))

        g.append('g').call(d3.axisLeft(Y_SCALE).tickFormat((d)=>{
            return d;
        }).ticks(8));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class","bar")
        .attr("x", (d) => {return X_SCALE(d.category);})
        .attr("y", (d) => {return Y_SCALE(d.amount)})
        .attr("width", X_SCALE.bandwidth())
        .attr("height", (d) => {return VIS_HEIGHT - Y_SCALE(d.amount) -50;});

    // Tooltip

     // To add a tooltip, we will need a blank div that we 
    //  fill in with the appropriate text. Be use to note the
    //  styling we set here and in the .css
    const TOOLTIP = d3.select("#vis1")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
    }
    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Name: " + d.category + "<br>Value: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                          // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }
    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 
    // Add event listeners
    g.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    

    // Add an axis to the vis  
    g.append("g") 
          .attr("transform", "translate(" + MARG.left + 
                "," + (VIS_HEIGHT + MARG.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(4)) 
            .attr("font-size", '20px'); 
    });

    
} ;