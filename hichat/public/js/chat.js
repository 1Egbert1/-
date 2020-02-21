var TalkBoxTpl = '<div class="{%class%} content-box">' +
	'<div class="username">' +
	'{%username%}' +
	'</div>' +
	'<div class="img-radius-wrap">' +
	'<img src="img/tou1.jpeg" alt="头像" class="user-buddha" />' +
	'</div>' +
	'<div class="text">' +
	'{%content%}' +
	'</div>' +
	'</div>';

var SystemAlertTpl = '<div class="system">' +
	'<div class="text">' +
	'{%content%}' +
	'</div>' +
	'</div>';


var msgBox = $('#main-show');
var UserInfo = {
	name: ""
}

$(document).ready(function() {
	clientFuntion.login();
})


var appFunction = {
	init : function() {
		this.listeners();
	},
	toggleFunctionArea : function(){
		$('.input-wrap').toggleClass('show-function-area');
	},
	listeners :function(){
		var me = this;
		$('.more-input').on('click',function(){
			me.toggleFunctionArea();
		})
	}
}

var clientFuntion = {
	init: function() {
		this.listeners();
	},
	login: function() {
		while(!UserInfo.name) {
			UserInfo.name = prompt("欢迎加入聊天室！");
		}
		if(appSocket.init(UserInfo.name)){
			this.init();
			appFunction.init();
		} else {
			return console.log("连接失败，请检查你的网络。");
		}
	},
	sendMsg: function() {
		var msg = $('#main-input').val();
		if(msg == '' ) {
			alert('不能发送空内容');
			return;
		}
		var data = {
			username : UserInfo.name,
			msg : msg
		}
		appSocket._socket.emit("postNewMsg",data);
	},
	fillMsg: function(className, data) {
		this.clearInput();
		var p = TalkBoxTpl.replace('{%class%}', className).replace("{%content%}", data.msg)
					.replace("{%username%}",data.username);
		msgBox.append(p);
		this.setScrollTop();
	},
	systemAlert: function(data) {
		var p = SystemAlertTpl.replace("{%content%}","系统提示: "+ data);
		msgBox.append(p);
		this.setScrollTop();
	},
	listeners: function() {
		var me = this;
		$(document).on('keyup', function(e) {
			if(e.keyCode == 13) {
				me.sendMsg();
			}
		})
	},
	setScrollTop: function() {
//		msgBox.get(0).scrollTop = msgBox.get(0).scrollHeight;
		var contents = $('.content-box');
		var systems = $('.system');
		var heightCount = 0;
		var screenHeight = parseInt( window.innerHeight );
		var msgWindowHeight = screenHeight-40-88-98;
		for (var i = 0 ; i < contents.length ; i++) {
			heightCount += contents[i].clientHeight + 100;
		}
		for (var i = 0 ; i < systems.length ; i++) {
			heightCount += systems[i].clientHeight;
		}
		if(heightCount > msgWindowHeight) {
			document.body.scrollTop = document.body.scrollHeight;
		} else{
			
		}
	},
	clearInput : function(){
		$('#main-input').val('');
	}
}

var appSocket = {
	_socket: undefined,
	init: function() {
		var socket = io.connect();
		if(!socket) {
			return false;
		}
		
		this._socket = socket;
		socket.on('connect', function() {
			socket.emit('login', UserInfo.name);
		})
		socket.on("newMsg", function(data) {
			clientFuntion.fillMsg('left', data);
		})
		socket.on("newMsgBySelf", function(data) {
			clientFuntion.fillMsg('right', data);
		})
		socket.on("system", function(data) {
			clientFuntion.systemAlert(data);
		})
		return true;
	}
}
