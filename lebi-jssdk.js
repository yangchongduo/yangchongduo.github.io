var _hmt = _hmt || [];
(
  function (w) {
    var lebi; // 局部变量
    if (window.LeBIObject) { // 就是异步的 不传 没法用
      lebi = window[window.LeBIObject];// 这样就变成全局的 是一个字符串 重新赋值了 不是
    } else { // 肯定就是同步
      window.lebi = lebi = function () {
        lebi.q.push(arguments);
      };
    }
    lebi.q = lebi.q || [];
    var methods = {
      _extend: Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      },
      initBai: function (hmtID) {
        console.log('initbaidu');
        var hm = document.createElement('script');
        if (hmtID === true) {
          hm.src = '//hm.baidu.com/hm.js?e26fdfab17035fb864d61b84a203c56f';
        } else {
          hm.src = '//hm.baidu.com/hm.js?' + hmtID + '';
        }
        console.log(hm.src);
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
      },
      sendBDPV: function (pageUrl) {
        console.log('sendBDPV');
        if (typeof pageUrl === 'undefined') {
          pageUrl = window.location.href;
        }
        console.log('pageUrl--->', pageUrl);
        _hmt.push(['_trackPageview', pageUrl]);
      },
      getFlashVersion:function () {
        var flashVer ='24';
        var ua = navigator.userAgent;

        if (window.ActiveXObject) {
          var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

          if (swf) {
            flashVer = Number(swf.GetVariable('$version').split(' ')[1].replace(/,/g, '.').replace(/^(d+.d+).*$/, "$1"));
          }
        } else {
          if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins['Shockwave Flash'];

            if (swf) {
              var arr = swf.description.split(' ');
              for (var i = 0, len = arr.length; i < len; i++) {
                var ver = Number(arr[i]);

                if (!isNaN(ver)) {
                  flashVer = ver;
                  break;
                }
              }
            }
          }
        }
        return flashVer;
      },
      handleLEpv: function (pageUrl) {
        var flashVer = methods.getFlashVersion();
        console.log('handleLEpv');
        var INFO = window.__INFO__ || {};
        var VIDEO = INFO.video || {}; // 兼容新旧版播放页
        var ENCODE = encodeURIComponent;
        this.UID = this.getCookie('ssouid');
        if (typeof pageUrl === 'undefined') {
          pageUrl = window.location.href;
        }
        console.log(pageUrl);
        var REF = document.referrer;
        console.log('setting.nt-->', setting.nt)
        var data = {
          app_name:'vip_lebi',
          apprunid:'vip_lebi.'+Date.now(),
          app:flashVer,
          stime:Date.now(),
          ctime:Date.now(),
          nt: setting.nt,
        //  ver: setting.VER,
          p1: setting.P1,
          p2: setting.P2,
          cid: VIDEO.cid || '-',
          pid: VIDEO.pid || '-',
          vid: VIDEO.vid || '-',
          auid: '-',
          rcid: '-',
          kw: '-',
          ct: '1',
          uuid: this.getUUID(),
          lc: this.getLC(),
          ref: ENCODE(REF || pageUrl),
          cur_url: ENCODE(pageUrl),
          ch: this.CH(),
        //  ilu: this.UID ? '0' : '1',
          uid: this.UID || '-',
          weid: this.WEID,
          r: (Math.random()) * 10000000000000000
        };
        console.log('data---------->', data.nt);
        var param = [];
        for (var k in data) {
          if (Object.prototype.hasOwnProperty.call(data, k)) {
            param.push(k + '=' + data[k]);
          }
        }
        var url = setting.api_pgv + param.join('&');
        methods.imgRequest(url, function () {
          // console.log('');
        });
      },
      handleLEop: function (acode, ap, pageUrl) {
        console.log('handleLEop');
        var flashVer = methods.getFlashVersion();
        var INFO = window.__INFO__ || {};
        var VIDEO = INFO.video || {}; // 兼容新旧版播放页
        var ENCODE = encodeURIComponent;
        this.UID = this.getCookie('ssouid');
        if (typeof pageUrl === 'undefined') {
          pageUrl = window.location.href;
        }
        var data = {
          app_name:'vip_lebi',
          apprunid:'vip_lebi.'+Date.now(),
          app:flashVer,
          ctime:Date.now(),
          stime:Date.now(),
          nt: setting.nt,
          acode: acode, // 动作码，所有值见附表四。这里默认点击。
          ap: ap || '-', // 动作属性，业务线自己维护
          ar: '0', // 动作结果 0：成功；1：失败
          ch: this.CH(),
        //  ver: setting.VER,//字段停用一会删除
          p1: setting.P1,
          p2: setting.P2,
          cid: VIDEO.cid || '-',
          pid: VIDEO.pid || '-',
          vid: VIDEO.vid || '-',
          auid: '-',
          uuid: methods.getUUID(),
          lc: methods.getLC(),
          cur_url: ENCODE(pageUrl),
        //  ilu: this.UID ? '0' : '1',
          uid: this.UID || '-',
          r: (Math.random()) * 10000000000000000
        };
        console.log('data.nt--->', data.nt)
        var param = [];
        for (var k in data) {
          if (Object.prototype.hasOwnProperty.call(data, k)) {
            param.push(k + '=' + data[k]);
          }
        }
        var url = setting.api_op + param.join('&');
        // 发送数据
        this.imgRequest(url, function () {
          // console.log(data);
        });
      },
      // 获取code 值
      getCode: function (actionCode) {
        return setting.attribute[actionCode];
      },
      getString: function (actionCode) {
        for (var n in setting.attribute) {
          if (setting.attribute[n] == actionCode) {
            return n;
          }
        }
      },
      imgRequest: function (url, callback, random) {
        if (callback === false) {
          random = false;
        }
        /* callback === false && (random = false);*/
        var rnd = String(Math.random());
        var img = methods[rnd] = new Image();
        img.onload = function () {
          console.log('onload');
          img = methods[rnd] = null;
          if (callback) {
            if (typeof callback === 'string') {
              window.location.href = callback;
            } else {
              callback();
            }
          }
        };
        if (random === false) {
          img.src = url;
        } else if ((url.indexOf('?') > 0)) {
          img.src = url + '&_=' + rnd;
        } else {
          img.src = url + '?_=' + rnd;
        }
        /*    img.src = random === false ? url :
         (url.indexOf('?') > 0 ? url + '&_=' + rnd : url + '?_=' + rnd);*/
        /*   console.log(img.src)
         img.onerror = function () {
         alert('数据上报错误')
         };*/
        // 除了callback，同时确保在ie和firefox下页面关闭时也能发出img请求
        setTimeout(function () {
          if (img && callback) {
            if (typeof callback === 'string') {
              window.location.href = callback;
            } else {
              callback();
            }
            callback = false;
          }
        }, 1000);
      },
      getCookie: function (name) {
        var reg = new RegExp('(?:^| )' + name + '=([^;]*)(?:;|\x24)');
        var match = reg.exec(document.cookie);
        return match ? unescape(match[1]) : '';
      },
      setCookie: function (name, value, opt) {
        if (typeof opt === 'undefined') {
          opt = {};
        }
        var t = new Date();
        var exp = opt.exp;
        if (typeof exp === 'number') {
          t.setTime(t.getTime() + (exp * 3600000)); // 60m * 60s * 1000ms
        } else if (exp === 'forever') {
          t.setFullYear(t.getFullYear() + 50); // 专业种植cookie 50年
        } else if (value === null) { // 删除cookie
          value = '';
          t.setTime(t.getTime() - 3600000);
        } else if (exp instanceof Date) { // 传的是一个时间对象
          t = exp;
        } else {
          t = '';
        }
        document.cookie = name + '=' + escape(value) + (t && '; expires=' + t.toGMTString()) +
          '; domain=' + (opt.domain || this.cookieDomain) + '; path=' + (opt.path || '/') +
          (opt.secure ? '; secure' : '');
      },
      isPC: function isPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'windows Phone', 'iPad', 'iPod'];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },
      detect: function detect(ua, platform) {
        var os = this.os = {};
        var browser = this.browser = {};
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        if (ipad) {
          os.ios = os.ipad = true;
          os.version = ipad[2].replace(/_/g, '.');
        }
      },
      // ok
      handlePC: function () {
        if (this.isPC()) {
          console.log('pc');
          methods.P1 = '1';
          methods.P2 = '10';
          methods.getLC = function () {
            var lc = this.getCookie('tj_lc');
            if (lc) {
              return lc;
            }
            if (lc) {
              this.setCookie('tj_lc', lc);
            } else {
              lc = '';
              var i = 32; // 不带中划线的32位全局唯一标识符（GUID）
              while (i--) {
                lc += Math.floor(Math.random() * 16).toString(16);
              }
            }
            return lc;
          };
          methods.setLC = function (lc) {
            this.setCookie('tj_lc', lc, { exp: 'forever' });
          };
        } else {
          // 移动端
          console.log('移动端');
          methods.P1 = '0';
          methods.P2 = '06';
          // HTML5站、m站就记录在cookie里
          methods.browser.iPad = true;// 统计代码里使用，为保证能正常走入M站，复写Stats.getLC,强制将未定义$.browser.iPad设置为真
          console.log(methods.browser);
          if (methods.browser.iPad || methods.browser.andorid || window.location.host.match(/\bm\.le\.com/)) {
            methods.getLC = function () {
              var lc = this.getCookie('tj_lc');
              if (!lc) {
                // 20位数字
                // lc = String(new Date().getTime())+String(Math.random()).slice(-7);

                lc = '';
                var i = 32; // 不带中划线的32位全局唯一标识符（GUID）
                while (i--) {
                  lc += Math.floor(Math.random() * 16).toString(16);
                }
                var cookieName = 'tj_lc';
                this.setCookie(cookieName, lc, { exp: 'forever' });
              }
              return lc;
            };
            methods.P1 = '0';
            if (window.location.host.match(/\bm\.le\.com/)) {
              methods.P2 = '04'; // M站
            } else {
              methods.P2 = '06'; // HTML5站
            }
          }
        }
      },
      // 获取uuid：一次用户访问的唯一标识
      getUUID: function () {
        var uuid = this.getCookie('tj_uuid');
        if (!uuid) {
          // 20位数字
          uuid = String(new Date().getTime()) + String(Math.random()).slice(-7);
          this.setCookie('tj_uuid', uuid);
        }
        return uuid;
      },
      // 获取渠道
      CH: function () {
        function detect(items) {
          var br = 'letv'; // 默认值letv
          var userAgent = navigator.userAgent.toLowerCase();
          var item;
          var i;
          var len;
          var tag;
          var got;
          var j;
          for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            tag = item.tag;
            got = typeof tag === 'string' ? userAgent.indexOf(tag) > -1 : tag.test(userAgent);
            if (got) {
              br = item.flag;
              break;
            }
          }
          // 今日头条的ua貌似取得很慢，不准；来自头条的地址都含有'site=toutiaonews'
          if (location.href.indexOf('site=toutiaonews') > 0) {
            br = 'toutiao';
          }
          return br;
        }

        var browsers = [
          { tag: 'liebaofast', flag: 'liebao' }, // 猎豹浏览器
          { tag: 'letvmobileclient', flag: 'letvmobcli' }, // 乐视领先版
          { tag: 'letvclient', flag: 'letvcli' }, // 乐视客户端
          { tag: 'micromessenger', flag: 'weixin' }, // 微信
          { tag: '__weibo__', flag: 'weibo' }, // 微博
          { tag: /ucbrowser|ucweb/, flag: 'uc' }, // UC浏览器
          { tag: /leuibrowser|eui browser/, flag: 'leui' }, // 乐视手机浏览器
          { tag: 'baiduboxapp', flag: 'baidubox' }, // 手机百度
          { tag: 'baidubrowser', flag: 'baidubrowser' }, // 百度浏览器
          { tag: 'qqbrowser', flag: 'qq' }, // QQ浏览器
          { tag: 'qq', flag: 'qq' }, // QQ
          { tag: 'qqlivebrowser', flag: 'qqlive' }, // QQLive浏览器
          { tag: 'oppobrowser', flag: 'oppo' }, // oppo手机浏览器
          { tag: 'sogoumobilebrowser', flag: 'sougou' }, // 搜狗手机浏览器
          { tag: 'xiaomi', flag: 'xiaomi' }, // 小米手机
          { tag: 'storm_browser', flag: 'storm' }, // 暴风影音
          { tag: '360video', flag: '360video' }, // 360影视大全
          { tag: 'qqdownloader', flag: 'yyb' }, // 腾讯应用宝
          { tag: 'wandoujia spider', flag: 'wandoujia' }, // 豌豆荚
          { tag: 'mogujie', flag: 'mogujie' }, // 蘑菇街
          // {tag: 'newsarticle', flag: 'toutiao'}, // 今日头条
          { tag: 'dolphinbrowsercn', flag: 'dolphin' }, // 海豚浏览器
          { tag: 'kanqiu', flag: 'hupu' }, // 虎扑体育
          { tag: 'iemobile', flag: 'iemobile' }, // IE手机浏览器
          { tag: 'msie ', flag: 'ie' }, // IE浏览器
          { tag: 'chrome', flag: 'chrome' }, // 谷歌浏览器
          { tag: 'crios', flag: 'chrome' }, // 谷歌浏览器
          { tag: 'firefox', flag: 'firefox' }, // firefox浏览器
          { tag: 'opera', flag: 'opera' }, // opera浏览器
          { tag: /iphone.+?\bsafari/, flag: 'safari' }, // safari浏览器
          { tag: /iphone.+?\bmobile\/\w+$/, flag: 'gaosu' } // 高速浏览器
        ];
        return detect(browsers);
      },
      WEID: String(new Date().getTime()) + String(Math.random()).slice(-7),
      getUrl: function (data) {
        var param = [];
        for (var k in data) {
          if (Object.prototype.hasOwnProperty.call(data, k)) {
            param.push(k + '=' + data[k]);
          }
        }
        return param.join('&');
      }
    };
    var setting = {
      attribute: { 0: 'click', 4: 'share', 5: 'recharge' },
      VER: '3.7.5',
      api_host: 'http://apple.www.letv.com',
      P1: '1', // 一级业务线代码 网页1 移动0
      P2: '10', // 二级产品线代码 网页10 M站04 HTML5站06
      cookieDomain: '',
      api_op: 'http://apple.www.letv.com/op/?', // 'http://develop.bigdata.le.com/0bb6/op/?' op接口
      api_pgv: 'http://apple.www.letv.com/pgv/?' // pv日
    };
    methods.detect(navigator.userAgent, navigator.platform);
    methods.handlePC();
    // 处理微信 网络环境
    // 可以更改为 所有的
    setting.nt = 'none'
    if (typeof wx !== 'undefined') {
      try {
        wx.getNetworkType({
          success: function (res) {
            console.log(res);
            setting.nt = res.networkType; // 返回网络类型2g，3g，4g，wifi
          }
        });
      } catch (e) {
        setting.nt = 'none';
      }
    } else {
      setting.nt = 'none';
    }
    var commands = {
      sendAction: function sendAction(actionCode, actionProperties) {
        console.log('sendAction');
        var ap;
        var codeString;
        if (Object.prototype.toString.call(actionProperties) === '[object Object]') {
          var ary = [];
          for (var item in actionProperties) {
            if (Object.prototype.hasOwnProperty.call(actionProperties, item)) {
              ary.push(item + '=' + actionProperties[item]);
            }
          }
          ap = encodeURIComponent(ary.join(''));
          actionProperties = ary.join('');
        } else {
          ap = encodeURIComponent(actionProperties);
        }
        if (typeof actionCode === 'number') {
          codeString = methods.getCode(actionCode);
        } else {
          codeString = actionCode;
        }
        if (this.baidu) {
          console.log('this.baidu');
          console.log('codeString + actionProperties---', actionProperties);
          _hmt.push(['_trackEvent', codeString, actionProperties]);
        }
        if (this.le) {
          if (typeof actionCode === 'string') {
            actionCode = methods.getString(actionCode);
          }
          methods.handleLEop(actionCode, ap);// actionCode 需要显示什么 数组
        }
      },
      sendPV: function (pageUrl) {
        console.log('sendPV');
        // 问题：初始化不行 自动初始化不行
        if (typeof pageUrl !== 'undefined') {
          window.id = pageUrl;
        }
        if (this.baidu || methods.flag) {
          methods.sendBDPV(pageUrl);// ok
        }
        if (this.le || methods.flag) {
          console.log('sendLEPv');
          methods.handleLEpv(pageUrl);
        }
      },
      config: function (options) {
        console.log('config');// this:methods
        for (var n in options) {
          if (options[n] === false) {
            this[n] = options[n];
          } else {
            this[n] = options[n];
          }
        }
        if (methods.baidu) {
          methods.initBai.bind(null, methods.baidu)();
        }
        if (this.autoPV === false) {
          console.log('不是自动发送');
          _hmt.push(['_setAutoPageview', false]);
        } else {
          commands.sendPV.call(this);
        }
        methods._extend(setting, options);
        var apiHost = setting.api_host;
        setting.cookieDomain = '.' + apiHost;
        setting.api_op = apiHost + '/op/?';
        setting.api_pgv = apiHost + '/pgv/?';
      }
    };
    if (lebi.q && lebi.q.length) {
    // 没有config的时候 有sendPV 是发送的
      methods.flag = true;  // 主要是处理config
      for (var i = 0; i < lebi.q.length; i++) {
        if (lebi.q[i][0] === 'config') {
          methods.flag = false;
        }
      }
      lebi.q.push = function (command) {
        console.log(command);
        var args = [].slice.call(command);
        var commandName = args.shift();
        if (commands[commandName]) {
          commands[commandName].apply(methods, args);
        }
      };
      while (lebi.q.length) {
        lebi.q.push.call(lebi.q, lebi.q.shift());
      }
    } else {
      debugger;
    // 页面打开 什么也没写会自动百度pv 没有config
      methods.sendBDPV();
      methods.handleLEpv();
    }
  /*  setTimeout(function () {
      if (methods.baidu) {
        methods.initBai.bind(null, methods.baidu)();
      }
    });*/
  }(window));

