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
    var deep = false;
    var option, name, src, copy, copyIsArray, clone;

    // 参数重载处理
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1];
      i = 2;
    }

    if (typeof target !== 'object') {
      target = {};
    }

    // 扩展 jQuery 本身 或者 扩展 jQuery 原型对象
    if (length === i) {
      target = this;
      i--;
    }

    for (; i < length; i++) { // 只遍历第1个参数之后的对象
      if ((option = arguments[i]) != null) {
        for (name in option) {
          copy = option[name];
          src = target[name];
          if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            // 确保目标对象是正确的数据类型
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy != null) {
            // 待拷贝属性非空，则将该属性拷贝到目标对象
            target[name] = copy;
          }
        }
      }
    }

    return target;
  };


  // 共享原型，解决无限递归返回jQuery对象的问题
  jQuery.fn.init.prototype = jQuery.fn;

  jQuery.extend({
    //类型检测
    isPlainObject: function (obj) {
      return toString.call(obj) === "[object Object]";
    },
    isArray: function (obj) {
      return toString.call(obj) === "[object Array]";
    }
  });

  root.$ = root.jQuery = jQuery;
})(this);
