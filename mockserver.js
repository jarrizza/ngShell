var express = require('express');
var app = express();

var path = require('path');
var url = require('url');

var port = 3001;

var appInfo = {
  title: "SAMPLE",
  source: "mock",
  host: "localhost:"+port.toString(),
  apiVersion: "1.0.0",
  path: "/api/"
};

var lists = require('./mockbackend/lists');
var tableInfo = require('./mockbackend/tableinfo');
var mockerBot = require('./mockbackend/mockerbot');

var records = [
  { recordNumber: 1000,
    name: 'Mickey Mouse',
    description: 'A friendly chap with an odd voice',
    address: '#1, Corner of Happy and Nutty, Toontown, CA 92000-0000',
    role: 'dev'
  },
  { recordNumber: 2000,
    name: 'Daffy Duck',
    description: 'Lovable Water dweller',
    address: '555 0 Avenue, Universal, CA 92555-5555',
    role: 'user'
  },
  { recordNumber: 3000,
    name: 'Clark Kent',
    description: 'Interplanetary traveller',
    address: '777 Main Street, Apt A 123, Krypton, CA 92777-0007',
    role: 'admin'
  }
  ];

// Create the mock organization
mockerBot.MockObject.create();

///////////////////////////////////////////////// APPLICATION/API INFO
app.get('/api/info', function(req, res) {
  res.end(JSON.stringify(appInfo));
});

app.post(appInfo.path+'getGridRecords', function(req, res) {

  console.log('Request for grid records HEADERS =>');
  console.log(req.headers);
  console.log('PARAMS =>');
  console.log(req.params);
  console.log('QUERY =>');
  console.log(req.query);

  res.end(JSON.stringify(records));
});


app.post(appInfo.path+'getPropertyRecords', function(req, res) {

  console.log('Request for property records HEADERS =>');
  console.log(req.headers);
  console.log('PARAMS =>');
  console.log(req.params);
  console.log('QUERY =>');
  console.log(req.query);

  res.end(JSON.stringify(properties));
});


///////////////////////////////////////////////// TABLE STRUCTURES
app.get(appInfo.path+'tabletypes', function(req, res){
  var obj = {
    name: "TableTypes",
    value: tableInfo.TableInfo.getTableTypes()
  };
  res.end(JSON.stringify(obj));
});

app.get(appInfo.path+'tablestructure', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var id = req.query.id;
  var obj = {
    name: "TableStructure",
    id: id,
    value: tableInfo.TableInfo.getDefsByType(id)
  };
  res.end(JSON.stringify(obj));
});

///////////////////////////////////////////////// ORG CONSTANT LISTS
app.get(appInfo.path+'listnames', function(req, res){
  var obj = {
    name: "ListNames",
    value: lists.Lists.getListNames()
  };
  res.end(JSON.stringify(obj));
});

app.get(appInfo.path+'listoptions', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var id = req.query.id;
  var obj = {
    name: "ListOptions",
    id: id,
    value: lists.Lists.getListByName(id)
  };
  res.end(JSON.stringify(obj));
});

/////////////////////////////////////////////// GENERATED ORG (MOCKERBOT) ENDPOINTS
app.get(appInfo.path+'allusers', function(req, res){
  res.json(mockerBot.MockObject.users);
});

app.get(appInfo.path+'logininfo', function(req, res){
  var obj = { temp: 'dummy' };
  res.end(JSON.stringify(obj));
});

/////////////////////////////////////////////// LISTENER
app.listen(port, function() {
  console.log('ngShell Mock API server available at localhost:'+port.toString()+appInfo.path);
});
