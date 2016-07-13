homeModule
	.factory('HomeServ', ['DataServ', 'CommFunServ','$cordovaInAppBrowser',
		function(DataServ, CommFunServ,$cordovaInAppBrowser) {
			var serverdata = {
				selectindex: 0,
				itemlist: null
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				SelectItem: SelectItem,
				GoBuy: GoBuy
			}
			return server;

			function GetServerData() {
				return serverdata;
			}

			function InitData() {
				DataServ.BaseSelect("select * from tb_Advertisement", []).then(function(data) {
					if (data) {
						if (serverdata.itemlist == null) {
							serverdata.itemlist = new Array();
						}
						serverdata.itemlist = data;
					}
					CommFunServ.RefreshData(serverdata);
				})
			}

			function SelectItem(index) {
				serverdata.selectindex = index;
				CommFunServ.RefreshData(serverdata);
			}

			function GoBuy(src) {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'no'
				};
				$cordovaInAppBrowser.open(src, '_blank', options)
					.then(function(event) {
						// success
					})
					.catch(function(event) {
						// error
					});

				//$cordovaInAppBrowser.close();
			}
		}
	])
	.config(function($cordovaInAppBrowserProvider) {
		var defaultOptions = {
			location: 'no',
			clearcache: 'no',
			toolbar: 'no'
		};

		document.addEventListener("deviceready", function() {

			$cordovaInAppBrowserProvider.setDefaultOptions(options)

		}, false);
	})