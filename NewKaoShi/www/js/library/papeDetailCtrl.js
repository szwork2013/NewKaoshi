libraryModule
.controller('PaperDetailCtrl',['$scope','PaperDetailServ','$state',
function($scope,PaperDetailServ,$state){
	$scope.StartExams = StartExams;

	function StartExams(type) {
		switch (type) {
			case 0:
				$state.go('kaoshi')
				break;
			case 1:
				break;
		}
	}
}])