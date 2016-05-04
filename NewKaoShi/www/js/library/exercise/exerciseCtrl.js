libraryModule
	.controller('ExerciseCtrl', ['$scope', 'ExerciseServ', '$state', '$rootScope', '$ionicSlideBoxDelegate', '$stateParams',
		function($scope, ExerciseServ, $state, $rootScope, $ionicSlideBoxDelegate, $stateParams) {
			//试题练习按钮状态
			$scope.showAnswer = false;
			$scope.btnStatus = 0; //0查看解析，1收藏，2取消收藏
			$scope.LastTest = LastTest;
			$scope.NextTest = NextTest;
			$scope.ShowAnswer = ShowAnswer; //查看答案解析
			$scope.Conllect = Conllect; //说收藏
			$scope.Back = Back;

			function Back() {
				if ($stateParams.type == 0) {
					$rootScope.BackView();
				} else {
					$state.go('tab.error');
				}
			}

			function ShowAnswer() {
				$scope.showAnswer = true;
				$scope.btnStatus = 1;
			}

			function Conllect(bool) {
				if (bool) {
					$scope.btnStatus = 2;
				} else {
					$scope.btnStatus = 1;
				}
			}

			function slideHasChanged(index) {
				$scope.btnStatus = 0;
				$scope.showAnswer = false;
			}
			//上一题
			function LastTest() {
				if ($ionicSlideBoxDelegate.currentIndex() <= 0) {
					//已到最前题
					return;
				}
				$ionicSlideBoxDelegate.previous();
			}
			//下一题
			function NextTest() {
				var length = $scope.lists.length - 1;
				if ($ionicSlideBoxDelegate.currentIndex() >= length) {
					//已到最后题
					return;
				}
				$ionicSlideBoxDelegate.next();
				//记录历史(未完成)
			}
		}
	])