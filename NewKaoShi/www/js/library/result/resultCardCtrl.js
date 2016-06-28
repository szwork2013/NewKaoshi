libraryModule
.controller("ResultCardCtrl",['$scope','ResultCardServ','$rootScope','$stateParams',
function($scope,ResultCardServ,$rootScope,$stateParams){
	$scope.GoExercise=GoExercise;//查看试题详细解析
	$scope.TestAgain=TestAgain;//重考
	
	$scope.serverdata=ResultCardServ.GetServerData();
	$scope.$on('$ionicView.loaded',function(){
		ResultCardServ.InitData($stateParams.type);
	})
	$scope.$on('$ionicView.leave',function(){
		ResultCardServ.Destory();
	})
	function GoExercise(q_key){
		ResultCardServ.GoExercise(q_key);
	}
	function TestAgain(){
		ResultCardServ.TestAgain();
	}
}])
