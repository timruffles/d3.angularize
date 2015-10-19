(function() {

var injectors = {};

/**
 * angularises the content of an element (either the existing
 * content or loaded template).
 *
 * ## options
 *
 * ```javascript
 * d3.select("body")
 * .selectAll("div")
 * .data([
 *   {title: "one"},
 *   {title: "two"},
 * ])
 * // you'd only want to call this on the enter selection as
 * // otherwise you'll have very confusing bugs
 * .enter()
 * .angularise(function(d, i) {
 *   return {
 *     // provide a injector name to create separate angular 'apps'
 *     // that have distinct digest loops.
 *     injector: "shared",
 *     // modules that your controller/template require
 *     modules: [],
 *     // either a function or a name defined within one of the modules of the injector
 *     controller: SomeCtrl,
 *     // local data for the controller, beyond $data, $index, $element and $scope
 *     locals: {
 *     },
 *   };
 * })
 *
 *
 */
d3.selection.prototype.angularise = function(fn) {
   this.each(function(d, i) {
     var el = this;
     var opts = fn.call(el, d, i);

     opts = opts || {};
     var localServices = {
       $element: angular.element(el),
       $data: d,
       $index: i,
     };

     for(var p in opts.locals) {
       localServices[p] = opts.locals[p];
     }

     var modules = ["ng"].concat((opts.modules || []).slice());
     
     console.log("each", i, d.name, modules);

     opts.injector = opts.injector || "default";
     var injector = injectors[opts.injector] || (injectors[opts.injector] = angular.injector(modules));

     injector.invoke(launch);
     
     function launch(
       $compile
       , $templateRequest
       , $q
       , $rootScope
       , $controller
     ) {
       console.log("launched!");

       getTemplate()
       .then(function(compileTarget) {

         var link = $compile(compileTarget);
         var scope = $rootScope.$new();

         if(compileTarget instanceof Element) {
           link(scope);
         } else {
           link(scope, function(compiled) {
             angular.element(el).append(compiled);
           });
         }

         if(opts.controller) {
           localServices.$scope = scope;
           var ctrl = $controller(opts.controller, localServices);
           scope[opts.controllerAs] = ctrl;
         }

       });
       
       function getTemplate() {
         if(opts.template) {
           return $q.when(template)
         } else if (opts.templateUrl) {
           return $templateRequest(opts.templateUrl)
         } else {
           return $q.when(el);
         }
       }
     }
   })


};
  
})();
