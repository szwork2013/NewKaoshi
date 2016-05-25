libraryModule
	.controller('LibraryCtrl', ['$scope', 'LibraryServ', '$rootScope', function($scope, LibraryServ, $rootScope) {
		$scope.selectindex = 1;
		$scope.ChangeType = ChangeType;
		$scope.GoPaperDetail = GoPaperDetail;//进入试卷
		$scope.TragetMenu = TragetMenu;//切换分类侧栏
		$scope.HideMenu = HideMenu;//隐藏分类
		$scope.ChangepaperDetail=ChangepaperDetail;//选择新的资格考试
		$scope.GoExamType=GoExamType;//选择分类
		$scope.$on("$ionicView.enter", function() {
			$scope.isShow = 0;
			SetHeight();
			$scope.serverdata=LibraryServ.GetServerData();
			LibraryServ.InitData($rootScope.examTypeID);
		})
		//设置滑动高度
		function SetHeight(){
			var menu=document.getElementById("menu_list");
			var content=document.getElementById("linrary_scroll");
			
			var menuscr=document.getElementById("menu_scroll");
			var height=document.documentElement.clientHeight-49;
			menu.style.cssText="height:"+height+'px';
			menuscr.style.cssText="height:"+height+'px';
			var contentheight=height-54-42;
			content.style.cssText="height:"+contentheight+'px';
		}
		
		function TragetMenu() {
			if ($scope.isShow == 1) {
				$scope.isShow = 2;
			} else {
				$scope.isShow = 1;
			}
		}
		function HideMenu() {
			$scope.isShow = 2;
		}
		function ChangepaperDetail(id){
			$rootScope.examTypeID=id;
			LibraryServ.InitData($rootScope.examTypeID);
			HideMenu();
			SetHeight();
		}
		function ChangeType(index) {
			$scope.selectindex = index;
		}
		//进入试卷
		function GoPaperDetail(id) {
			LibraryServ.GoPaperDetail(id);
		}
		//进入分类
		function GoExamType(){
			LibraryServ.GoExamType();
		}
	}])