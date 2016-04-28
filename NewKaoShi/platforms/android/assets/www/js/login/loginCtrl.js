loginModule
.controller('LoginCtrl',['$scope','$rootScope','LoginServ','$state',
function($scope,$rootScope,LoginServ,$state){
	$scope.goRegister=goRegister;
	$scope.Login=Login;
	$scope.BackAccount=BackAccount;
	function goRegister(){
		$state.go('register');
	}
	function Login(){
		$rootScope.isLogin=true;
		$state.go('tab.home')
	}
	function BackAccount(){
		$state.go('tab.account')
	}
}])