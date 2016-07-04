libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$stateParams','$timeout',
function($scope,KaoshiServ,$stateParams,$timeout){
		$scope.slideHasChanged=slideHasChanged;
		$scope.SelectAnswer = SelectAnswer;//单项选择答案
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.Back=Back;
		$scope.Estimate=Estimate;//确定评估
		$scope.serverdata=KaoshiServ.GetServerData();
		$scope.question={
			Scroe:''
		}
		$scope.$on("$ionicView.loaded",function(){
			KaoshiServ.InitList($stateParams.history);
		})
		$scope.$on("$ionicView.enter",function(){
				SetHight();
		})
		function SetHight(){
			var doc=document.getElementsByClassName("kaoshi");
			var ele=doc[0].childNodes[0];
			var height=document.documentElement.clientHeight-86;
			ele.style.cssText="height:"+height+'px';
		}
		function slideHasChanged(index){
			KaoshiServ.slideHasChanged(index);
		}
		function SelectAnswer(parentindex,index) {
			//未完成
			KaoshiServ.SelectAnswer(parentindex,index);
		}
		//评估
		function Estimate(index){
			var code=$scope.question.Scroe;
			KaoshiServ.Estimate(index,code);
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