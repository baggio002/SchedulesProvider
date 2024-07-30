const SCHEDULES_PROVIDER_SHEETS_ID = '1SCLDsakAGT_4KaIOUQ-p9BE23iPTC1Did55x7I738yI';

/**
 * get TSRs raw data by shard
 * return [][]
 */
function getTSRsRaw(site, shard) {
  return Utils.getRemoteValues(SCHEDULES_PROVIDER_SHEETS_ID, shard, MEMBERS_RANGE_ENTIRE_START);
}

function testSMEs() {
  let smes = getSMEs('tel-mon', 'Data');
  Logger.log(smes.length);
}

/**
 * get TSRs json objects by shard
 * return [
 *  {
 *    shard: string,
      name: string,
      tid: string,
      shift: string,
      ldap: string,
      is_sme: boolean,
      site: string
 *  }...
 * ]
 */
function getTSRs(site, shard) {
  let tsrs = [];
  let raws = getTSRsRaw(site, shard);
  raws.filter(
    function (element) {
      return !Utils.isNull(element[1])
    }
  ).forEach(
    raw => {
      if (!raw[5]) {
        tsrs.push(convertRawToJson_(raw));
      }
    }
  );
  return tsrs;
}

/**
 * get SMEs raw data by shard
 * return [][]
 */
function getSMEsRaw(site, shard) {
  return Utils.getRemoteValueWithNonLastRowRange(SCHEDULES_PROVIDER_SHEETS_ID, shard, MEMBERS_RANGE_ENTIRE_START);
}

/**
 * get SMEs json objects
 * return [
 *  {
 *    shard: string,
      name: string,
      tid: string,
      shift: string,
      ldap: string,
      is_sme: boolean,
      site: string
 *  }...
 * ]
 */
function getSMEs(site, shard) {
  smes = [];
  raws = getSMEsRaw(site, shard);
  raws.forEach(
    raw => {
      if (raw[5]) {
        smes.push(convertRawToJson_(raw));
      }
    }
  );
  return smes;
}

/**
 * get all members json objects
 * return [
 *  {
 *    shard: string,
      name: string,
      tid: string,
      shift: string,
      ldap: string,
      is_sme: boolean,
      site: string
 *  }...
 * ]
 */
function getAllMembers(site) {
  let members = [];
  let raws = Utils.getRemoteValueWithNonLastRowRange(SCHEDULES_PROVIDER_SHEETS_ID, MEMBERS_SHEET, MEMBERS_RANGE_ENTIRE_START);
  raws.forEach(
    raw => {
      members.push(convertRawToJson_(raw));
    }
  );
  return members;
}

function getShardName() {
  
}

