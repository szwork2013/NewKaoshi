libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$state','$ionicSlideBoxDelegate',
function($scope,KaoshiServ,$state,$ionicSlideBoxDelegate){
	$scope.lists = [{
			type: 0, //0表示单选题
			title: "1.（单选题）是衡量银行资产质量的最重要指标",
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
		$scope.SelectAnswer = SelectAnswer;
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		$scope.slideHasChanged=slideHasChanged;
		function slideHasChanged(index){
			
		}
		function SelectAnswer(answer) {
			currentindex++;
			$scope.test=lists[currentindex];
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