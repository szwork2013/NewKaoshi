libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$state','$rootScope','$ionicSlideBoxDelegate','$stateParams',
function($scope,KaoshiServ,$state,$rootScope,$ionicSlideBoxDelegate,$stateParams){
	$scope.lists = [{
			type: 0, //0表示单选题
			title: "1.（单选题）是衡量银行资产质量的最重要指标",
			answer:"资产利率的作用资产利率的作用资产利率的作用资产",
			analy:"是衡量银行资产质量的最重要指标是衡量银行资产质量的最重要指标",
			answerlist: [{
				value: 'A.资产利率的作用'
			}, {
				value: 'B.资产利率的作用'
			}, {
				value: 'C.资产利率的作用'
			}, {
				value: 'D.资产利率的作用'
			}]
		},{
			type: 1, //1表示多选题
			title: "2.（多选题）是衡量银行资产质量的最重要指标",
			answer:"资产利率的作用资产利率的作用资产利率的作用资产",
			analy:"是衡量银行资产质量的最重要指标是衡量银行资产质量的最重要指标",
			answerlist: [{
				value: 'A.资产利率的作用'
			}, {
				value: 'B.资产利率的作用'
			}, {
				value: 'C.资产利率的作用'
			}, {
				value: 'D.资产利率的作用'
			}]
		},{
			type: 2, //0表示简答题
			title: "3.（简答题）是衡量银行资产质量的最重要指标",
			answer:"资产利率的作用资产利率的作用资产利率的作用资产",
			analy:"是衡量银行资产质量的最重要指标是衡量银行资产质量的最重要指标",
			answerlist: [{
				value: 'A.资产利率的作用'
			}, {
				value: 'B.资产利率的作用'
			}, {
				value: 'C.资产利率的作用'
			}, {
				value: 'D.资产利率的作用'
			}]
		}]
	
	//试题练习按钮状态
	$scope.showAnswer=false;
	$scope.btnStatus=0;//0查看解析，1收藏，2取消收藏
	console.log($scope.btnStatus+":"+$rootScope.paperInfo.currentType);
		$scope.SelectAnswer = SelectAnswer;
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.slideHasChanged=slideHasChanged;
		$scope.ShowAnswer=ShowAnswer;//查看答案解析
		$scope.Conllect=Conllect;//说收藏
		$scope.Back=Back;
		function Back(){
			if($stateParams.type==0){
				$rootScope.BackView();
			}else{
				$state.go('tab.error');
			}
		}
		function ShowAnswer(){
			$scope.showAnswer=true;
			$scope.btnStatus=1;
		}
		function Conllect(bool){
			if(bool){
				$scope.btnStatus=2;
			}else{
				$scope.btnStatus=1;
			}
		}
		function slideHasChanged(index){
			$scope.btnStatus=0;
			$scope.showAnswer=false;
		}
		function SelectAnswer(answer) {
			if($rootScope.paperInfo.currentType==0){
				NextTest();
			}
		}
		function LastTest(){
			if($ionicSlideBoxDelegate.currentIndex()<=0){
				//已到最前题
				return;
			}
			$ionicSlideBoxDelegate.previous();
		}
		function NextTest(){
			var length=$scope.lists.length-1;
			if($ionicSlideBoxDelegate.currentIndex()>=length){
				//已到最后题
				return;
			}
			$ionicSlideBoxDelegate.next();
			//记录历史(未完成)
		}
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