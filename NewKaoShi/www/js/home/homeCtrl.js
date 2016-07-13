homeModule
	
	.controller('HomeCtrl', ['$scope', '$rootScope', 'HomeServ',
		function($scope, $rootScope, HomeServ) {
			$rootScope.isLogin = false;
			$scope.GoBuy = GoBuy;
			$scope.serverdata = HomeServ.GetServerData();
			$scope.$on('$ionicView.loaded', function() {
				HomeServ.InitData();
			})
			$scope.$on('$ionicView.enter', function() {
				SetHight();
			})

			function SetHight() {
				var contentdiv = document.getElementById('items_Content')
				var height = document.documentElement.clientHeight - 284;
				contentdiv.style.cssText = 'height:' + height + 'px';
			}
			$scope.slideboxes = [{
				imgsrc: "img/123.jpg",
				linksrc: ''
			}, {
				imgsrc: "img/123.jpg",
				linksrc: ''
			}, {
				imgsrc: "img/123.jpg",
				linksrc: ''
			}]
			$scope.selectindex = 0;
			$scope.SelectItem = SelectItem;

			function SelectItem(index) {
				HomeServ.SelectItem(index)
			}
			//打开购买页面
			function GoBuy(src) {
				HomeServ.GoBuy(src);
				

			}
			$scope.itemlist = [{
				id: 0,
				type: 1, //0表示全科，1表示单科,2表示vip账号
				Img: 'img/ben.png',
				Name: '一级建造师(全科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://www.baidu.com'
			}, {
				id: 1,
				type: 1, //0表示全科
				Img: 'img/ben.png',
				Name: '一级建造师(全科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://www.baidu.com'
				}, {
				id: 2,
				type: 2, //0表示全科
				Img: 'img/ben.png',
				Name: '一级建造师(单科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://h5.m.taobao.com/awp/core/detail.htm?id=528179000733&ali_trackid=2:mm_26632258_3504122_32554087:1467267432_252_207218429&clk1=ec5ac5a57e1373cb6b2f344444216f44&spm=a311n.7676423.1005.20.&pvid=201_10.98.16.184_73457434_1467267426159&e=yznLTANQp5tw4vFB6t2Z2ueEDrYVVa64REOHN-0iJT1jBNMMp8GF0SmB9qxZ46Tc2Y-dtp35ZpoUMBBIa-EBw_ASoPiawZpgXGpyfTxrs7XpXpnduBgdAMngHOkybDhUOzS0cCCMoNfZdyf3yb2VYCIyNQwQMFGhmnJ1QjB2wCS2V_rp0ksAAUbVDyfRSNvjQeEGIL9eyN6OtlmSgHzcvXx3qnMkdRke5B813JLCH9FyxScGGIb6vXWlCu7nfup3JsMK23wk3GC8tkD2qaSWjbSznqLLxxLuAX6hVVrZ-RcDDY66poMQNAbKlze8e4B7JtUiAVdpBabb8RwArZ2HGHJsfUOmTloh&type=2&tkFlag=0'
			}, {
				id: 23,
				type: 2, //0表示全科
				Img: 'img/ben.png',
				Name: '一级建造师(单科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://h5.m.taobao.com/awp/core/detail.htm?id=528179000733&ali_trackid=2:mm_26632258_3504122_32554087:1467267432_252_207218429&clk1=ec5ac5a57e1373cb6b2f344444216f44&spm=a311n.7676423.1005.20.&pvid=201_10.98.16.184_73457434_1467267426159&e=yznLTANQp5tw4vFB6t2Z2ueEDrYVVa64REOHN-0iJT1jBNMMp8GF0SmB9qxZ46Tc2Y-dtp35ZpoUMBBIa-EBw_ASoPiawZpgXGpyfTxrs7XpXpnduBgdAMngHOkybDhUOzS0cCCMoNfZdyf3yb2VYCIyNQwQMFGhmnJ1QjB2wCS2V_rp0ksAAUbVDyfRSNvjQeEGIL9eyN6OtlmSgHzcvXx3qnMkdRke5B813JLCH9FyxScGGIb6vXWlCu7nfup3JsMK23wk3GC8tkD2qaSWjbSznqLLxxLuAX6hVVrZ-RcDDY66poMQNAbKlze8e4B7JtUiAVdpBabb8RwArZ2HGHJsfUOmTloh&type=2&tkFlag=0'
			}, {
				id: 22,
				type: 1, //0表示全科
				Img: 'img/ben.png',
				Name: '一级建造师(全科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://www.baidu.com'
				}, {
				id: 24,
				type: 3, //0表示全科
				Img: 'img/ben.png',
				Name: '一级建造师(全科+三门公共课)',
				Descript: ' 送VIP+全套环球视频',
				Price: '99',
				src: 'http://h5.m.taobao.com/awp/core/detail.htm?id=528179000733&ali_trackid=2:mm_26632258_3504122_32554087:1467267432_252_207218429&clk1=ec5ac5a57e1373cb6b2f344444216f44&spm=a311n.7676423.1005.20.&pvid=201_10.98.16.184_73457434_1467267426159&e=yznLTANQp5tw4vFB6t2Z2ueEDrYVVa64REOHN-0iJT1jBNMMp8GF0SmB9qxZ46Tc2Y-dtp35ZpoUMBBIa-EBw_ASoPiawZpgXGpyfTxrs7XpXpnduBgdAMngHOkybDhUOzS0cCCMoNfZdyf3yb2VYCIyNQwQMFGhmnJ1QjB2wCS2V_rp0ksAAUbVDyfRSNvjQeEGIL9eyN6OtlmSgHzcvXx3qnMkdRke5B813JLCH9FyxScGGIb6vXWlCu7nfup3JsMK23wk3GC8tkD2qaSWjbSznqLLxxLuAX6hVVrZ-RcDDY66poMQNAbKlze8e4B7JtUiAVdpBabb8RwArZ2HGHJsfUOmTloh&type=2&tkFlag=0'
			}]

		}
	])