assert = require 'assert'
{Signal, Observer} = require './reactor'

describe 'Signal', ->

  describe 'Initialization', ->

    it 'should initialize without error', ->
      numberSignal = Signal 123456789
      stringSignal = Signal "foo"
      arraySignal = Signal []
      objectSignal = Signal {}

  describe 'Reading', ->

    it 'should read the inital value without error', ->      
      numberSignal = Signal 123456789
      stringSignal = Signal "foo"
      arraySignal = Signal []
      objectSignal = Signal {}      
      numberSignal()
      stringSignal()
      arraySignal()
      objectSignal()

    it 'should return the initial value when read', ->
      numberValue = 123456789
      stringValue = "foo"
      arrayValue = []
      objectValue = {}
      numberSignal = Signal numberValue
      stringSignal = Signal stringValue
      arraySignal = Signal arrayValue
      objectSignal = Signal objectValue     
      assert.equal numberSignal(), 123456789
      assert.equal stringSignal(), "foo"
      assert.equal arraySignal(), arrayValue
      assert.equal objectSignal(), objectValue

    it 'should be readable multiple times without changing the value', ->
      aValue = 123456789
      a = Signal 123456789
      assert.equal a(), 123456789
      assert.equal a(), 123456789
      assert.equal a(), 123456789
      assert.equal a(), 123456789
      assert.equal a(), 123456789

  describe 'Writing', ->

    it 'should write a new value without error', ->
      numberSignal = Signal 123456789
      stringSignal = Signal "foo"
      arraySignal = Signal []
      objectSignal = Signal {}
      numberSignal(987654321)
      stringSignal("bar")
      arraySignal([])
      objectSignal({})

    it 'should return the written value on write', ->
      numberSignal = Signal 123456789
      stringSignal = Signal "foo"
      arraySignal = Signal ["a", "b", "c"]
      objectSignal = Signal {"foo": 1}
      newNumberValue = 987654321
      newStringValue = "bar"
      newArrayValue = [1, 2, 3]
      newObjectValue = {"bar": 2}
      assert.equal numberSignal(newNumberValue), newNumberValue
      assert.equal stringSignal(newStringValue), newStringValue
      assert.equal arraySignal(newArrayValue), newArrayValue
      assert.equal objectSignal(newObjectValue), newObjectValue

    it 'should return the new value on subsequent reads', ->      
      numberSignal = Signal 123456789
      stringSignal = Signal "foo"
      arraySignal = Signal ["a", "b", "c"]
      objectSignal = Signal {"foo": 1}
      newNumberValue = 987654321
      newStringValue = "bar"
      newArrayValue = [1, 2, 3]
      newObjectValue = {"bar": 2}
      numberSignal(newNumberValue)
      stringSignal(newStringValue)
      arraySignal(newArrayValue)      
      objectSignal(newObjectValue)
      assert.equal numberSignal(), newNumberValue
      assert.equal stringSignal(), newStringValue
      assert.equal arraySignal(), newArrayValue
      assert.equal objectSignal(), newObjectValue


  describe 'Propagation', ->    

    it "should initialize a dependent signal without error", ->
      a = Signal 1
      b = Signal -> a() + 1

    it "should initialize a dependent signal with the correct value", ->
      a = Signal 1
      b = Signal -> a() + 1
      assert.equal b(), 2

    it 'should propagate changes to a dependent signal', ->
      a = Signal 1
      b = Signal -> a() + 1
      a(2)
      assert.equal b(), 3

    it 'should initialize multiple dependent signals without error', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> a() + 2

    it 'should initialize multiple dependent signals with the correct values', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> a() + 2
      assert.equal a(), 1
      assert.equal b(), 2
      assert.equal c(), 3

    it 'should propagate changes to multiple dependent signals', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> a() + 2
      a(2)
      assert.equal a(), 2
      assert.equal b(), 3
      assert.equal c(), 4

    it 'should initialize sequential dependencies without error', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> b() + 1
      d = Signal -> c() + 1

    it 'should initialize sequential dependencies with the correct values', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> b() + 1
      d = Signal -> c() + 1
      assert.equal a(), 1
      assert.equal b(), 2
      assert.equal c(), 3
      assert.equal d(), 4

    it 'should propagate changes to sequential dependencies', ->
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> b() + 1
      d = Signal -> c() + 1
      a(10)
      assert.equal a(), 10
      assert.equal b(), 11
      assert.equal c(), 12
      assert.equal d(), 13

    it 'should initialize convergent dependencies without error', ->    
      a = Signal 1
      b = Signal 2
      c = Signal -> a() + b()

    it 'should initialize convergent dependencies with the correct value', ->    
      a = Signal 1
      b = Signal 2
      c = Signal -> a() + b()
      assert.equal a(), 1
      assert.equal b(), 2
      assert.equal c(), 3

    it 'should propagate changes to convergent dependencies', ->    
      a = Signal 1
      b = Signal 2
      c = Signal -> a() + b()
      a(7)
      assert.equal a(), 7
      assert.equal b(), 2
      assert.equal c(), 9
      b(3)
      assert.equal a(), 7
      assert.equal b(), 3
      assert.equal c(), 10
      
    it "should break unneeded dependencies after manual redefinition", ->
      a = Signal 1
      b = Signal -> a()
      assert.equal a(), 1
      assert.equal b(), 1
      a(2)
      assert.equal a(), 2
      assert.equal b(), 2
      b(3)
      assert.equal a(), 2
      assert.equal b(), 3
      a(7)
      assert.equal a(), 7
      assert.equal b(), 3

    it "should dynamically determine dependencies", ->
      triggerCount = 0
      a = Signal true
      b = Signal "foo"
      c = Signal "bar"
      d = Signal -> 
        triggerCount += 1
        if a() then b() else c()
      assert.equal triggerCount, 1 # initialization evaluation
      b("hi")
      assert.equal triggerCount, 2 # trigger on b's update
      c("hello")
      assert.equal triggerCount, 2 # no triggering on c's update
      a(false)
      assert.equal triggerCount, 3 # trigger on a's update
      c("hello again")
      assert.equal triggerCount, 4 # now trigger on c's update
      b("hi again")
      assert.equal triggerCount, 4 # no triggers on b's update anymore

    it "should only propagate changes to signals which have not seen the value already", ->
      triggerCount = 0
      a = Signal 1
      b = Signal -> a() + 1
      c = Signal -> 
        a() + b()
        triggerCount += 1
      a(2)
      # c should only be evaluatated twice
      # first when it is initialized
      # second when a propagates to b which propagates to c
      # since c reads a after being notified by b
      # a does not need to propagate to c again
      assert.equal triggerCount, 2

  describe "Array and Object convenience methods", ->

    it "TODO rewrite: object setter", ->
      a = Signal {}
      b = Signal -> "Serialized: " + JSON.stringify(a())
      assert.equal b(), "Serialized: {}"
      a()["x"] = 1
      assert.equal JSON.stringify(a()), '{"x":1}'
      assert.equal b(), "Serialized: {}"
      a(a())
      assert.equal JSON.stringify(a()), '{"x":1}'
      assert.equal b(), 'Serialized: {"x":1}'
      a.set("x", 2)
      assert.equal JSON.stringify(a()), '{"x":2}'
      assert.equal b(), 'Serialized: {"x":2}'
      a(3)
      assert.equal a(), 3
      assert.equal b(), 'Serialized: 3'
      assert.equal a.set, undefined

    it "TODO rewrite: basic array push ", ->
      a = Signal []
      a.push "x"
      assert.equal JSON.stringify(a()), '["x"]'

    it "TODO rewrite: array initialized properly", ->
      a = Signal []
      a.push("x")
      assert.equal JSON.stringify(a()), '["x"]'
      a.push("y")
      assert.equal JSON.stringify(a()), '["x","y"]'
      a.pop()
      assert.equal JSON.stringify(a()), '["x"]'
      a.pop()
      assert.equal JSON.stringify(a()), '[]'
      a.unshift("x")
      assert.equal JSON.stringify(a()), '["x"]'
      a.unshift("y")
      assert.equal JSON.stringify(a()), '["y","x"]'
      a.unshift("z")
      assert.equal JSON.stringify(a()), '["z","y","x"]'
      a.sort()
      assert.equal JSON.stringify(a()), '["x","y","z"]'
      a.reverse()
      assert.equal JSON.stringify(a()), '["z","y","x"]'
      a.splice(1,1,"w")
      assert.equal JSON.stringify(a()), '["z","w","x"]'
      a.shift()
      assert.equal JSON.stringify(a()), '["w","x"]'

    it "TODO rewrite: array methods", ->
      a = Signal []
      b = Signal -> "Serialized: " + JSON.stringify(a())
      assert.equal JSON.stringify(a()), '[]'
      assert.equal b(), 'Serialized: []'
      a()[0] = "x"
      assert.equal JSON.stringify(a()), '["x"]'
      assert.equal b(), 'Serialized: []'
      a(a())
      assert.equal JSON.stringify(a()), '["x"]'
      assert.equal b(), 'Serialized: ["x"]'
      a.set(1, "y")
      assert.equal JSON.stringify(a()), '["x","y"]'
      assert.equal b(), 'Serialized: ["x","y"]'
      a.push("z")
      assert.equal JSON.stringify(a()), '["x","y","z"]'
      assert.equal b(), 'Serialized: ["x","y","z"]'
      a.unshift("w")
      assert.equal JSON.stringify(a()), '["w","x","y","z"]'
      assert.equal b(), 'Serialized: ["w","x","y","z"]'
      c = a.shift()
      assert.equal JSON.stringify(a()), '["x","y","z"]'
      assert.equal b(), 'Serialized: ["x","y","z"]'
      assert.equal c, "w"
      a.reverse()
      assert.equal JSON.stringify(a()), '["z","y","x"]'
      assert.equal b(), 'Serialized: ["z","y","x"]'
      d = a.pop()
      assert.equal JSON.stringify(a()), '["z","y"]'
      assert.equal b(), 'Serialized: ["z","y"]'
      a.push("foo")
      a.push("bar")
      assert.equal JSON.stringify(a()), '["z","y","foo","bar"]'
      assert.equal b(), 'Serialized: ["z","y","foo","bar"]'
      d = a.splice(1,2)
      assert.equal JSON.stringify(d), '["y","foo"]'
      assert.equal JSON.stringify(a()), '["z","bar"]'
      assert.equal b(), 'Serialized: ["z","bar"]'
      a("pies")
      assert.equal a(), "pies"
      assert.equal b(), 'Serialized: "pies"'
      assert.equal a.pop, undefined
      assert.equal a.push, undefined
      assert.equal a.shift, undefined
      assert.equal a.unshift, undefined
      assert.equal a.sort, undefined
      assert.equal a.reverse, undefined
      assert.equal a.splice, undefined

describe "Observer", ->

  it "should initialize a blank observer without error", ->
    anObserver = Observer ->

  it "should initialize an observer which reads a signal without error", ->
    aSignal = Signal 1
    anObserver = Observer -> aSignal()

  it "should trigger an observer on evaluation", ->
    aSignal = Signal 1
    anExternalValue = null
    assert.equal anExternalValue, null
    anObserver = Observer -> anExternalValue = aSignal()
    assert.equal anExternalValue, 1

  it "should trigger the observer when a signal is updated", ->
    aSignal = Signal 1
    anExternalValue = null
    anObserver = Observer -> anExternalValue = aSignal()
    aSignal(2)
    assert.equal anExternalValue, 2

  it "should trigger even when observing multiple signals", ->
    aSignal = Signal 1
    bSignal = Signal 2
    cSignal = Signal 3
    dSignal = Signal 4
    anExternalValue = 0
    anObserver = Observer ->
      anExternalValue = "" + aSignal() + bSignal() + cSignal() + dSignal()
    assert.equal anExternalValue, "1234"
    aSignal(5)
    assert.equal anExternalValue, "5234"
    aSignal(6)
    # assert.equal anExternalValue, "5634"
    # aSignal(7)
    # assert.equal anExternalValue, "5674"
    # aSignal(8)
    # assert.equal anExternalValue, "5678"

  it "read write observer", ->
    a = Signal 1
    b = Signal 2
    assert.equal a(), 1
    assert.equal b(), 2
    c = Observer -> b(a())
    assert.equal b(), 1
    a(3)
    assert.equal a(), 3
    assert.equal b(), 3
    b(4)
    assert.equal a(), 3
    assert.equal b(), 4

  it "another read write observer", ->
    a = 0
    b = Signal 1
    c = Signal 2
    assert.equal a, 0
    assert.equal b(), 1
    assert.equal c(), 2
    d = Observer ->
      a += 1
      b()
      c(3)
    assert.equal a, 1
    assert.equal b(), 1
    assert.equal c(), 3
    a = 4
    assert.equal a, 4
    assert.equal b(), 1
    assert.equal c(), 3
    b(6)
    assert.equal a, 5
    assert.equal b(), 6
    assert.equal c(), 3
    c(7)
    assert.equal a, 5
    assert.equal b(), 6
    assert.equal c(), 7

