searchModule
.factory('SearchServ',['DataServ','CommFunServ','LibraryServ',
function(DataServ,CommFunServ,LibraryServ){
	var serverdata={
		paperslist:null,
		papers:null
	}
	var server={
		GetServerData:GetServerData,
		InitData:InitData,
		Change:Change
	}
	return server;
	function GetServerData(){
		return serverdata;
	}
	function InitData(){
		DataServ.BaseSelect("select * from tb_Papers").then(function(data){
			if(data && data.length>0){
				if(serverdata.paperslist==null){
					serverdata.paperslist=new Array();
				}
				serverdata.paperslist=data;
			}
		})
	}
	function Change(serchname){
		if(serchname==null || serchname==""){
			serverdata.papers=null;
		}else{
			serverdata.papers=new Array();
			var len=serverdata.paperslist.length;
			for(var i=0;i<len;i++){
				var regrect=new RegExp("\.*"+serchname+"\.*","gm");
				if(regrect.test(serverdata.paperslist[i].PaperContent)){
					serverdata.papers.push(serverdata.paperslist[i]);
				}
			}
			
		}
		CommFunServ.RefreshData(serverdata);
	}
	function GoPaperDetail(id){
		LibraryServ.GoPaperDetail(id)
	}
}])
