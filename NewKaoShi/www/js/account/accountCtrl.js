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
			
			$scope.ChangeTest=ChangeTest;//切换考试
			$scope.GoDetail=GoDetail;
			
			$scope.SyncHistory=SyncHistory;
			$scope.SyncError=SyncError;
			$scope.SyncCollect=SyncCollect;
			//修改密码信息
			$scope.psd={
				oldpsd:'',
				newpsd:'',
				connewpsd:''
			}
			//获取VIP信息
			$scope.vip={
				num:'',
				connum:''
			}
			$scope.serverdata=AccountServ.GetServerData();
			
			$scope.$on("$ionicView.loaded",function(){
				AccountServ.InitData();
			})
			function GoLogin() {
				AccountServ.GoLogin();
			
			}
			function ShowUpdatepsd() {
				$ionicModal.fromTemplateUrl('templates/login/updatePsdModal.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.psdmodal = modal;
					$scope.psdmodal.show();
				});
			}

			function ShowUpdatevip() {
				$ionicModal.fromTemplateUrl('templates/login/unlockVIPModal.html', {
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
				var oldpsd=$scope.psd.oldpsd;
				var newpsd=$scope.psd.newpsd;
				var connewpsd=$scope.psd.connewpsd;
				AccountServ.UpdatePsd(oldpsd,newpsd,connewpsd).then(function(res){
					HidePsd();
				});
			}
			function UpdateVIP(){
				var num=$scope.vip.num;
				var connum=$scope.vip.connum;
				AccountServ.UpdateVip(num,connum).then(function(res){
					HideVIP();
				});
			}
			function ChangeTest(){
				AccountServ.ChangeTest();
			}
			function GoDetail(paperid){
				AccountServ.GoDetail(paperid);
			}
			function SyncHistory(){
				AccountServ.SyncHistory();
			}
			function SyncError(){
				AccountServ.SyncError();
			}
			function SyncCollect(){
				AccountServ.SyncCollect();
			}

		}
	])