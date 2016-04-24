classifyModule
.controller('QualificationCtrl',['$scope','$stateParams','QualificationServ',
function($scope,$stateParams,QualificationServ){
	$scope.qualifications=[{
				parentId:0,
				id: 0,
				name: '法律法规'
			}, {
				parentId:1,
				id: 1,
				name: '个人理财'
			}, {
				parentId:0,
				id: 1,
				name: '风险管理'
			}, {
				parentId:0,
				id: 2,
				name: '公司信贷'
			}, ]
	$scope.typeItemName=$stateParams.typeItemName;
	$scope.typeItemId=$stateParams.typeItemId;
}])