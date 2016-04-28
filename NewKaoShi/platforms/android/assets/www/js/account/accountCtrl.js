accountModule
.controller('AccountCtrl',['$scope','AccountServ','$state',
function($scope,AccountServ,$state){
	$scope.GoLogin=GoLogin;
	function GoLogin(){
		$state.go('login');
	}
}])