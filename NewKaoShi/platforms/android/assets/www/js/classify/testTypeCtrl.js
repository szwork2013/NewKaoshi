classifyModule
	.controller('TestTypeCtrl', ['$scope','$stateParams', 'TestTypeServ','$state',
		function($scope, $stateParams,TestTypeServ,$state) {
			$scope.TypeBack=TypeBack;
			$scope.$on('$ionicView.enter',function(){
				if($stateParams.type==0){
					$scope.isShowBack=false;
				}else{
					$scope.isShowBack=true;
				}
			})
			
			$scope.testTypes = [{
				id: 0,
				name: '教师类'
			}, {
				id: 1,
				name: '金融类'
			}, {
				id: 2,
				name: '工程类'
			}, {
				id: 3,
				name: '计算机类'
			}, ]
			function TypeBack(){
				$state.go('tab.library');
			}
			
		}
	])