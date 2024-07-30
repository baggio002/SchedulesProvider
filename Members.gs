function fetchAllMembers_() {
  return Utils.getRemoteValueWithNonLastRowRange(SCHEDULES_SOURCE_SHEET_ID, SCHEDULES_GLANCE_SHEET, SCHEDULES_GLANCE_RANGE);
}

function exportAllMembers_() {
  Utils.clear(MEMBERS_SHEET, Utils.makeRangeWithoutLastRow(MEMBERS_SHEET, MEMBERS_RANGE_ENTIRE_START));
  let allMembers = fetchAllMembers_();
  let infos = readMembersInfo_();
  addLdap_(allMembers, infos);
  addExtraCols_(allMembers);
  setSMESchedules_(allMembers);
  mergeSupportVacation_(allMembers);
  correctTid_(allMembers, makeInfoMap_(infos))
  allMembers = allMembers.filter(
    function(element) {
      return element.length == 7 && Utils.isNull(element[7]);
    }
  );
  Utils.exportRawDataToSheet(MEMBERS_SHEET, MEMBERS_RANGE_ENTIRE_START + (allMembers.length + 1), allMembers);
  return allMembers;
}

function setSMESchedules_(allMembers) {
  let smeMap = getSMESchedulesMap_();
  let i = 0;
  allMembers.forEach(
    member => {
      if(smeMap.has(member[1].trim())) {
        member[3] = smeMap.get(member[1].trim());
      }
    }
  );
}

function mergeSupportVacation_(members) {
  let supportMap = makeSupportVacationMap_();
  members.forEach(
    member => {
      if (supportMap.has(member[1]) && isOff_(member[1], Utilities.formatDate(new Date(), 'EST', 'D'), supportMap)) {
        member[3] = getOFFShift_();
      }
    }
  );
}

function getOFFShift_() {
  return SHIFT_OFF;
}

function addExtraCols_(allMembers) {
  allMembers.forEach(
    member => {
      addIsSME_(member);
      addSite_(member);
    }
  )
}

function addSite_(member) {
  member.push(SITE);
}

function addLdap_(allMembers, infos) {
  let correctMap = makeCorrectionMap_();
  let infoNameKeyMap = makeInfoMapWithNameKey_(infos);
  allMembers.forEach(
    member => {
      addLdapCol_(member, infoNameKeyMap, correctMap);
    }
  )
}

function makeInfoMap_(infos) {
  let infoMap = new Map();
  infos.forEach(
    info => {
      infoMap.set(info[3], info);
    }
  );
  return infoMap;
}

function makeInfoMapWithNameKey_(infos) {
  let infoMap = new Map();
  infos.forEach(
    info => {
      infoMap.set(info[0], info);
    }
  );
  return infoMap;
}

function correctTid_(members, infosMap) {
  members.forEach(
    member => {
      if (infosMap.has(member[4])) {
        member[2] = infosMap.get(member[4])[2];
      }
    }
  );
}

function addIsSME_(member) {
  // Logger.log(member + " " + member[0].endsWith(' - Support'));
  if (member[0].endsWith(' - Support')) {
    member.push(true);
  } else {
    member.push(false);
  }
}

function makeCorrectionMap_() {
  let raws = Utils.getValuesWithNonLastRow(CORRECTION_SHEET, RANGE_CORRENTION);
  let map = new Map();
  raws.forEach(
    raw => {
      Logger.log('make map = ' + raw);
      map.set(raw[0], {name: raw[1], ldap: raw[2], shard: raw[3]});
    }
  );
  return map;
}

function addLdapCol_(member, infoNameKeyMap, correctMap) {
  // let correctMap = makeCorrectionMap_();
  // Logger.log(member + " " + correctMap.has(member[1]));
  if (correctMap.has(member[1])) {
    member.push(correctMap.get(member[1]).ldap);
    Logger.log("==correct==" + member[1] + " " + correctMap.get(member[1]).shard);
    if (!Utils.isNull(correctMap.get(member[1]).shard)) {
      member[0] = correctMap.get(member[1]).shard;
    }
    member[1] = correctMap.get(member[1]).name;
  } else if (infoNameKeyMap.has(member[1])) {
    member.push(infoNameKeyMap.get(member[1])[3]);
  } 
}

function readMembersInfo_() {
  return Utils.getRemoteValueWithNonLastRowRange(MEMBERS_V2_SHEET_ID, SCHEDULES_MEMBER_SHEET, SCHEDULES_MEMBER_RANGE).filter(
    function (element) {
      return element[8] != 'Inactive'
    }
  );
}

function groupMembers_(members) {
  dataGuys = [];
  platformGuys = [];
  infraGuys = [];
  networkingGuys = [];
  members.forEach(
    member => {
      if (member[0].startsWith(DATA_SHEET)) {
        dataGuys.push(member);
      } else if (member[0].startsWith(PLATFORM_SHEET)) {
        platformGuys.push(member);
      } else if (member[0].startsWith(INFRA_SHEET)) {
        infraGuys.push(member);
      } else if (member[0].startsWith(NETWORKING_SHEET)) {
        networkingGuys.push(member);
      } else {
        // null ;
      }
    }
  );
  return dataGuys, platformGuys, infraGuys, networkingGuys;
}

function exportToGroup_(members) {
  Utils.clear(DATA_SHEET, Utils.makeRangeWithoutLastRow(DATA_SHEET, MEMBERS_RANGE_ENTIRE_START));
  Utils.clear(PLATFORM_SHEET, Utils.makeRangeWithoutLastRow(PLATFORM_SHEET, MEMBERS_RANGE_ENTIRE_START));
  Utils.clear(INFRA_SHEET, Utils.makeRangeWithoutLastRow(INFRA_SHEET, MEMBERS_RANGE_ENTIRE_START));
  Utils.clear(NETWORKING_SHEET, Utils.makeRangeWithoutLastRow(NETWORKING_SHEET, MEMBERS_RANGE_ENTIRE_START));
  dataGuys = [];
  platformGuys = [];
  infraGuys = [];
  networkingGuys = [];
  Utils.exportRawDataToSheet(CODUCK_SHEET, MEMBERS_RANGE_ENTIRE_START + (members.length + 1), members);
  
  dataGuys, platformGuys, infraGuys, networkingGuys = groupMembers_(members);
  Utils.exportRawDataToSheet(DATA_SHEET, MEMBERS_RANGE_ENTIRE_START + (dataGuys.length + 1), dataGuys);
  Utils.exportRawDataToSheet(PLATFORM_SHEET, MEMBERS_RANGE_ENTIRE_START + (platformGuys.length + 1), platformGuys);
  Utils.exportRawDataToSheet(INFRA_SHEET, MEMBERS_RANGE_ENTIRE_START + (infraGuys.length + 1), infraGuys);
  Utils.exportRawDataToSheet(NETWORKING_SHEET, MEMBERS_RANGE_ENTIRE_START + (networkingGuys.length + 1), networkingGuys);
}



/**
 * main function to export data to each shard
 */
function exportData() {
  exportToGroup_(exportAllMembers_());
}

function testMembers() {
  let allMembers = fetchAllMembers_();
  let infos = readMembersInfo_();
  addLdap_(allMembers, infos);
  addExtraCols_(allMembers);
  setSMESchedules_(allMembers);
}

