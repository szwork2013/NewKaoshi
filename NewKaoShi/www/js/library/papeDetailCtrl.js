libraryModule
	.controller('PaperDetailCtrl', ['$scope', '$rootScope', 'PaperDetailServ', '$state',
		function($scope, $rootScope, PaperDetailServ, $state) {
			$scope.StartExams = StartExams;
			$scope.BackLibrary = BackLibrary;

			function StartExams(type) {
				switch (type) {
					case 0: //考试
						$rootScope.paperInfo.haveKaoshi = true;
						$rootScope.paperInfo.currentType = 0;
						break;
					case 1: //练习
						$rootScope.paperInfo.haveTest = true;
						$rootScope.paperInfo.currentType = 1;
						break;
				}
				if($rootScope.currentPaper.IsDownload==0){
					//请求下载试题
				}else{
					$state.go('kaoshi', {
						type: 0
					})
				}
				
			}

			function BackLibrary() {
				PaperDetailServ.BackLibrary();
			}
		}
	])