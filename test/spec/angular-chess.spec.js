'use strict';

describe('angular-chess', function () {
  var $scope;
  var $compile;
 
  beforeEach(module('nywton.chessboard'));
  beforeEach(module('nywton.chess'));
  
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
  }));
  
  it('should initialize the game correctly', function() {
    var element = $compile('<nywton-chessgame game="game" board="board"></nywton-chessgame>')($scope);
    
    $scope.$digest();

    expect($scope.board).toBeDefined();
    expect($scope.game).toBeDefined();
  });
  
});
