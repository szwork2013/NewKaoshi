libraryModule
	.controller('ExerciseCtrl', ['$scope', 'ExerciseServ', '$rootScope', '$stateParams','$ionicModal',
		function($scope, ExerciseServ, $rootScope, $stateParams,$ionicModal) {
			//试题练习按钮状态

			$scope.slideHasChanged = slideHasChanged;
			$scope.SelectAnswer = SelectAnswer; //单项选择答案
			$scope.LastTest = LastTest;
			$scope.NextTest = NextTest;
			$scope.ShowAnswer = ShowAnswer; //查看答案解析
			$scope.Conllect = Conllect; //说收藏
			$scope.Back = Back; //返回
			$scope.ExerciseMenu = ExerciseMenu; //右上角按钮
			$scope.$on("$ionicView.enter", function() {
				$scope.serverdata = ExerciseServ.GetServerData();
				ExerciseServ.InitList($stateParams);
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
				ExerciseServ.ShowAnswer();

			}

			function Conllect(bool) {
				ExerciseServ.Conllect(bool);
			}

			function ExerciseMenu($event) {
				$ionicModal.fromTemplateUrl('templates/paper/modal.html', {
					scope: $scope,
					animation: 'slide-in-right'
					
				}).then(function(modal) {
					$scope.modal = modal;
					$scope.modal.show();
				})
			}

		}
	])