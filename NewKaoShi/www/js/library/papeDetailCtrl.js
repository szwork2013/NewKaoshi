libraryModule
	.controller('PaperDetailCtrl', ['$scope', '$rootScope', 'PaperDetailServ', '$state',
		function($scope, $rootScope, PaperDetailServ, $state) {
			$scope.StartExams = StartExams;
			$scope.StartExersice = StartExersice;
			$scope.BackLibrary = BackLibrary;
			$scope.$on("$ionicView.enter",{
				$scope.serverdata=PaperDetailServ.GetServerData();
				$scope.CheckHistory();
			})
			function StartExams(bool) {
				PaperDetailServ.StartExams(bool);
			}
			function StartExersice(bool){
				PaperDetailServ.StartExersice(bool);
			}
			function BackLibrary() {
				PaperDetailServ.BackLibrary();
			}
		}
	])