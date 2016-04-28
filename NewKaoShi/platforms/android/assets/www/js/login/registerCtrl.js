loginModule
.controller('RegisterCtrl',['$scope','$rootScope','RegisterServ','$state',
function($scope,$rootScope,RegisterServ,$state){
	$scope.Register=Register;
	function Register(){
		$rootScope.isLogin=true;
		$state.go('tab.home')
	}
}])