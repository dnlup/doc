'use strict';
var validate = (function() {
  var refVal = [];
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict';
    var vErrors = null;
    var errors = 0;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      if (data.eventLoopOptions === undefined) data.eventLoopOptions = {
        "resolution": 10
      };
      if (data.collect === undefined) data.collect = {
        "cpu": true,
        "memory": true,
        "eventLoopDelay": true,
        "gc": false,
        "activeHandles": false
      };
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == 'sampleInterval' || key0 == 'eventLoopOptions' || key0 == 'collect');
        if (isAdditional0) {
          delete data[key0];
        }
      }
      if (valid1) {
        var data1 = data.sampleInterval;
        if (data1 === undefined) {
          valid1 = true;
        } else {
          var errs_1 = errors;
          if (typeof data1 !== "number") {
            var dataType1 = typeof data1;
            var coerced1 = undefined;
            if (dataType1 == 'boolean' || data1 === null || (dataType1 == 'string' && data1 && data1 == +data1)) coerced1 = +data1;
            if (coerced1 === undefined) {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.sampleInterval',
                schemaPath: '#/properties/sampleInterval/type',
                params: {
                  type: 'number'
                },
                message: 'should be number'
              }];
              return false;
            } else {
              data1 = coerced1;
              data['sampleInterval'] = coerced1;
            }
          }
          if (typeof data1 === "number") {
            if (data1 < 1 || data1 !== data1) {
              validate.errors = [{
                keyword: 'minimum',
                dataPath: (dataPath || '') + '.sampleInterval',
                schemaPath: '#/properties/sampleInterval/minimum',
                params: {
                  comparison: '>=',
                  limit: 1,
                  exclusive: false
                },
                message: 'should be >= 1'
              }];
              return false;
            }
          }
          var valid1 = errors === errs_1;
        }
        if (valid1) {
          var data1 = data.eventLoopOptions;
          var errs_1 = errors;
          if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
            if (data1.resolution === undefined) data1.resolution = 10;
            var errs__1 = errors;
            var valid2 = true;
            for (var key1 in data1) {
              var isAdditional1 = !(false || key1 == 'resolution');
              if (isAdditional1) {
                delete data1[key1];
              }
            }
            if (valid2) {
              var data2 = data1.resolution;
              var errs_2 = errors;
              if (typeof data2 !== "number") {
                var dataType2 = typeof data2;
                var coerced2 = undefined;
                if (dataType2 == 'boolean' || data2 === null || (dataType2 == 'string' && data2 && data2 == +data2)) coerced2 = +data2;
                if (coerced2 === undefined) {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.eventLoopOptions.resolution',
                    schemaPath: '#/properties/eventLoopOptions/properties/resolution/type',
                    params: {
                      type: 'number'
                    },
                    message: 'should be number'
                  }];
                  return false;
                } else {
                  data2 = coerced2;
                  data1['resolution'] = coerced2;
                }
              }
              if (typeof data2 === "number") {
                if (data2 < 1 || data2 !== data2) {
                  validate.errors = [{
                    keyword: 'minimum',
                    dataPath: (dataPath || '') + '.eventLoopOptions.resolution',
                    schemaPath: '#/properties/eventLoopOptions/properties/resolution/minimum',
                    params: {
                      comparison: '>=',
                      limit: 1,
                      exclusive: false
                    },
                    message: 'should be >= 1'
                  }];
                  return false;
                }
              }
              var valid2 = errors === errs_2;
            }
          } else {
            validate.errors = [{
              keyword: 'type',
              dataPath: (dataPath || '') + '.eventLoopOptions',
              schemaPath: '#/properties/eventLoopOptions/type',
              params: {
                type: 'object'
              },
              message: 'should be object'
            }];
            return false;
          }
          var valid1 = errors === errs_1;
          if (valid1) {
            var data1 = data.collect;
            var errs_1 = errors;
            if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
              if (data1.cpu === undefined) data1.cpu = true;
              if (data1.memory === undefined) data1.memory = true;
              if (data1.eventLoopDelay === undefined) data1.eventLoopDelay = true;
              if (data1.gc === undefined) data1.gc = false;
              if (data1.activeHandles === undefined) data1.activeHandles = false;
              var errs__1 = errors;
              var valid2 = true;
              for (var key1 in data1) {
                var isAdditional1 = !(false || key1 == 'cpu' || key1 == 'memory' || key1 == 'eventLoopDelay' || key1 == 'gc' || key1 == 'activeHandles');
                if (isAdditional1) {
                  delete data1[key1];
                }
              }
              if (valid2) {
                var data2 = data1.cpu;
                var errs_2 = errors;
                if (typeof data2 !== "boolean") {
                  var dataType2 = typeof data2;
                  var coerced2 = undefined;
                  if (data2 === 'false' || data2 === 0 || data2 === null) coerced2 = false;
                  else if (data2 === 'true' || data2 === 1) coerced2 = true;
                  if (coerced2 === undefined) {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.collect.cpu',
                      schemaPath: '#/properties/collect/properties/cpu/type',
                      params: {
                        type: 'boolean'
                      },
                      message: 'should be boolean'
                    }];
                    return false;
                  } else {
                    data2 = coerced2;
                    data1['cpu'] = coerced2;
                  }
                }
                var valid2 = errors === errs_2;
                if (valid2) {
                  var data2 = data1.memory;
                  var errs_2 = errors;
                  if (typeof data2 !== "boolean") {
                    var dataType2 = typeof data2;
                    var coerced2 = undefined;
                    if (data2 === 'false' || data2 === 0 || data2 === null) coerced2 = false;
                    else if (data2 === 'true' || data2 === 1) coerced2 = true;
                    if (coerced2 === undefined) {
                      validate.errors = [{
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.collect.memory',
                        schemaPath: '#/properties/collect/properties/memory/type',
                        params: {
                          type: 'boolean'
                        },
                        message: 'should be boolean'
                      }];
                      return false;
                    } else {
                      data2 = coerced2;
                      data1['memory'] = coerced2;
                    }
                  }
                  var valid2 = errors === errs_2;
                  if (valid2) {
                    var data2 = data1.eventLoopDelay;
                    var errs_2 = errors;
                    if (typeof data2 !== "boolean") {
                      var dataType2 = typeof data2;
                      var coerced2 = undefined;
                      if (data2 === 'false' || data2 === 0 || data2 === null) coerced2 = false;
                      else if (data2 === 'true' || data2 === 1) coerced2 = true;
                      if (coerced2 === undefined) {
                        validate.errors = [{
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.collect.eventLoopDelay',
                          schemaPath: '#/properties/collect/properties/eventLoopDelay/type',
                          params: {
                            type: 'boolean'
                          },
                          message: 'should be boolean'
                        }];
                        return false;
                      } else {
                        data2 = coerced2;
                        data1['eventLoopDelay'] = coerced2;
                      }
                    }
                    var valid2 = errors === errs_2;
                    if (valid2) {
                      var data2 = data1.gc;
                      var errs_2 = errors;
                      if (typeof data2 !== "boolean") {
                        var dataType2 = typeof data2;
                        var coerced2 = undefined;
                        if (data2 === 'false' || data2 === 0 || data2 === null) coerced2 = false;
                        else if (data2 === 'true' || data2 === 1) coerced2 = true;
                        if (coerced2 === undefined) {
                          validate.errors = [{
                            keyword: 'type',
                            dataPath: (dataPath || '') + '.collect.gc',
                            schemaPath: '#/properties/collect/properties/gc/type',
                            params: {
                              type: 'boolean'
                            },
                            message: 'should be boolean'
                          }];
                          return false;
                        } else {
                          data2 = coerced2;
                          data1['gc'] = coerced2;
                        }
                      }
                      var valid2 = errors === errs_2;
                      if (valid2) {
                        var data2 = data1.activeHandles;
                        var errs_2 = errors;
                        if (typeof data2 !== "boolean") {
                          var dataType2 = typeof data2;
                          var coerced2 = undefined;
                          if (data2 === 'false' || data2 === 0 || data2 === null) coerced2 = false;
                          else if (data2 === 'true' || data2 === 1) coerced2 = true;
                          if (coerced2 === undefined) {
                            validate.errors = [{
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.collect.activeHandles',
                              schemaPath: '#/properties/collect/properties/activeHandles/type',
                              params: {
                                type: 'boolean'
                              },
                              message: 'should be boolean'
                            }];
                            return false;
                          } else {
                            data2 = coerced2;
                            data1['activeHandles'] = coerced2;
                          }
                        }
                        var valid2 = errors === errs_2;
                      }
                    }
                  }
                }
              }
            } else {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.collect',
                schemaPath: '#/properties/collect/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              }];
              return false;
            }
            var valid1 = errors === errs_1;
          }
        }
      }
    } else {
      validate.errors = [{
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      }];
      return false;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "sampleInterval": {
      "type": "number",
      "minimum": 1
    },
    "eventLoopOptions": {
      "type": "object",
      "default": {
        "resolution": 10
      },
      "additionalProperties": false,
      "properties": {
        "resolution": {
          "type": "number",
          "default": 10,
          "minimum": 1
        }
      }
    },
    "collect": {
      "type": "object",
      "additionalProperties": false,
      "default": {
        "cpu": true,
        "memory": true,
        "eventLoopDelay": true,
        "gc": false,
        "activeHandles": false
      },
      "properties": {
        "cpu": {
          "type": "boolean",
          "default": true
        },
        "memory": {
          "type": "boolean",
          "default": true
        },
        "eventLoopDelay": {
          "type": "boolean",
          "default": true
        },
        "gc": {
          "type": "boolean",
          "default": false
        },
        "activeHandles": {
          "type": "boolean",
          "default": false
        }
      }
    }
  }
};
validate.errors = null;
module.exports = validate;