classifyModule
	.controller('TestTypeCtrl', ['$scope', 'TestTypeServ',
		function($scope, TestTypeServ) {
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
		}
	])