
app.directive('formElement', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label : "@",
            model : "="
        },
        link: function(scope, element, attrs) {
            scope.disabled = attrs.hasOwnProperty('disabled');
            scope.required = attrs.hasOwnProperty('required');
            scope.pattern = attrs.pattern || '.*';
        },
        template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" >  {{label}}</label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
      };
        
});

app.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});

app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }      
});
app.directive('animateOnChange', function($animate) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
              var c = 'change-up';
              $animate.addClass(elem,c, function() {
              $animate.removeClass(elem,c);
          });
        }
      });  
  }  
});


angular.module('app').directive('strongSecret', function() {
    return {

      // limit usage to argument only
      restrict: 'A',

      // require NgModelController, i.e. require a controller of ngModel directive
      require: 'ngModel',

      // create linking function and pass in our NgModelController as a 4th argument
      link: function(scope, element, attr, ctrl) {

    // please note you can name your function & argument anything you like
         function customValidator(ngModelValue) {
        
        // check if contains uppercase
        // if it does contain uppercase, set our custom `uppercaseValidator` to valid/true
        // otherwise set it to non-valid/false
        if (/[A-Z]/.test(ngModelValue)) {
            ctrl.$setValidity('uppercaseValidator', true);
        } else {
            ctrl.$setValidity('uppercaseValidator', false);
        }

        // check if contains number
        // if it does contain number, set our custom `numberValidator`  to valid/true
        // otherwise set it to non-valid/false
        if (/[0-9]/.test(ngModelValue)) {
            ctrl.$setValidity('numberValidator', true);
        } else {
            ctrl.$setValidity('numberValidator', false);
        }

        // check if the length of our input is exactly 6 characters
        // if it is 6, set our custom `sixCharactersValidator` to valid/true
        // othwise set it to non-valid/false
        if (ngModelValue.length === 6) {
            ctrl.$setValidity('sixCharactersValidator', true);
        } else {
            ctrl.$setValidity('sixCharactersValidator', false);
        }

        // we need to return our ngModelValue, to be displayed to the user(value of the input)
        return ngModelValue;
    }

    // we need to add our customValidator function to an array of other(build-in or custom) functions
    // I have not notice any performance issues, but it would be worth investigating how much
    // effect does this have on the performance of the app
    ctrl.$parsers.push(customValidator);
    
}
    };
});