libraryModule
.factory("ResultCardServ",['$rootScope','$state',
function($rootScope,$state){
	
	var server={
		GoExercise:GoExercise
	}
	return server;
	//进入答案解析
	function GoExercise(q_key){
		$state.go('exercise',{
			history:false,
			type:1,
			qKey:q_key
		})
	}
}])