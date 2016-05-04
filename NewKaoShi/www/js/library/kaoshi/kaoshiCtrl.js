libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$state','$rootScope','$ionicSlideBoxDelegate','$stateParams',
function($scope,KaoshiServ,$state,$rootScope,$ionicSlideBoxDelegate,$stateParams){
		$scope.slideHasChanged=slideHasChanged;
		$scope.SelectAnswer = SelectAnswer;//单项选择答案
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.$on("$ionicView.loaded",function(){
			KaoshiServ.GeTQuestionList();
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
		//交卷
		function Assignment(){
			$state.go('answerCard');
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