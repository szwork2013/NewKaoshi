classifyModule
.controller('TypeItemCtrl',['$scope','$stateParams','TypeItemServ',function($scope,$stateParams,TypeItemServ){
	$scope.typeItems=[{
				parentId:0,
				id: 0,
				name: '银行考试'
			}, {
				parentId:1,
				id: 1,
				name: '财务类考试'
			}, {
				parentId:0,
				id: 1,
				name: '会计类考试'
			}, {
				parentId:0,
				id: 2,
				name: '报表类考试'
			}, ]
	$scope.typeName=$stateParams.typeName;
	$scope.typeId=$stateParams.typeId;
}])