libraryModule
.controller("ResultCardCtrl",['$scope','ResultCardServ','$rootScope',
function($scope,ResultCardServ,$rootScope){
	$scope.GoExercise=GoExercise;//查看试题详细解析
	$scope.TestAgain=TestAgain;//重考
	function GoExercise(q_key){
		ResultCardServ.GoExercise(q_key);
	}
	function TestAgain(){
		ResultCardServ.TestAgain();
	}
}])
