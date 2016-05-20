errorModule
.controller('ErrorCtrl',['$scope','ErrorServ','$rootScope',
function($scope,ErrorServ,$rootScope){
	$scope.isError = true;
		$scope.ChangeShow = ChangeShow;
		$scope.ChangeShowItem = ChangeShowItem;
		$scope.TestAgain = TestAgain;
		$scope.serverdata=ErrorServ.GetServerdata();
		$scope.$on("$ionicView.enter",function(){
			ErrorServ.InitData();
		})
		$scope.$on("$ionicView.leave",function(){
			ErrorServ.Destory();
		})
		function ChangeShow(bool) {
			$scope.isError = bool;
		}
		function ChangeShowItem(index) {
			ErrorServ.ChangeShowItem(index);
		}
		function TestAgain(paperid,type) {
			ErrorServ.TestAgain(paperid,type);
			/*$rootScope.paperInfo.haveTest=true;
			$rootScope.paperInfo.currentType=1;
			$state.go('kaoshi',{type:1});*/
		}
}])