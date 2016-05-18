libraryModule
	.controller('AnswerCardCtrl', ['$scope', 'AnswerCardServ',
		function($scope, AnswerCardServ) {
			$scope.ConfirmAssignment = ConfirmAssignment;
			$scope.serverdata = AnswerCardServ.GetServerData();
			$scope.$on('$ionicView.enter', function() {
				AnswerCardServ.InitData();
			})

			function ConfirmAssignment() {
				AnswerCardServ.ConfirmAssignment();
			}

		}
	])