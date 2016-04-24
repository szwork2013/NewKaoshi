// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('NewKaoShi', ['ionic','ClassifyModule','HomeModule','LibraryModule','ErrorModule','SearchModule','AccountModule','CommModule'])

.run(function($ionicPlatform,$ionicPopup,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.ExitApp = function() {
			//定义确认弹出框confirm
			/*var confirmPopup = $ionicPopup.confirm({
				title: '<strong>退出程序</strong>', //弹出信息title
				template: "确认退出程序", //弹出信息文字内容
				okText: "退出", //弹出信息确认按钮
				cancelText: "取消" //弹出信息取消按钮
			});
			//选择确认按钮或者取消按钮后执行方法
			confirmPopup.then(function(res) {
				//选择确认按钮，res为true
				if (res) {
					//退出程序方法
					ionic.Platform.exitApp();
				}
				//选择取消按钮，res为false
				else {}
			});*/
		};
		//ionic对默认手机返回键操作
		$ionicPlatform.registerBackButtonAction(function(e) {
			e.preventDefault();
			//当前所在路由为/login登录界面,弹出退出确认框
			/*if ($location.path() == '/app/tab/home' || $location.path() == '/app/hometabs/selectaccount' || $location.path() == '/app/hometabs/more') {
				if ($rootScope.backButtonPressedOnceToExit) {
					$rootScope.ExitApp();
				} else {
					$rootScope.backButtonPressedOnceToExit = true;
					setTimeout(function() {
						$rootScope.backButtonPressedOnceToExit = false;
					}, 1000);
				}
			} else if ($location.path() == '/login') {
				$state.go("app.hometabs.home");
			}
			//其他路由返回上一路由
			else {
			}
			return false;*/
		}, 101);
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	/*$ionicConfigProvider配置Android和iOS界面配置*/
			$ionicConfigProvider.platform.ios.tabs.style('standard');
			$ionicConfigProvider.platform.ios.tabs.position('bottom');
			$ionicConfigProvider.platform.android.tabs.style('standard');
			$ionicConfigProvider.platform.android.tabs.position('bottom');
			$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
			$ionicConfigProvider.platform.android.navBar.alignTitle('center');
			$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
			$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
			$ionicConfigProvider.platform.ios.views.transition('ios');
			$ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
	//搜索考试分类（金融）
		.state('testType', {
			url: '/testType',
			cache: true,
			templateUrl: 'templates/testType.html',
			controller: 'TestTypeCtrl'
		})
		//类型细项（银行、保险）
		.state('typeItem', {
			url: '/typeItem/:typeId/:typeName',
			cache: false,
			templateUrl: 'templates/typeItem.html',
			controller: 'TypeItemCtrl'
		})
		//资格考试（个人理财、风险管理）
		.state('qualification', {
			url: '/qualification/:typeItemId/:typeItemName',
			cache: false,
			templateUrl: 'templates/qualification.html',
			controller: 'QualificationCtrl'
		})
  // setup an abstract state for the tabs directive
   .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home/:id',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.library', {
      url: '/library',
      views: {
        'tab-library': {
          templateUrl: 'templates/tab-library.html',
          controller: 'LibraryCtrl'
        }
      }
    })
    .state('tab.error', {
      url: '/error',
      views: {
        'tab-error': {
          templateUrl: 'templates/tab-error.html',
          controller: 'ErrorCtrl'
        }
      }
    })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })
   .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/testType');

});
