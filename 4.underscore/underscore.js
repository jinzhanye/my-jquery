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
        };
      case 3:
        return function (value, index, obj) {
          return func.call(context, value, index, obj);
        };
      case 4:
        return function (memo, value, index, obj) {
          return func.call(context, memo, value, index, obj);
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
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      // 构造非rest参数
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  var createReduce = function (dir) {
    var reduce = function (obj, iteratee, memo, init) {
      var keys = !_.isArray(obj) && Object.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;

      if (!init) {
        // 默认初始值是第一个 || 最后一个元素
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }

      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function (obj, iteratee, memo, context) {
      // 如果传参大于等于3个表明reduce初始值也传了进来
      var init = arguments.length >= 3;
      return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
    }
  };
  _.reduce = createReduce(1);
  _.reduceRight = createReduce(-1);

  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function (value, index, list) {
      if (predicate(value, index, list)) {
        results.push(value);
      }
    });
    return results;
  };

  // 返回一个 [min, max] 范围内的任意整数
  _.random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    // 3-6  3    0-1*4  !0 !4
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  _.clone = function (obj) {
    // _.extend 未定义
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  _.shuffle = function (array) {
    // Infinity 比 array.length 优雅
    return _.sample(array, Infinity);
  };
  _.sample = function (array, n) {
    if (n == null) {
      // 随机返回一个元素
      return array[_.random(array.length - 1)];
    }
    var sample = _.clone(array);
    var length = sample.length;
    var last = length - 1;
    n = Math.max(Math.min(n, length), 0);
    // 洗牌算法
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
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

  _.isFunction = function (fn) {
    return toString.call(fn) === "[object Function]";
  };

  _.isArray = function (array) {
    return toString.call(array) === "[object Array]";
  };

  _.isBoolean = function (b) {
    return toString.call(b) === "[object Boolean]";
  };

  _.isString = function (b) {
    return toString.call(b) === "[object String]";
  };

  _.uniq = _.unique = function (array, isSorted, iteratee, context) {
    // 没有传入 isSorted 参数
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }

    if (iteratee != null) {
      iteratee = cb(iteratee, context);
    }

    var result = [];
    // 用来过滤重复值
    var seen;

    for (var i = 0; i < array.length; i++) {
      var computed = iteratee ? iteratee(array[i], i, array) : array[i];
      if (isSorted) {
        if (!i || seen !== computed) {
          result.push(computed);
        }
        seen = computed;
      } else if (result.indexOf(computed) === -1) {
        result.push(computed);
      }
    }

    return result;
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
