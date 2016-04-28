libraryModule
.factory('KaoshiServ',['$timeout',
function($timeout){
		var time;//秒
		var t; //setTimeout方法 
		var server={
			
		}
		return server;
		//初始化考试时间秒、分、小时
		function InitTime(sec){
			time=sec;
			StartTime();
		}
		//开始及时
		function StartTime() {
			t = $timeout(function() {
				time++;
				ShowTime(time);
			}, 1000); //每隔1秒（1000毫秒）递归调用一次
		}
		//停止考试
		function StopTime(){
			if(t){
				$timeout.cancel(t);
				t=null;
			}
		}
		//显示时间
		function ShowTime(time){
			var hour=time/3600;
			var minute=time%3600/60;
			var second=time%60;
			var str=AssmbleTime(hour)+":"+AssmbleTime(minute)+":"+AssmbleTime(second);
		}
		//显示数字填补，即当显示的值为0-9时
		function AssmbleTime(arg) {
			return arg >= 10 ? arg : "0" + arg;
		}
}])