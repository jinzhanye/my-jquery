(function (root) {
  var version = "1.0.1";
  var optionsCache = {};

  var jQuery = function () {
    return new jQuery.prototype.init();
  };

  jQuery.fn = jQuery.prototype = {
    init: function () {

    },
    css: function () {

    },
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
    },
    isFunction: function (fn) {
      return toString.call(fn) === "[object Function]";
    },
    callbacks: function (options) {
      options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
      var list = [];
      var index, length, testting, memory, start, starts;
      var fire = function (data) {
        memory = options.memory && data;
        index = starts || 0;
        start = 0;
        testting = true;
        length = list.length;
        for (; index < length; index++) {
          if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
            break;
          }
        }
      }
      var self = {
        add: function () {
          var args = Array.prototype.slice.call(arguments);
          start = list.length;
          args.forEach(function (fn) {
            if (toString.call(fn) === "[object Function]") {
              list.push(fn);
            }
          });
          if (memory) {
            starts = start;
            fire(memory);
          }
          return this;
        },
        //指定上下文对象
        fireWith: function (context, arguments) {
          var args = [context, arguments];
          if (!options.once || !testting) {
            fire(args);
          }

        },
        //参数传递
        fire: function () {
          self.fireWith(this, arguments);
        }
      }
      return self;
    },
    Deferred: function (func) {
      var tuples = [
          ['resolve', 'done', jQuery.callbacks('once memory'), 'resolved'],
          ['fail', 'fail', jQuery.callbacks('once memory'), 'rejected'],
          ['notify', 'progress', jQuery.callbacks('memory')]
        ],
        state = 'pending',
        promise = {
          state: function () {
            return state;
          },
          then: function () {},
          promise: function (obj) {
            return obj != null ? jQuery.extend(obj, promise) : promise;
          }
        },
        // promise 其他方法 done | fail | progress
        // resolve、fail、notify ，包括所有 promise 的方法
        deferred = {};

      tuples.forEach(function (tuple, i) {
        var list = tuple[2],// 根据不同状态创建队列
          stateString = tuple[3];

        // promise[ done | fail | progress ] = list.add
        promise[tuple[1]] = list.add;

        if (stateString) {
          list.add(function () {
            // state = [ resolved | rejected ]
            state = stateString;
          });
        }

        // deferred[ resolve | reject | notify ]
        deferred[tuple[0]] = function () {
          deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
          return this;
        };

        deferred[tuple[0] + 'With'] = list.fireWith;
      });

      promise.promise(deferred);
      return deferred;
    },
    when:function (subordinate) {
      return subordinate.promise();
    }
  });

  function createOptions(options) {
    var object = optionsCache[options] = {};
    options.split(/\s+/).forEach(function(value) {
      object[value] = true;
    });
    return object;
  }

  root.$ = root.jQuery = jQuery;
})(this);
