loginModule
.controller('InitCtrl',['$scope','$state','$ionicSlideBoxDelegate',
function($scope,$state,$ionicSlideBoxDelegate){
	$scope.GoInit=GoInit;
	$scope.slideHasChanged=slideHasChanged;
	$scope.$on('$ionicView.enter',function(){
		$ionicSlideBoxDelegate.slide(0);
	})
	
	function slideHasChanged(index){
		var count=$ionicSlideBoxDelegate.slidesCount();
		if(index>=count-1){
			$state.go('testType');
		}
	}
	function GoInit(){
		$state.go('testType');
	}
}])
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