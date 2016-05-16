libraryModule
	.controller('PaperDetailCtrl', ['$scope', '$rootScope', 'PaperDetailServ', '$state',
		function($scope, $rootScope, PaperDetailServ, $state) {
			$scope.Start = Start;
			$scope.BackLibrary = BackLibrary;
			$scope.$on("$ionicView.enter",function(){
				$scope.serverdata=PaperDetailServ.GetServerData();
				PaperDetailServ.CheckHistory();
				PaperDetailServ.GeTQuestionList();
			})
			function Start(type) {
				PaperDetailServ.Start(type);
			}
			function BackLibrary() {
				PaperDetailServ.BackLibrary();
			}
		}
	])