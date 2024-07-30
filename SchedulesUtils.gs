function convertRawToJson_(raw) {
  member = {};
  member.shard = raw[0].trim();
  member.name = raw[1].trim();
  member.tid = raw[2].trim();
  member.shift = raw[3].trim();
  member.ldap = raw[4].trim();
  member.is_sme = raw[5];
  member.site = raw[6].trim();
  return member;
}

