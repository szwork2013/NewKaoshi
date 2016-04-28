accountModule
	.controller('AccountCtrl', ['$scope', 'AccountServ', '$state', '$ionicModal',
		function($scope, AccountServ, $state,$ionicModal) {
			$scope.GoLogin = GoLogin;
			$scope.ShowUpdatepsd = ShowUpdatepsd;
			$scope.ShowUpdatevip = ShowUpdatevip;
			$scope.HidePsd=HidePsd;
			$scope.HideVIP=HideVIP;
			$scope.UpdatePsd=UpdatePsd;
			$scope.UpdateVIP=UpdateVIP;

			function GoLogin() {
				$state.go('login');
			}

			function ShowUpdatepsd() {
				$ionicModal.fromTemplateUrl('templates/login/updatePsd.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.psdmodal = modal;
					$scope.psdmodal.show();
				});
			}

			function ShowUpdatevip() {
				$ionicModal.fromTemplateUrl('templates/login/unlockVIP.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.vipmodal = modal;
					$scope.vipmodal.show();
				});
			}
			function HidePsd(){
				if($scope.psdmodal){
					$scope.psdmodal.hide();
				}
			}
			function HideVIP(){
				if($scope.vipmodal){
					$scope.vipmodal.hide();
				}
			}
			function UpdatePsd(){
				HidePsd();
			}
			function UpdateVIP(){
				HideVIP();
			}

		}
	])