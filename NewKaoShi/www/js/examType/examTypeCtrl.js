classifyModule
	.controller('ExamTypeCtrl', ['$scope','$stateParams','ExamTypeServ',
		function($scope,$stateParams,ExamTypeServ) {
			$scope.ShowChildren=ShowChildren;
			$scope.ShowParent = ShowParent;
			$scope.serverdata = ExamTypeServ.GetServerData();
			$scope.$on('$ionicView.loaded', function() {
				if ($stateParams.type == 0) {
					$scope.isShowBack = false;
				} else {
					$scope.isShowBack = true;
				}
				ExamTypeServ.InitList();
			})
			function ShowChildren(id,name){
				ExamTypeServ.ShowChildren(id,name)
			}
			function ShowParent() {
				ExamTypeServ.ShowParent();
			}
		}
	])