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

  _.map = function (arr) {
    return arr.map(function (item) {
      return item + ' mapped';
    });
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
