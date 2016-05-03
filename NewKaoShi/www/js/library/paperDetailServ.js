libraryModule
.factory('PaperDetailServ',['$state',
function($state){
	var server={
		BackLibrary:BackLibrary
	}
	return server;
	function BackLibrary(){
			$state.go('tab.library');
		}
}])