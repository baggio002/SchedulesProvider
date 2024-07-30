const MEMBERS_SHEET = 'Members';
const MEMBERS_RANGE_START = 'A2';
const MEMBERS_RANGE_WITHOUT_LDAP_START = 'A2:D';
const MEMBERS_RANGE_WITH_LDAP_START = 'A2:E'
const MEMBERS_RANGE_ENTIRE_START = 'A2:G'

const DATA_SHEET = 'Data';
const PLATFORM_SHEET = 'Platform';
const INFRA_SHEET = 'Infra';
const NETWORKING_SHEET = 'Networking';
const CONFIGURATION_SHEET = 'Configuration';
const CORRECTION_SHEET= 'Correction';

const CONFIGURATION_RANGE_START = 'A1:B';

const CONFIG_SOURCE_SHEET_NAME = 'SourceSheetId';

const MEMBERS_V2_SHEET_ID = '1TjLf27KBehYWHAbzBU_gn3ay4AdDaEQH6PWUCUvp5mU';
const SCHEDULES_SOURCE_SHEET_ID = '1U-IHBpm1VBfDZX-69WUtHRBerqJIzdypXOZ1y8cDAFI';
const SCHEDULES_MEMBER_SHEET = 'Team Members';
const SCHEDULES_GLANCE_SHEET = '@ a Glance';

const SCHEDULES_GLANCE_RANGE = 'A3:D';
const SCHEDULES_MEMBER_RANGE = 'A2:K';

const RANGE_CORRENTION = 'A2:D';

const CORRECT_LDAP_MAP = new Map();

CORRECT_LDAP_MAP.set('Abdelrahman Megahed', {name: 'Abdel Megahed', ldap: 'abdelrahmanm'});
CORRECT_LDAP_MAP.set('Maxime Marenger', {name: 'Maxime Marenger', ldap: 'marenger'});
CORRECT_LDAP_MAP.set('Raynel Santana', {name: 'Raynel Santana', ldap: 'raynel'});

const SITE = 'tel-mon';

// go/supportvacation24
const SUPPORT_VACATION_ID = '1BmQaboLpaitgLH_4i2ZgE_Ewp74v_RYDh9Z8T9qQD8k';
const SUPPORT_VACATION_SHEET_NAME = '2024';
const SUPPORT_VACATION_RANGE = 'B4:ND36';

const SHIFT_OFF = 'OFF';

const CODUCK_SHEET = 'Coduck';

// go/TELSupportRotation
const SUPPORT_SCHEDULES_ID = '19_fh7LmAtCf3_CdrJxzeofyEcsBJ8djyTvHmDd9ddlg';
const SUPPORT_SCHEDULES_SHEET_NAME = 'Regular Support Staff Schedule';
const SUPPORT_SCHEDULES_RANGE = '';
const SUPPORT_SCHEDULES_FIRST_SCHEDULE_COL_POSTION = 4;
const SUPPORT_SCHEDULES_SME_NAME_RANGE = 'C2:C';
