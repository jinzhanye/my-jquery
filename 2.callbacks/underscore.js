(function (root) {
  var optionsCache = {};
  var _ = {
    // options 可以是对象或者字符串
    // options: once || stopOnfalse || memory
    callbacks: function (options) {
      options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : {};
      var list = [];
      // testting 标记fire是否已经执行过一次
      var index, length, testting, memory, start, starts;

      var fire = function (data) {
        // 必须进行一次fire后才记录memory
        memory = options.memory && data;
        index = starts || 0;
        // 为什么这里要重置0，似乎不重置对程序也没有影响
        start = 0;
        testting = true;
        length = list.length;
        for (; index < length; index++) {
          if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
            break;
          }
        }
      };

      var self = {
        add: function () {
          var args = Array.prototype.slice.call(arguments);
          // 记录开始位置，供 memory 使用
          start = list.length;
          args.forEach(function (fn) {
            if (toString.call(fn) === '[object Function]') {
              list.push(fn);
            }
          });
          if (memory) {
            starts = start;
            fire(memory);
          }
        },
        fireWidth: function (context, arguments) {
          var args = [context, arguments];
          if (!options.once || !testting) {
            fire(args);
          }
        },
        fire: function () {
          self.fireWidth(this, arguments);
        }
      };

      return self;
    }
  };

  function createOptions(options) {
    var object = optionsCache[options] = {};
    options.split(/\s+/).forEach(function (value) {
      object[value] = true;
    });
    return object;
  }

  root._ = _;
})(this);
