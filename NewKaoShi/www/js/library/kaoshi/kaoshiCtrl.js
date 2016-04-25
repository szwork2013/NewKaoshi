libraryModule
.controller('KaoshiCtrl',['$scope','KaoshiServ','$state',
function($scope,KaoshiServ,$state){
	lists = [{
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
	var currentindex=0;
		$scope.test=lists[currentindex];
		$scope.SelectAnswer = SelectAnswer;
		$scope.LastTest=LastTest;
		$scope.NextTest=NextTest;
		$scope.Assignment=Assignment;
		function SelectAnswer(answer) {
			currentindex++;
			$scope.test=lists[currentindex];
		}
		function LastTest(){
			if(currentindex>0){
				currentindex--;
			}
			$scope.test=lists[currentindex];
		}
		function NextTest(){
			if(currentindex<lists.length-1){
				currentindex++;
			}
			$scope.test=lists[currentindex];
			//记录历史(未完成)
		}
		function Assignment(){
			$state.go('answerCard');
		}
}])