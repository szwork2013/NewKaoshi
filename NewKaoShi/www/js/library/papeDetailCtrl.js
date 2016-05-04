libraryModule
	.controller('PaperDetailCtrl', ['$scope', '$rootScope', 'PaperDetailServ', '$state',
		function($scope, $rootScope, PaperDetailServ, $state) {
			$scope.StartExams = StartExams;
			$scope.StartExersice = StartExersice;
			$scope.BackLibrary = BackLibrary;
			$scope.$on("$ionicView.enter",function(){
				$scope.serverdata=PaperDetailServ.GetServerData();
				PaperDetailServ.CheckHistory();
				PaperDetailServ.GeTQuestionList();
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