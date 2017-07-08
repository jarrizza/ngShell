"use strict";

var tableDefs = [
    {
      table: 'Users',
      record: 'UserRecord',
      colDefs: [
        { headerName: 'Name',       field: 'name',           headerTooltip: 'This is the header tooltip', type: 'string',  prec: 20, width: 200,  pinned: 'left', align: 'left',  reg: 1 },
        { headerName: 'Projects',   field: 'numProjects',    headerTooltip: 'This is the header tooltip', type: 'number',  prec: 0, width: 110,  pinned: 'left', align: 'center', reg: 1 },
        { headerName: 'Funded',     field: 'funded',         headerTooltip: 'The sum of the buckets',     type: 'number',  prec: 0, width: 120,  pinned: false,  align: 'right',  reg: 1 }
      ]
    }
  ];


var TableInfo = {
  "getDefsByType": function(recordType) {
      for (var i = 0; i < tableDefs.length; i++) {
        if (tableDefs[i].record === recordType ) {
          return tableDefs[i].colDefs;
        }
      }
      return [];
    },
  "getTableTypes": function() {
      var all = new Array();
      for (var i = 0; i < tableDefs.length; i++) {
        all.push({
          table: tableDefs[i].table,
          record: tableDefs[i].record
        });
      }
      return all;
    }
};

exports.TableInfo = TableInfo;
