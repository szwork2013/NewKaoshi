classifyModule
	.controller('ExamTypeCtrl', ['$scope','$stateParams','ExamTypeServ',
		function($scope,$stateParams,ExamTypeServ) {
			$scope.TypeBack = TypeBack;
			$scope.serverdata = ExamTypeServ.BindServerData();
			$scope.$on('$ionicView.enter', function() {
				if ($stateParams.type == 0) {
					$scope.isShowBack = false;
				} else {
					$scope.isShowBack = true;
				}
				ExamTypeServ.GetExmaList();
			})

			function TypeBack() {
				ExamTypeServ.BackLibrary();
			}
		}
	])