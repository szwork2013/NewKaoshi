libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$stateParams',
function($scope,KaoshiServ,$stateParams){
		$scope.slideHasChanged=slideHasChanged;
		$scope.SelectAnswer = SelectAnswer;//单项选择答案
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.Back=Back;
		$scope.$on("$ionicView.loaded",function(){
			KaoshiServ.InitList($stateParams.history);
			KaoshiServ.InitTime(0);
		})
		$scope.$on("$ionicView.enter",function(){
			$scope.serverdata=KaoshiServ.GetServerData();
			
		})
		function slideHasChanged(index){
			KaoshiServ.slideHasChanged(index);
		}
		function SelectAnswer(parentindex,index) {
			//未完成
			KaoshiServ.SelectAnswer(parentindex,index);
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