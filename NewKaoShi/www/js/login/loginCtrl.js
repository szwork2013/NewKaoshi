loginModule
.controller('LoginCtrl',['$scope','LoginServ','$state',
function($scope,LoginServ,$state){
	$scope.goRegister=goRegister;
	function goRegister(){
		$state.go('register');
	}
}])