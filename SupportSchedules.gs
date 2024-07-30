function fetchSupportData_() {
  return Utils.getRemoteValues(SUPPORT_VACATION_ID, SUPPORT_VACATION_SHEET_NAME, SUPPORT_VACATION_RANGE);
}

function makeSupportVacationMap_() {
  let raws = fetchSupportData_();
  let map = new Map();
  raws.forEach(
    raw => {
      map.set(raw[0], raw);
    }
  );
  return map;
}

function isOff_(name, dayOfYear, supportMap) {
  // let supportMap = makeSupportVacationMap_(fetchSupportData_());
  let isOff = false;
  if (supportMap.has(name)) {
    let vacation = supportMap.get(name);
    Logger.log(vacation[dayOfYear] + " " + Utils.isNull(vacation[dayOfYear]));
    isOff = !Utils.isNull(vacation[dayOfYear]) && vacation[dayOfYear] != 'HW';
  }
  return isOff;
}

function testSupport() {
  /** let d = Utilities.formatDate(new Date(), 'EST', 'D');
  Logger.log(d);
  Logger.log(isOff_('Jun Lu', d)); */
  // let col = getFirstNotHiddenColumn_();
  // Logger.log(col);
  // getSMETodaySchedule_('Weekend Wed-Sat (10-20)');
  getSMESchedulesMap_();
  // Logger.log(new Date().getMonth());
}

// https://developers.google.com/apps-script/reference/spreadsheet/sheet#iscolumnhiddenbyusercolumnposition
function getFirstNotHiddenColumn_() {
  var sheet = SpreadsheetApp.openById(SUPPORT_SCHEDULES_ID).getSheetByName(SUPPORT_SCHEDULES_SHEET_NAME);
  for(let i = SUPPORT_SCHEDULES_FIRST_SCHEDULE_COL_POSTION; i <= sheet.getLastColumn(); i++) {
    if (!sheet.isColumnHiddenByUser(i)) {
      return i;
    }
  }
  return -1;
}

function getSMESchedulesMap_() {
  let smeSchedulesMap = new Map();
  let lastCol = getFirstNotHiddenColumn_();
  let lastRow = Utils.getLastRowRemote(SUPPORT_SCHEDULES_ID, SUPPORT_SCHEDULES_SHEET_NAME);
  // the col start at 3, not 1, so last col should -2
  let raws = SpreadsheetApp.openById(SUPPORT_SCHEDULES_ID).getSheetByName(SUPPORT_SCHEDULES_SHEET_NAME).getRange(2, 3, lastRow, lastCol - 2).getValues().filter(
    raw => {
      return isAName_(raw[0]);
    }
  );
  raws.forEach(
    raw => {
      // let name = raw[0].split('(')[0].trim();
      smeSchedulesMap.set(raw[0].split('(')[0].trim(), getSMETodaySchedule_(raw[raw.length - 1]));
      // Logger.log(raw[0].split('(')[0].trim() + ' === schedule map =======' + getSMETodaySchedule_(raw[raw.length - 1]));
    }
  );
  // Logger.log(raws);
  return smeSchedulesMap;
}

function isAName_(value) {
  return !Utils.isNull(value) && !Utils.compareStrIgnoreCases(value, 'Big Data') && !Utils.compareStrIgnoreCases(value, 'Infra') && !Utils.compareStrIgnoreCases(value, 'Networking') && !Utils.compareStrIgnoreCases(value, 'Platform')
}

function getSMETodaySchedule_(schedule) {
  let today = new Date();
  // Sunday = 0, Monday = 1
  if (schedule.toLowerCase().includes('sat') && (today.getDay() == 0 || today.getDay() == 1 || today.getDay() == 2)) {
    schedule = getOFFShift_();
  } else if (schedule.toLowerCase().includes('sun') && (today.getDay() == 4 || today.getDay() == 5 || today.getDay() == 6)) {
    schedule = getOFFShift_();
  } else if (today.getDay() == 0 || today.getDay() == 6) {
    schedule = getOFFShift_();
  }
  return schedule;
}
