"use strict";
var listdata = [
  {
    name: 'options',
    value: [
      {'name': 'Option 1', 'id': '1'},
      {'name': 'Option 2', 'id': '2'},
      {'name': 'Option 3', 'id': '3'}
      ]
  },{
    name: 'yesNo',
    value: [
      {'yesNoCode': 'N', 'description': 'No'},
      {'yesNoCode': 'Y', 'description': 'Yes'}
    ]
  }
];


var Lists = {
  "getListByName": function(name) {
    for (var i = 0; i < listdata.length; i++) {
      if (listdata[i].name === name ) {
        return listdata[i].value;
      }
    }
    return [];
  },
  "getListNames": function() {
    var names = new Array();
    for (var i = 0; i < listdata.length; i++) {
      names.push(listdata[i].name);
    }
    return names;
  }
};

exports.Lists = Lists;
