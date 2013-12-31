(function(){
// 'use strict';

/**
 * @ngdoc directive
 * @name ui.grid.style.directive:uiGridStyle
 * @element style
 * @restrict A
 *
 * @description
 * Allows us to interpolate expressions in `<style>` elements. Angular doesn't do this by default as it can/will/might? break in IE8.
 *
 * @example
   <doc:example module="app">
    <doc:source>
      <script>
        var app = angular.module('app', ['ui.grid']);
       
        app.controller('MainCtrl', ['$scope', function ($scope) {
          $scope.myStyle = '.blah { border: 1px solid }';
        }]);
      </script>
     
      <div ng-controller="MainCtrl">
        <style ui-grid-style>{{ myStyle }}</style>
        <span class="blah">I am in a box.</span>
      </div>
    </doc:source>
    <doc:scenario>
      it('should apply the right class to the element', function () {
        element(by.css('.blah')).getCssValue('border')
          .then(function(c) {
            expect(c).toContain('1px solid');
          });
      });
    </doc:scenario>
   </doc:example>
 */

var app = angular.module('ui.grid.style', []);

app.directive('uiGridStyle', ['$log', '$interpolate', function($log, $interpolate) {
  return {
    // restrict: 'A',
    // priority: 1000,
    require: '?^uiGrid',
    link: function(scope, element, attrs, uiGridCtrl) {
      $log.debug('ui-grid-style link');

      var interpolateFn = $interpolate(element.text(), true);

      if (interpolateFn) {
        scope.$watch(interpolateFn, function(value) {
          element.text(value);
        });
      }

      if (uiGridCtrl) {
        uiGridCtrl.styleComputions.push(function() {
          var width = uiGridCtrl.grid.gridWidth;
          var equalWidth = width / scope.options.columnDefs.length;

          var ret = '';
          var left = 0;
          angular.forEach(scope.options.columnDefs, function(c, i) {
            ret = ret + ' .grid' + scope.gridId + ' .col' + i + ' { width: ' + equalWidth + 'px; left: ' + left + 'px; }';
            left = left + equalWidth;
          });

          scope.columnStyles = ret;
        });

        uiGridCtrl.styleComputions.push(function() {
          var offset = 0;
          var rowHeight = scope.options.rowHeight;

          var ret = '';
          for (var i = 1; i < Math.max(scope.options.maxVisibleRowCount || 0, uiGridCtrl.minRowsToRender() || 0); i++) {
            ret = ret + ' .grid' + scope.gridId + ' .ui-grid-row:nth-child(' + i + ') { top: ' + offset + 'px; }';
            offset = offset + rowHeight;
          }

          scope.rowStyles = ret;
        });
      }
    }
  };
}]);

})();