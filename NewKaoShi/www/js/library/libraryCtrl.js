libraryModule
.controller('LibraryCtrl',['$scope','LibraryServ','$state',function($scope,LibraryServ,$state){
	$scope.selectindex=0;
	$scope.ChangeType=ChangeType;
	$scope.GoPaperDetail=GoPaperDetail;
	$scope.TragetMenu=TragetMenu;
	function ChangeType(index){
		$scope.selectindex=index;
	}
	function GoPaperDetail(id){
		$state.go('paperDetail');
	}
	$scope.papers=[{
		id:0,
		vipType:1,//是否为vip，0表示是，1表示否
		testType:0,//试卷类型，0历年真题，1模拟试题，2章节练习
		Name:'历年真题2013年上半年银行从业资格考试《公共基础》真题及答案',
		Number:6000,//已做题人数
		Updatetime:"2016-09-10",//最近一次更新时间
		IsDownload:0,//是否已下载，0已下载，1未下载
		IsUpdate:0//是否有更新，0无更新，1有更新
	},{
		id:1,
		vipType:0,//是否为vip，0表示是，1表示否
		testType:1,//试卷类型，0历年真题，1模拟试题，2章节练习
		Name:'模拟试题2013年上半年银行从业资格考试《公共基础》真题及答案',
		Number:6000,//已做题人数
		Updatetime:"2016-09-10",//最近一次更新时间
		IsDownload:1,//是否已下载，0已下载，1未下载
		IsUpdate:0
	},{
		id:2,
		vipType:1,//是否为vip，0表示是，1表示否
		testType:1,//试卷类型，0历年真题，1模拟试题，2章节练习
		Name:'模拟试题2013年上半年银行从业资格考试《公共基础》真题及答案',
		Number:6000,//已做题人数
		Updatetime:"2016-09-10",//最近一次更新时间
		IsDownload:1,//是否已下载，0已下载，1未下载
		IsUpdate:1
	},{
		id:3,
		vipType:1,//是否为vip，0表示是，1表示否
		testType:2,//试卷类型，0历年真题，1模拟试题，2章节练习
		Name:'章节练习2013年上半年银行从业资格考试《公共基础》真题及答案',
		Number:6000,//已做题人数
		Updatetime:"2016-09-10",//最近一次更新时间
		IsDownload:1,//是否已下载，0已下载，1未下载
		IsUpdate:0
	},]
	var menu=document.getElementById("menu_list");
	var height=document.documentElement.clientHeight;
	menu.style.cssText="height:"+height+"px";
	$scope.isShow=false;
	function TragetMenu(){
		$scope.isShow=!$scope.isShow;
	}
}])