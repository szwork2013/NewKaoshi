libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$state','$rootScope','$ionicSlideBoxDelegate','$stateParams',
function($scope,KaoshiServ,$state,$rootScope,$ionicSlideBoxDelegate,$stateParams){
		$scope.SelectAnswer = SelectAnswer;//选择题选择答案
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		function SelectAnswer(parentindex,index) {
			items.haveSelect[index]=!items.haveSelect[index];
			if(items.type==0){//单选取消其余选中
				showAnswer=true;
				var len=items.haveSelect.length;
				for(var i=0;i<len;i++){
					if(i!=index){
						items.haveSelect[i]=false;
					}
				}
			}
			if($rootScope.paperInfo.currentType==0){
				NextTest();
			}
		}
		//上一题
		function LastTest(){
			if($ionicSlideBoxDelegate.currentIndex()<=0){
				//已到最前题
				return;
			}
			$ionicSlideBoxDelegate.previous();
		}
		//下一题
		function NextTest(){
			var length=$scope.lists.length-1;
			if($ionicSlideBoxDelegate.currentIndex()>=length){
				//已到最后题
				return;
			}
			$ionicSlideBoxDelegate.next();
			//记录历史(未完成)
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