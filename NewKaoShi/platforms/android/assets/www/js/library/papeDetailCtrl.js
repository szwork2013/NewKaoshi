libraryModule
.controller('PaperDetailCtrl',['$scope','$rootScope','PaperDetailServ','$state',
function($scope,$rootScope,PaperDetailServ,$state){
	$scope.StartExams = StartExams;
	$scope.BackLibrary=BackLibrary;
	$rootScope.paperInfo={
		haveTest:false,
		haveKaoshi:true,
		currentType:0,//当前试卷模式0表示考试，1表示练习
		rtime:0
	}
	function StartExams(type) {
		switch (type) {
			case 0:
			$rootScope.paperInfo.haveKaoshi=true;
			$rootScope.paperInfo.currentType=0;
				$state.go('kaoshi',{type:0})
				break;
			case 1:
			$rootScope.paperInfo.haveTest=true;
			$rootScope.paperInfo.currentType=1;
				$state.go('kaoshi',{type:0})
				break;
		}
	}
	function BackLibrary(){
			$state.go('tab.library');
		}
}])