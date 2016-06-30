libraryModule
	.controller('PaperDetailCtrl', ['$scope', '$rootScope', 'PaperDetailServ', '$state',
		function($scope, $rootScope, PaperDetailServ, $state) {
			$scope.Start = Start;
			$scope.BackLibrary = BackLibrary;
			$scope.serverdata=PaperDetailServ.GetServerData();
			$scope.$on("$ionicView.loaded",function(){
				
				PaperDetailServ.InitData();
			})
			function Start(type) {
				PaperDetailServ.Start(type);
			}
			function BackLibrary() {
				PaperDetailServ.BackLibrary();
			}
		}
	])