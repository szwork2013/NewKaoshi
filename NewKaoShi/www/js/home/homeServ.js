homeModule
.factory('HomeServ',['DataServ','CommFunServ',
function(DataServ,CommFunServ){
	var serverdata={
		selectindex:0,
		itemlist:null
	}
	var server={
		GetServerData:GetServerData,
		InitData:InitData,
		SelectItem:SelectItem
	}
	return server;
	function GetServerData(){
		return serverdata;
	}
	function  InitData(){
		DataServ.BaseSelect("select * from tb_Advertisement",[]).then(function(data){
			if(data){
				if(serverdata.itemlist==null){
					serverdata.itemlist=new Array();
				}
				serverdata.itemlist=data;
			}
			CommFunServ.RefreshData(serverdata);
		})
	}
	function SelectItem(index) {
		serverdata.selectindex=index;
		CommFunServ.RefreshData(serverdata);
	}
}])
