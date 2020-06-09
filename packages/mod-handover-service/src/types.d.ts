declare module '*.graphql';
declare module '*.json';

// define your types here
type HandoverType = {
    handover_id: Number,
    handover_region: String,
    date: String,
    handover_notes: String,
    fts_count: Number,
    unassigned_count: Number,
    worh_count: Number,
    woc_count: Number,
    ace_count: Number,
    irt_count: Number,
    rme_count: Number,
    unassigned_ncq_sev_1_2_count: Number,
    urgent_severity_1_breaches_count: Number,
    manager_id: String,
    manager_first_name: String,
    manager_last_name: String,
    manager_email: String,
    handover_type: String,
    watchlist: String,
    proactive_cases: String,
    sensitive_accounts: String,
};

type CaseType = {
    case_id: Number,
    handover_id: Number,
    case_no: String,
    case_type: String,
    date: String,
    case_notes: String,
    account_name: String,
    sbr_names: String,
    emt_case_type: String,
    emt_case_expectation: String,
    emt_case_ue_ticket_no: String,
    emt_case_ice_ticket_no: String,
    emt_case_trello: String,
    emt_case_notes: String,
};

type EmailType = {
    handover: HandoverType,
    cases: [ CaseType ],
    emailRecipient: [ String ],
};

type SFDCType = {
    account_name: String;
};
