(function() {
"use strict";

var injectors = {};

/**
 * angularizes the content of an element (either the existing
 * content or loaded template).
 *
 * ## options

 * // provide a injector name to create separate angular 'apps'
 * // that have distinct digest loops.
 * injector: "shared",
 *
 * // modules that your controller/template require
 * modules: [],
 *
 * // either a function or a name defined within one of the modules of the injector
 * controller: SomeCtrl,
 *
 * // local data for the controller, beyond $data, $index, $element and $scope
 * locals: {
 * },
 *
 */
d3.selection.prototype.angularize = function(fn) {

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
   
   opts.injector = opts.injector || "default";

   if(typeof opts.injector === "string") {
     var injector = injectors[opts.injector] || 
       (injectors[opts.injector] = angular.injector(modules));
   } else {
     var injector = opts.injector;
   }

   injector.invoke(launch);
   
   function launch(
     $compile
     , $templateRequest
     , $q
     , $rootScope
     , $controller
   ) {

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
