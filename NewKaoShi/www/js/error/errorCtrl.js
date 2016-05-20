errorModule
.controller('ErrorCtrl',['$scope','ErrorServ','$state','$rootScope',
function($scope,ErrorServ,$state,$rootScope){
	$scope.isError = true;
		$scope.ChangeShow = ChangeShow;
		$scope.ChangeShowItem = ChangeShowItem;
		$scope.TestAgain = TestAgain;
		$scope.serverdata=ErrorServ.GetServerdata();
		$scope.$on("$ionicView.enter",function(){
			ErrorServ.InitData();
		})
		function ChangeShow(bool) {
			$scope.isError = bool;
		}
		function ChangeShowItem(item) {
			item.isShow = !item.isShow;
		}

		function TestAgain() {
			$rootScope.paperInfo.haveTest=true;
			$rootScope.paperInfo.currentType=1;
			$state.go('kaoshi',{type:1});
		}
		$scope.list = [{
			type: 0, //错题
			id: 1, //错题id
			typeItemId: 2,
			typeItem: '一级建造师',
			isShow: false,
			errorlist: [{
				qualicationid: 12,
				qualication: '建设工程管理项目', //根据
				Count: 3,
				No: '3|5|7' //错题id
			}, {
				qualicationid: 13,
				qualication: '建设工程管理项目', //根据
				Count: 5,
				No: '3|5|7' //错题id
			}]
		}, {
			type: 0,
			id: 1, //错题id
			typeItemId: 2,
			typeItem: '二级建造师',
			isShow: false,
			errorlist: [{
				qualicationid: 12,
				qualication: '建设工程管理项目', //根据
				Count: 3,
				No: '3|5|7' //错题id
			}, {
				qualicationid: 13,
				qualication: '建设工程管理项目', //根据
				Count: 5,
				No: '3|5|7' //错题id
			}]
		}, {
			type: 1, //
			id: 1, //错题id
			typeItemId: 2,
			typeItem: '三级建造师',
			isShow: false,
			errorlist: [{
				qualicationid: 12,
				qualication: '建设工程管理项目', //根据
				Count: 3,
				No: '3|5|7' //错题id
			}, {
				qualicationid: 13,
				qualication: '建设工程管理项目', //根据
				Count: 5,
				No: '3|5|7' //错题id
			}]
		}]
}])