(function (root) {
  var jQuery = function () {
    return new jQuery.prototype.init();
  };

  jQuery.fn = jQuery.prototype = {
    // 如果用es6写法 init(){}，会报错 https://blog.csdn.net/lincifer/article/details/53191961
    init: function () {

    },
    css: function () {

    }
  };

  // extend
  jQuery.fn.extend = jQuery.extend = function () {
    var target = arguments[0] || {};
    var length = arguments.length;
    var i = 1;
    var option;

    if (typeof target !== 'object') {
      target = {};
    }

    // 扩展 jQuery 本身 或者 扩展 jQuery 原型对象
    if (length === i) {
      target = this;
      i--;
    }

    for (; i < length; i++) { // 只遍历第1个参数之后的对象
      if((option = arguments[i]) != null){
        for (name in option) {
          target[name] = option[name];
        }
      }
    }

    return target;
  };


  // 共享原型，解决无限递归返回jQuery对象的问题
  jQuery.fn.init.prototype = jQuery.fn;

  root.$ = root.jQuery = jQuery;
})(this);
