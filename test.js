// Generated by CoffeeScript 1.7.1
(function() {
  var Observer, Signal, assert, _ref;

  assert = require('assert');

  _ref = require('./reactor'), Signal = _ref.Signal, Observer = _ref.Observer;

  describe('Signal', function() {
    describe('Initialization', function() {
      return it('should initialize without error', function() {
        var arraySignal, numberSignal, objectSignal, stringSignal;
        numberSignal = Signal(123456789);
        stringSignal = Signal("foo");
        arraySignal = Signal([]);
        return objectSignal = Signal({});
      });
    });
    describe('Reading', function() {
      it('should read the inital value without error', function() {
        var arraySignal, numberSignal, objectSignal, stringSignal;
        numberSignal = Signal(123456789);
        stringSignal = Signal("foo");
        arraySignal = Signal([]);
        objectSignal = Signal({});
        numberSignal();
        stringSignal();
        arraySignal();
        return objectSignal();
      });
      it('should return the initial value when read', function() {
        var arraySignal, arrayValue, numberSignal, numberValue, objectSignal, objectValue, stringSignal, stringValue;
        numberValue = 123456789;
        stringValue = "foo";
        arrayValue = [];
        objectValue = {};
        numberSignal = Signal(numberValue);
        stringSignal = Signal(stringValue);
        arraySignal = Signal(arrayValue);
        objectSignal = Signal(objectValue);
        assert.equal(numberSignal(), 123456789);
        assert.equal(stringSignal(), "foo");
        assert.equal(arraySignal(), arrayValue);
        return assert.equal(objectSignal(), objectValue);
      });
      return it('should be readable multiple times without changing the value', function() {
        var a, aValue;
        aValue = 123456789;
        a = Signal(123456789);
        assert.equal(a(), 123456789);
        assert.equal(a(), 123456789);
        assert.equal(a(), 123456789);
        assert.equal(a(), 123456789);
        return assert.equal(a(), 123456789);
      });
    });
    describe('Writing', function() {
      it('should write a new value without error', function() {
        var arraySignal, numberSignal, objectSignal, stringSignal;
        numberSignal = Signal(123456789);
        stringSignal = Signal("foo");
        arraySignal = Signal([]);
        objectSignal = Signal({});
        numberSignal(987654321);
        stringSignal("bar");
        arraySignal([]);
        return objectSignal({});
      });
      it('should return the written value on write', function() {
        var arraySignal, newArrayValue, newNumberValue, newObjectValue, newStringValue, numberSignal, objectSignal, stringSignal;
        numberSignal = Signal(123456789);
        stringSignal = Signal("foo");
        arraySignal = Signal(["a", "b", "c"]);
        objectSignal = Signal({
          "foo": 1
        });
        newNumberValue = 987654321;
        newStringValue = "bar";
        newArrayValue = [1, 2, 3];
        newObjectValue = {
          "bar": 2
        };
        assert.equal(numberSignal(newNumberValue), newNumberValue);
        assert.equal(stringSignal(newStringValue), newStringValue);
        assert.equal(arraySignal(newArrayValue), newArrayValue);
        return assert.equal(objectSignal(newObjectValue), newObjectValue);
      });
      return it('should return the new value on subsequent reads', function() {
        var arraySignal, newArrayValue, newNumberValue, newObjectValue, newStringValue, numberSignal, objectSignal, stringSignal;
        numberSignal = Signal(123456789);
        stringSignal = Signal("foo");
        arraySignal = Signal(["a", "b", "c"]);
        objectSignal = Signal({
          "foo": 1
        });
        newNumberValue = 987654321;
        newStringValue = "bar";
        newArrayValue = [1, 2, 3];
        newObjectValue = {
          "bar": 2
        };
        numberSignal(newNumberValue);
        stringSignal(newStringValue);
        arraySignal(newArrayValue);
        objectSignal(newObjectValue);
        assert.equal(numberSignal(), newNumberValue);
        assert.equal(stringSignal(), newStringValue);
        assert.equal(arraySignal(), newArrayValue);
        return assert.equal(objectSignal(), newObjectValue);
      });
    });
    describe('Propagation', function() {
      it("should initialize a dependent signal without error", function() {
        var a, b;
        a = Signal(1);
        return b = Signal(function() {
          return a() + 1;
        });
      });
      it("should initialize a dependent signal with the correct value", function() {
        var a, b;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        return assert.equal(b(), 2);
      });
      it('should propagate changes to a dependent signal', function() {
        var a, b;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        a(2);
        return assert.equal(b(), 3);
      });
      it('should initialize multiple dependent signals without error', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        return c = Signal(function() {
          return a() + 2;
        });
      });
      it('should initialize multiple dependent signals with the correct values', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          return a() + 2;
        });
        assert.equal(a(), 1);
        assert.equal(b(), 2);
        return assert.equal(c(), 3);
      });
      it('should propagate changes to multiple dependent signals', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          return a() + 2;
        });
        a(2);
        assert.equal(a(), 2);
        assert.equal(b(), 3);
        return assert.equal(c(), 4);
      });
      it('should initialize sequential dependencies without error', function() {
        var a, b, c, d;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          return b() + 1;
        });
        return d = Signal(function() {
          return c() + 1;
        });
      });
      it('should initialize sequential dependencies with the correct values', function() {
        var a, b, c, d;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          return b() + 1;
        });
        d = Signal(function() {
          return c() + 1;
        });
        assert.equal(a(), 1);
        assert.equal(b(), 2);
        assert.equal(c(), 3);
        return assert.equal(d(), 4);
      });
      it('should propagate changes to sequential dependencies', function() {
        var a, b, c, d;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          return b() + 1;
        });
        d = Signal(function() {
          return c() + 1;
        });
        a(10);
        assert.equal(a(), 10);
        assert.equal(b(), 11);
        assert.equal(c(), 12);
        return assert.equal(d(), 13);
      });
      it('should initialize convergent dependencies without error', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(2);
        return c = Signal(function() {
          return a() + b();
        });
      });
      it('should initialize convergent dependencies with the correct value', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(2);
        c = Signal(function() {
          return a() + b();
        });
        assert.equal(a(), 1);
        assert.equal(b(), 2);
        return assert.equal(c(), 3);
      });
      it('should propagate changes to convergent dependencies', function() {
        var a, b, c;
        a = Signal(1);
        b = Signal(2);
        c = Signal(function() {
          return a() + b();
        });
        a(7);
        assert.equal(a(), 7);
        assert.equal(b(), 2);
        assert.equal(c(), 9);
        b(3);
        assert.equal(a(), 7);
        assert.equal(b(), 3);
        return assert.equal(c(), 10);
      });
      it("should break unneeded dependencies after manual redefinition", function() {
        var a, b;
        a = Signal(1);
        b = Signal(function() {
          return a();
        });
        assert.equal(a(), 1);
        assert.equal(b(), 1);
        a(2);
        assert.equal(a(), 2);
        assert.equal(b(), 2);
        b(3);
        assert.equal(a(), 2);
        assert.equal(b(), 3);
        a(7);
        assert.equal(a(), 7);
        return assert.equal(b(), 3);
      });
      it("should dynamically determine dependencies", function() {
        var a, b, c, d, triggerCount;
        triggerCount = 0;
        a = Signal(true);
        b = Signal("foo");
        c = Signal("bar");
        d = Signal(function() {
          triggerCount += 1;
          if (a()) {
            return b();
          } else {
            return c();
          }
        });
        assert.equal(triggerCount, 1);
        b("hi");
        assert.equal(triggerCount, 2);
        c("hello");
        assert.equal(triggerCount, 2);
        a(false);
        assert.equal(triggerCount, 3);
        c("hello again");
        assert.equal(triggerCount, 4);
        b("hi again");
        return assert.equal(triggerCount, 4);
      });
      return it("should only propagate changes to signals which have not seen the value already", function() {
        var a, b, c, triggerCount;
        triggerCount = 0;
        a = Signal(1);
        b = Signal(function() {
          return a() + 1;
        });
        c = Signal(function() {
          a() + b();
          return triggerCount += 1;
        });
        a(2);
        return assert.equal(triggerCount, 2);
      });
    });
    return describe("Array and Object convenience methods", function() {
      it("TODO rewrite: object setter", function() {
        var a, b;
        a = Signal({});
        b = Signal(function() {
          return "Serialized: " + JSON.stringify(a());
        });
        assert.equal(b(), "Serialized: {}");
        a()["x"] = 1;
        assert.equal(JSON.stringify(a()), '{"x":1}');
        assert.equal(b(), "Serialized: {}");
        a(a());
        assert.equal(JSON.stringify(a()), '{"x":1}');
        assert.equal(b(), 'Serialized: {"x":1}');
        a.set("x", 2);
        assert.equal(JSON.stringify(a()), '{"x":2}');
        assert.equal(b(), 'Serialized: {"x":2}');
        a(3);
        assert.equal(a(), 3);
        assert.equal(b(), 'Serialized: 3');
        return assert.equal(a.set, void 0);
      });
      it("TODO rewrite: basic array push ", function() {
        var a;
        a = Signal([]);
        a.push("x");
        return assert.equal(JSON.stringify(a()), '["x"]');
      });
      it("TODO rewrite: array initialized properly", function() {
        var a;
        a = Signal([]);
        a.push("x");
        assert.equal(JSON.stringify(a()), '["x"]');
        a.push("y");
        assert.equal(JSON.stringify(a()), '["x","y"]');
        a.pop();
        assert.equal(JSON.stringify(a()), '["x"]');
        a.pop();
        assert.equal(JSON.stringify(a()), '[]');
        a.unshift("x");
        assert.equal(JSON.stringify(a()), '["x"]');
        a.unshift("y");
        assert.equal(JSON.stringify(a()), '["y","x"]');
        a.unshift("z");
        assert.equal(JSON.stringify(a()), '["z","y","x"]');
        a.sort();
        assert.equal(JSON.stringify(a()), '["x","y","z"]');
        a.reverse();
        assert.equal(JSON.stringify(a()), '["z","y","x"]');
        a.splice(1, 1, "w");
        assert.equal(JSON.stringify(a()), '["z","w","x"]');
        a.shift();
        return assert.equal(JSON.stringify(a()), '["w","x"]');
      });
      return it("TODO rewrite: array methods", function() {
        var a, b, c, d;
        a = Signal([]);
        b = Signal(function() {
          return "Serialized: " + JSON.stringify(a());
        });
        assert.equal(JSON.stringify(a()), '[]');
        assert.equal(b(), 'Serialized: []');
        a()[0] = "x";
        assert.equal(JSON.stringify(a()), '["x"]');
        assert.equal(b(), 'Serialized: []');
        a(a());
        assert.equal(JSON.stringify(a()), '["x"]');
        assert.equal(b(), 'Serialized: ["x"]');
        a.set(1, "y");
        assert.equal(JSON.stringify(a()), '["x","y"]');
        assert.equal(b(), 'Serialized: ["x","y"]');
        a.push("z");
        assert.equal(JSON.stringify(a()), '["x","y","z"]');
        assert.equal(b(), 'Serialized: ["x","y","z"]');
        a.unshift("w");
        assert.equal(JSON.stringify(a()), '["w","x","y","z"]');
        assert.equal(b(), 'Serialized: ["w","x","y","z"]');
        c = a.shift();
        assert.equal(JSON.stringify(a()), '["x","y","z"]');
        assert.equal(b(), 'Serialized: ["x","y","z"]');
        assert.equal(c, "w");
        a.reverse();
        assert.equal(JSON.stringify(a()), '["z","y","x"]');
        assert.equal(b(), 'Serialized: ["z","y","x"]');
        d = a.pop();
        assert.equal(JSON.stringify(a()), '["z","y"]');
        assert.equal(b(), 'Serialized: ["z","y"]');
        a.push("foo");
        a.push("bar");
        assert.equal(JSON.stringify(a()), '["z","y","foo","bar"]');
        assert.equal(b(), 'Serialized: ["z","y","foo","bar"]');
        d = a.splice(1, 2);
        assert.equal(JSON.stringify(d), '["y","foo"]');
        assert.equal(JSON.stringify(a()), '["z","bar"]');
        assert.equal(b(), 'Serialized: ["z","bar"]');
        a("pies");
        assert.equal(a(), "pies");
        assert.equal(b(), 'Serialized: "pies"');
        assert.equal(a.pop, void 0);
        assert.equal(a.push, void 0);
        assert.equal(a.shift, void 0);
        assert.equal(a.unshift, void 0);
        assert.equal(a.sort, void 0);
        assert.equal(a.reverse, void 0);
        return assert.equal(a.splice, void 0);
      });
    });
  });

  describe("Observer", function() {
    it("should initialize a blank observer without error", function() {
      var anObserver;
      return anObserver = Observer(function() {});
    });
    it("should initialize an observer which reads a signal without error", function() {
      var aSignal, anObserver;
      aSignal = Signal(1);
      return anObserver = Observer(function() {
        return aSignal();
      });
    });
    it("should trigger an observer on evaluation", function() {
      var aSignal, anExternalValue, anObserver;
      aSignal = Signal(1);
      anExternalValue = null;
      assert.equal(anExternalValue, null);
      anObserver = Observer(function() {
        return anExternalValue = aSignal();
      });
      return assert.equal(anExternalValue, 1);
    });
    it("should trigger the observer when a signal is updated", function() {
      var aSignal, anExternalValue, anObserver;
      aSignal = Signal(1);
      anExternalValue = null;
      anObserver = Observer(function() {
        return anExternalValue = aSignal();
      });
      aSignal(2);
      return assert.equal(anExternalValue, 2);
    });
    it("should trigger even when observing multiple signals", function() {
      var aSignal, anExternalValue, anObserver, bSignal, cSignal, dSignal;
      aSignal = Signal(1);
      bSignal = Signal(2);
      cSignal = Signal(3);
      dSignal = Signal(4);
      anExternalValue = 0;
      anObserver = Observer(function() {
        return anExternalValue = "" + aSignal() + bSignal() + cSignal() + dSignal();
      });
      assert.equal(anExternalValue, "1234");
      aSignal(5);
      assert.equal(anExternalValue, "5234");
      return aSignal(6);
    });
    it("read write observer", function() {
      var a, b, c;
      a = Signal(1);
      b = Signal(2);
      assert.equal(a(), 1);
      assert.equal(b(), 2);
      c = Observer(function() {
        return b(a());
      });
      assert.equal(b(), 1);
      a(3);
      assert.equal(a(), 3);
      assert.equal(b(), 3);
      b(4);
      assert.equal(a(), 3);
      return assert.equal(b(), 4);
    });
    return it("another read write observer", function() {
      var a, b, c, d;
      a = 0;
      b = Signal(1);
      c = Signal(2);
      assert.equal(a, 0);
      assert.equal(b(), 1);
      assert.equal(c(), 2);
      d = Observer(function() {
        a += 1;
        b();
        return c(3);
      });
      assert.equal(a, 1);
      assert.equal(b(), 1);
      assert.equal(c(), 3);
      a = 4;
      assert.equal(a, 4);
      assert.equal(b(), 1);
      assert.equal(c(), 3);
      b(6);
      assert.equal(a, 5);
      assert.equal(b(), 6);
      assert.equal(c(), 3);
      c(7);
      assert.equal(a, 5);
      assert.equal(b(), 6);
      return assert.equal(c(), 7);
    });
  });

}).call(this);
