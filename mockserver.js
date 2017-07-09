var express = require('express');
var app = express();

var path = require('path');
var url = require('url');

var port = 3001;

var appInfo = {
  title: "PROGRAM",
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

var properties = [
  { parcelNumber: 1010100100,
    primaryOwner: 'Mickey Mouse',
    description: 'Lovely Spot for Minnie and me - SEC 5',
    situsAddress: '1234 Fun Valley Lane, Toontown, CA 92000-0000',
    mailingAddress: '56 Silly Street, Ste. 789',
    document: 'A12345B678'
  },
  { parcelNumber: 2020200200,
    primaryOwner: 'Daffy Duck',
    description: 'LAND SECTION A123',
    situsAddress: '555 0 Avenue, Universal, CA 92555-5555',
    mailingAddress: '100 Sudden Valley, OrangeCone, CA 92555-5556',
    document: 'B87AX17422'
  },
  { parcelNumber: 2020200201,
    primaryOwner: 'Clark Kent',
    description: 'Planetary Intersection, Hollywood West Bluff',
    situsAddress: '777 Main Street, Apt A 123, Krypton, CA 92777-0007',
    mailingAddress: '888 Side Street, Box 4, Krypton, CA 92777-0008',
    document: 'G56312A441'
  },
  { parcelNumber: 3010100100,
    primaryOwner: 'Speedy Gonzalez',
    description: 'The fast lane',
    situsAddress: '#5 Leftmost Lane, Anyroad, USA',
    mailingAddress: '4002 Myhome Road, Watchamacallit Somewhere, District 7, 12345-0000',
    document: 'A3444D1111'
  },
  { parcelNumber: 3210100300,
    primaryOwner: 'Another Owner',
    description: 'This is the description of the property which may be several lines long',
    situsAddress: '120, Route 7 Drive, is the situs address',
    mailingAddress: '101 corner of Happy Ave and Healthy Street is the mailing address',
    document: 'A1DOCUMENT'
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
  console.log('Mock API server available at localhost:'+port.toString()+appInfo.path);
});
