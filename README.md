# d3.angularize

angularizes the content of an element (either the existing
content or loaded template).

## options

```javascript
d3.select("body")
.selectAll("div")
.data([
  {title: "one"},
  {title: "two"},
])
// you'd only want to call this on the enter selection as
// otherwise you'll have very confusing bugs
.enter()
.angularize(function(d, i) {
  return {
    // provide a injector name to create separate angular 'apps'
    // that have distinct digest loops.
    injector: "shared",
    // modules that your controller/template require
    modules: [],
    // either a function or a name defined within one of the modules of the injector
    controller: SomeCtrl,
    // local data for the controller, beyond $data, $index, $element and $scope
    locals: {
    },
  };
})

