"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserRecord = (function () {
  UserRecord.prototype.inner = {};

  UserRecord.prototype.setRecord = function (rec) {
    if (!rec) rec = {};
    UserRecord.prototype.inner.loginEmployeeName = rec.loginName || 'LASTNAME, FIRSTNAME';
    UserRecord.prototype.inner.loginEmployeeNumber = rec.loginID || '123456';
    UserRecord.prototype.inner.responsibilityId = rec.loginRole || 0;
  };

  UserRecord.prototype.getRecord = function () {
    return (UserRecord.prototype.inner);
  };

  function UserRecord(rec) {
    UserRecord.prototype.inner = new Object();
    UserRecord.prototype.setRecord(rec);
  }
  return UserRecord;
}());
exports.UserRecord = UserRecord;
