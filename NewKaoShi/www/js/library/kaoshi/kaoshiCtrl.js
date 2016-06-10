libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$stateParams',
function($scope,KaoshiServ,$stateParams){
		$scope.slideHasChanged=slideHasChanged;
		$scope.SelectAnswer = SelectAnswer;//单项选择答案
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.Back=Back;
		$scope.Estimate=Estimate;//确定评估
		$scope.serverdata=KaoshiServ.GetServerData();
		$scope.$on("$ionicView.loaded",function(){
			KaoshiServ.InitList($stateParams.history);
		})
		function slideHasChanged(index){
			KaoshiServ.slideHasChanged(index);
		}
		function SelectAnswer(parentindex,index) {
			//未完成
			KaoshiServ.SelectAnswer(parentindex,index);
		}
		//评估
		function Estimate(index){
			KaoshiServ.Estimate(index,$scope.questionScroe);
		}
		//上一题
		function LastTest(){
			KaoshiServ.LastTest();
		}
		//下一题
		function NextTest(){
			KaoshiServ.NextTest();
		}
		//返回
		function Back(){
			KaoshiServ.Back();
		}
		//交卷
		function Assignment(){
			KaoshiServ.Assignment();
		}
		
}])
.directive('choiceQuestion',[function(){
	return {
			restrict: 'E',
			templateUrl: "templates/paper/directive/choiceQuestion.html"
		}
}])
.directive('multiplechoiceQuestion',[function(){
	return {
			restrict: 'E',
			templateUrl: "templates/paper/directive/multiplechoiceQuestion.html"
		}
}])
.directive('caseQuestion',[function(){
	return {
			restrict: 'E',
			templateUrl: "templates/paper/directive/caseQuestion.html"
		}
}])