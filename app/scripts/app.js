'use strict';

angular.module('nywton.chess.app', ['nywton.chess'])

.config(['nywtonChessboardConfigProvider', function nywtonChessConfigConfig(chessboardProvider) {
  chessboardProvider.pieceTheme('../bower_components/chessboard.js/img/chesspieces/wikipedia/{piece}.png');
}])

.controller('BodyCtrl', [function() {

}])

.directive('chessgameDebug', [function () {
  var directive = {
    restrict: 'A',
    priority: 1,
    scope : {
      game: '=chessgameDebug',
    },
    template: '<div>' +
     '<button type="button" data-ng-click="_debug = !_debug">show debug</button>' +
     '<div class="game-debug-container" data-ng-show="_debug">' +
       '<span class="label label-info">game {{game.name}}</span>' +
       '<p><code>game_over()? {{game.game_over()}}</code></p>'+
       '<p><code>fen()? {{game.fen()}}</code></p>'+
       '<p><code>history()? {{game.history()}}</code></p>'+
       '<p><code>in_check()? {{game.in_check()}}</code></p>'+
       '<p><code>in_checkmate()? {{game.in_checkmate()}}</code></p>'+
       '<p><code>in_stalemate()? {{game.in_stalemate()}}</code></p>'+
       '<p><code>in_draw()? {{game.in_draw()}}</code></p>'+
       '<p><code>in_checkmate()? {{game.in_checkmate()}}</code></p>'+
       '<p><code>in_threefold_repetition()? {{game.in_threefold_repetition()}}</code></p>'+
       '<p><code>insufficient_material()? {{game.insufficient_material()}}</code></p>'+
       '<p><code>moves()? {{game.moves()}}</code></p>'+
       '<p><pre style="font-size: 0.7em">{{game.ascii()}}</pre></p>'+
     '</div>' +
   '</div>',
  };
  
  return directive;
}]);

