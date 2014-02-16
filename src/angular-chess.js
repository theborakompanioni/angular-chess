(function () {
  'use strict';
  
  angular.module('nywton.chess', ['nywton.chessboard'])
  
  
  .service('NywtonChessGameService', ['$log', function ChessGameService($log) {
    this.onDragStart = function(game, source, piece, position, orientation) {
      $log.debug('lift piece ' + piece + ' from ' + source + ' - ' + position + ' - ' + orientation);
      if (game.game_over() === true ||
          (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
      }
      return true;
    };
  
    this.onDrop = function(game, source, target) {
      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null) {
        $log.log('Illegal move.. cannot move from ' + source + ' to ' + target);
        return 'snapback';
      }
      
      $log.debug('moved from ' + source + ' to ' + target);
    };
    
    this.onSnapEnd = function(game, board, source, target, piece) {
      $log.debug('onSnapEnd ' + piece + ' from ' + source + ' to ' + target);
      // update the board position after the piece snap 
      // for castling, en passant, pawn promotion
      board.position(game.fen());
    };
  }])

  .directive('chessgame', ['$window','$log', 'NywtonChessGameService', function($window, $log, ChessGameService) {

    var directive = {
      restrict: 'E',
      template: '<div>' +
        '<chessboard board="board" on-change="onChange" on-drag-start-cb="onDragStart" on-snap-end="onSnapEnd" on-drop="onDrop"></chessboard>' +
      '</div>',
      replace:false,
      scope : {
        'name': '@',
        'game': '=',
        'board': '=',
      },
      controller: ['$scope', function chessgame($scope) {
        var game = $scope.game = new $window.Chess();
        game.name = $scope.name || 'game' + $scope.$id;
        
        $scope.onDragStart = function onDragStartF(source, piece, position, orientation) {
          $log.debug('onDragStart ' + source + ',' + piece + ',' + position + ',' + orientation);
          var rtn = ChessGameService.onDragStart($scope.game, source, piece, position, orientation);
          $scope.$parent.$digest();
          return rtn;
        };
        $scope.onSnapEnd = function onSnapEndF(source, target, piece) {
          $log.debug('onSnapEnd ' + source + ',' + target + ',' + piece);
          var rtn = ChessGameService.onSnapEnd($scope.game, $scope.board);
          $scope.$parent.$digest();
          return rtn;
        };
        $scope.onDrop = function onDropF(source, target) {
          $log.debug('onDrop ' + source + ',' + target);
          var rtn = ChessGameService.onDrop($scope.game, source, target);
          $scope.$parent.$digest();
          return rtn;
        };
        $scope.onChange = function onChangeF(oldPosition, newPosition) {
          $log.debug('onChange ' + oldPosition + ',' + newPosition);
          $scope.$parent.$digest();
        };
      }],
    };
    
    return directive;
  }])

  .directive('chessgameDebug', [function () {
    var directive = {
      restrict: 'A',
      priority: 1,
      scope : {
        game: '=chessgameDebug',
      },
      template: '<div>' +
       '<button class="btn btn-xs" data-ng-click="_debug = !_debug">show debug</button>' +
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
  }])

  .directive('allowOnlyLegalMoves', ['$window','$log', 'NywtonChessGameService', function($window, $log, ChessGameService) {

    var directive = {
      restrict: 'A',
      priority: 1,
      require: 'chessboard',
      controller: ['$scope', function chessgame($scope) {
        $scope.game = new $window.Chess();
      }],
      link: function link($scope, $element, $attrs, $ctrl) {
        var onDragStart = function onDragStartF(source, piece, position, orientation) {
          var rtn = ChessGameService.onDragStart($scope.game, source, piece, position, orientation);
          $scope.$digest();
          return rtn;
        };
        var onSnapEnd = function onSnapEndF(source, target, piece) {
          var board = $ctrl.board();
          var rtn = ChessGameService.onSnapEnd($scope.game, board, source, target, piece);
          $scope.$digest();
          return rtn;
        };
        var onDrop = function onDropF(source, target) {
          var rtn = ChessGameService.onDrop($scope.game, source, target);
          $scope.$digest();
          return rtn;
        };
        var onChange = function onChangeF() {
          $log.debug('onChange in allowOnlyLegalMoves');
          $scope.$digest();
        };
        
        $ctrl.config_push(['onDragStart', onDragStart]);
        $ctrl.config_push(['onSnapEnd', onSnapEnd]);
        $ctrl.config_push(['onDrop', onDrop]);
        $ctrl.config_push(['onChange', onChange]);
      },
    };
    
    return directive;
  }])
  
  ;

})();