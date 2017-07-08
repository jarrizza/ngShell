"use strict";

var orgTree = null;

// Model records required
var userRec = require('../mockbackend/models/user-record.model');

// Load testing maximums
var mockLimits = {
  MAX_USERS: 10000
};

// Utilities for generating random records

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOption(ops) {
  var max = ops.length - 1;
  var idx = getRandomNum(0, max);
  return ops[idx];
}

function isTodayInRange(startDateStr, endDateStr) {
  var startDate = new Date(startDateStr)
    , endDate  = new Date(endDateStr)
    , today  = new Date();
  return ( today >= startDate && today <= endDate );
}

function getTodayAsDateString() {
  var now = new Date();
  return now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}

function getNextYearAsString() {
  var thisYearValue = new Date().getFullYear();
  return (thisYearValue + 1).toString();
}

function getRandomTime() {
  var randomTime = getRandomNum(1, 12);
  return (randomTime < 7 || randomTime === 12) ? (randomTime.toString() + ':00 PM') : (randomTime.toString() + ':00 AM');
}

// Function to build the data structures based on the mockOrg records defined

function createMockRecords(obj) {
  obj.name = 'DATA';
  obj.appInfo = {
    title: "PROGRAM (USING NODE SERVER)",
    apiVersion: "1.0.0",
    path: "/cihb/ws/api/"
  };
}

function removeRecords( obj ) {
  org.name = '';
}

var MockObject = {
  "create": function() {
    createMockRecords(this);
  },
  "cleanup": function() {
    removeRecords(this);
  }
};

exports.MockObject = MockObject;
