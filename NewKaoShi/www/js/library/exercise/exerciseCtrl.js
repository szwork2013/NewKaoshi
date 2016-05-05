libraryModule
	.controller('ExerciseCtrl', ['$scope', 'ExerciseServ', '$rootScope', '$stateParams',
		function($scope, ExerciseServ, $rootScope, $stateParams) {
			//试题练习按钮状态
			$scope.showAnswer = false;
			$scope.btnStatus = 0; //0查看解析，1收藏，2取消收藏

			$scope.slideHasChanged = slideHasChanged;
			$scope.SelectAnswer = SelectAnswer; //单项选择答案
			$scope.LastTest = LastTest;
			$scope.NextTest = NextTest;
			$scope.ShowAnswer = ShowAnswer; //查看答案解析
			$scope.Conllect = Conllect; //说收藏
			$scope.Back = Back;
			$scope.$on("$ionicView.enter", function() {
				$scope.serverdata = ExerciseServ.GetServerData();
				ExerciseServ.InitList($stateParams.history,$stateParams.type);
			})

			function slideHasChanged(index) {
				ExerciseServ.slideHasChanged(index);
			}

			function SelectAnswer(parentindex, index) {
				//未完成
				ExerciseServ.SelectAnswer(parentindex, index);
			}
			//上一题
			function LastTest() {
				ExerciseServ.LastTest();
			}
			//下一题
			function NextTest() {
				ExerciseServ.NextTest();
			}

			function Back() {
				ExerciseServ.Back();
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

		}
	])