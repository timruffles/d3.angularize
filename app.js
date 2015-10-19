/**
 * demo using d3, d3.angularise()
 */
angular.module("demo", [])
.controller("DemoCtrl", DemoCtrl)
.directive("integerValue", function() {
  return {
    require: "ngModel",
    link: function(scope, el, attrs, ngModel) {
      ngModel.$parsers.push(Math.round);
    },
  } 
})

main();

function main() {

  var data = [
    {
      name: "one",
      value: 100,
    },
    {
      name: "two",
      value: 100,
    },
  ];

  var PADDING = 10;
  var r = innerWidth / data.length / 2 - PADDING;

  var scales = {
    fill: d3.scale.category20b(),
  }

  var root = d3.select("body")
  .append("svg")
  .attr({
    width: innerWidth,
    height: innerHeight,
  })

  render();

  function render() {
    var update = root
    .selectAll("g")
    .data(data, function(d) {
      return d.name; 
    })

    var enter = update.enter()
    .append("g")

    enter
    .append("circle")

    update.select("circle")
    .attr("r", function(d) {
      return r * (d.value / 100);
    })
    .attr("cx", getX)
    .attr("cy", r)
    .attr("fill", function(d, i) {
      return scales.fill(i);
    })

    enter
    .append("foreignObject")
    .attr({
      width: r,
      height: r,
    })
    .attr("x", function(d, i) {
      return r/2 + i * 2 * (r + PADDING);
    })
    .attr("y", r/2)
    .append("xhtml:body")
    .angularise(function(d, i) {
      return {
        locals: {
          $render: render,
        },
        templateUrl: "/template.html",
        injector: "demo" + i,
        controller: DemoCtrl,
        controllerAs: "ctrl",
        modules: ["demo"],
      }
    })
  }



  function getX(d, i) {
    return r + (i * 2 * (r + PADDING)); 
  }
}

function DemoCtrl(
  $data
  , $scope
  , $render
) {
  var self = this;

  this.name = $data.name;
  this.lastDigest;
  this.totalDigests = 0;
  
  this.data = $data;

  this.updated = function() {
    $render(); 
  }

  $scope.$watch(function() {
    setTimeout(function() {
      self.lastDigest = Date.now();
      self.totalDigests += 1;
    });
  })

}
