libraryModule
.controller('ResultCtrl',['$scope','ResultServ','$state',
function($scope,ResultServ,$state){
	/*var code=document.getElementById("kao_result");
	var height=document.documentElement.clientHeight/3*2;
	code.style.cssText = "height:" + height + "px";*/
	$scope.CheckAnswer=CheckAnswer;
	$scope.GoPaperDeatail=GoPaperDeatail;
	$scope.TestAgain=TestAgain;
	$scope.serverdata=ResultServ.GetServerdata();
	$scope.$on("$ionicView.enter",function(){
		ResultServ.InitData();
	})
	function CheckAnswer(){
		ResultServ.CheckAnswer();
		
	}
	function GoPaperDeatail(){
		ResultServ.GoPaperDeatail();
	}
	function TestAgain(){
		ResultServ.TestAgain();
	}
}])