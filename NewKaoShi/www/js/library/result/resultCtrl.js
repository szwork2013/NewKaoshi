libraryModule
.controller('ResultCtrl',['$scope','ResultServ','$state',
function($scope,ResultServ,$state){
	var code=document.getElementById("kao_result");
	var height=document.documentElement.clientHeight/3*2;
	code.style.cssText = "height:" + height + "px";
	$scope.CheckAnswer=CheckAnswer;
	function CheckAnswer(){
		$state.go('resultCard');
		
	}
}])