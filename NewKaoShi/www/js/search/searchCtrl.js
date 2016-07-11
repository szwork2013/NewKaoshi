searchModule
.controller('SearchCtrl',['$scope','SearchServ',
function($scope,SearchServ){
	$scope.Change=Change;
	$scope.GoPaperDetail=GoPaperDetail;
	$scope.data={
		searchName:''
	}
	$scope.serverdata=SearchServ.GetServerData();
	$scope.$on("$ionicView.loaded",function(){
		SearchServ.InitData();
	})
	function Change(){
		var str=$scope.data.searchName;
		SearchServ.Change(str);
	}
	function GoPaperDetail(id){
		SearchServ.GoPaperDetail(id);
	}
}])