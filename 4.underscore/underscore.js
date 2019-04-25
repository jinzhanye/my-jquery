(function (root) {
  var push = Array.prototype.push;
  // 既可以用 new 调用，可以当函数调用
  // 无论以哪个形式调用最终都会返回一个 { wrapped:obj } 对象
  var _ = function (obj) {
    //  TODO 为什么不能创建多层嵌套的 _ 对象??
    if (obj instanceof _) {
      return obj;
    }

    if (!(this instanceof _)) {
      return new _(obj);
    }

    this._wrapped = obj;
  };

  _.prototype.value = function () {
    return this._wrapped;
  };

  _.unique = function (arr, callback) {
    var ret = [];
    var target, i = 0;
    for (; i < arr.length; i++) {
      var target = callback ? callback(arr[i]) : arr[i];
      if (ret.indexOf(target) === -1) {
        ret.push(target);
      }
    }

    return ret;
  };

  _.map = function (obj, iteratee, context) {
    var iteratee = cb(iteratee, context);
    var keys = !_.isArray(obj) && Object.keys(obj);
    var length = (keys || obj).length;
    var result = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      result[index] = iteratee(obj[currentKey], index, obj);
    }

    return result;
  };

  var cb = function (iteratee, context, count) {
    if (iteratee == null) {
      return _.identity;
    }

    if (_.isFunction(iteratee)) {
      return optimizeCb(iteratee, context, count);
    }
  };

  var optimizeCb = function (func, context, count) {
    if (context == void 0) {
      return func;
    }

    switch (count == null ? 3 : count) {
      case 1:
        return function (value) {
          return func.call(context, value);
        }
      case 3:
        return function (value, index, obj) {
          return func.call(context, value, index, obj);
        }
    }
  };

  _.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  var result = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  _.functions = function (obj) {
    var result = [];
    var key;
    for (key in obj) {
      result.push(key);
    }
    return result;
  }

  _.identity = function (value) {
    return value;
  };

  _.restArguments = function (func) {
    // func.length 获取函数参数长度
    var startIndex = func.length - 1;
    return function () {
      var length = arguments.length - startIndex,// rest 数组长度
        rest = Array(length),
        index = 0;
      // 构造rest数组
      for(;index < length; index++){
        rest[index] = arguments[index + startIndex];
      }
      // 构造非rest参数
      var args = Array(startIndex + 1);
      for(index = 0; index < startIndex; index++){
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  _.each = function (target, callback) {
    var key, i = 0;
    if (_.isArray(target)) {
      var length = target.length;
      for (; i < length; i++) {
        callback.call(target, target[i], i);
      }
    } else {
      for (key in target) {
        callback.call(target, key, target[key]);
      }
    }
  };

  _.isFunction = function (array) {
    return toString.call(array) === "[object Function]";
  };


  _.isArray = function (array) {
    return toString.call(array) === "[object Array]";
  };

  _.mixin = function (obj) {
    _.each(_.functions(obj), function (name) {
      var func = obj[name];

      _.prototype[name] = function () {
        var args = [this._wrapped];
        push.apply(args, arguments);

        return result(this, func.apply(this, args));
      };
    });
  };

  _.mixin(_);
  root._ = _;
})(this);
