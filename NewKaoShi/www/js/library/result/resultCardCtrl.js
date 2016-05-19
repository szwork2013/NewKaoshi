libraryModule
.controller("ResultCardCtrl",['$scope','ResultCardServ','$rootScope',
function($scope,ResultCardServ,$rootScope){
	$scope.GoExercise=GoExercise;
	function GoExercise(q_key){
		ResultCardServ.GoExercise(q_key);
	}
}])
