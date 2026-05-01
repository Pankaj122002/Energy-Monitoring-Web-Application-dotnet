using System.Collections.Generic;
using System.Configuration;

namespace ComplaintMGT.Abstractions
{
    public static class Constants
    {
        public static readonly string ERICSSON_DOMAIN = "ERICSSON";
        public static readonly string ERICSSON_DOMAIN_FOR_LADP = "ERICSSON.SE";
        public static readonly string JWT_TOKEN_NAME = "jwttoken";
        public static readonly string REMEMBERME_SESSION = "REMEMBERME_SESSION_TIMEOUT";
        public static readonly string SESSION_TIMEOUT = "SESSION_TIMEOUT";
        //Constants Related to Asset Registry Audit

        public const string ASSET_SAVE_CASE_DRAFT = "SAVEASDRAFT";
        public const string ASSET_SAVE_CASE_SAVE = "SAVE";
        public const string ASSET_SAVE_CASE_SAVEANDADDSIMILAR = "SAVEANDADDSIMILAR";

        public const string ASSET_REGISTRY_AUDIT_ADD_ACTION = "ADD";
        public const string ASSET_REGISTRY_EDIT_ACTION = "EDIT";
        public const string ASSET_REGISTRY_RESUBMIT_ACTION = "RESUBMIT";
        public const string ASSET_REGISTRY_SENDTOAPPROVAL_ACTION = "SENDTOAPPROVAL";
        public const string ASSET_REGISTRY_APPROVE_ACTION = "APPROVE";
        public const string ASSET_REGISTRY_REJECT_ACTION = "REJECT";
        public const string ASSET_REGISTRY_REWORK_ACTION = "REWORK";
        public const string ASSET_REGISTRY_RETIRE_ACTION = "RETIRE";
        public const string ASSET_REGISTRY_AUTOUPDATE_ACTION = "AUTO-UPDATE";
        public const string ASSET_AUTO_REJECT_ACTION = "auto-rejected by System";
        public const string ASSET_AUTO_REJECT_ACTION_TEXT_OLD = "has been rejected by";
        public const string ASSET_AUTO_REJECT_ACTION_TEXT_NEW = "has been";
        public const string ASSET_REGISTRY_DOWNGRADE_UPGRADE_TO_UCA_ACTION = "DOWNGRADE_UPGRADE_TO_UCA";




        public const string ASSET_REGISTRY_AUDIT_ASSOCIATE_ACTION = "ASSOCIATE";
        public const string ASSET_REGISTRY_AUDIT_DEASSOCIATE_ACTION = "DEASSOCIATE";
        public const string ASSET_REGISTRY_AUDIT_UPDATE_ACTION = "UPDATE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSET_STATUS = "ASSET STATUS";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_NAME = "ASSET NAME";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_URL = "ASSET URL";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_FRAMEWORK = "FRAMEWORK";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ROLE = "ROLE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_KNOWLEDGEAREA = "KNOWLEDGE AREA";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_LANGUAGE = "LANGUAGE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSET_TYPES = "ASSET TYPE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_PRODUCT = "PRODUCT";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ENGAGEMENTPHASE = "ENGAGEMENT PHASE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ENGAGEMENTPHASEGROUP = "ENGAGEMENT PHASE GROUP";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSETSTATUS = "ASSET STATUS";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_SOURCE = "SOURCE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_SAVINGMETHOD = "SAVING METHOD";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_SME_SIGNUM = "ASSET OWNER SIGNUM";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_APPROVER_SIGNUM = "ASSET APPROVER SIGNUM";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_CO_PROPOSER_SIGNUM = "CO-PROPOSER SIGNUM";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_PROPOSED_BY_SIGNUM = "PROPOSED BY";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_CLASSIFICATION = "CLASSIFICATION";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_POTENTIAL_SAVING = "POTENTIAL SAVINGS (HRS)";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSET_DESCRIPTION = "ASSET DESCRIPTION";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_SEARCH_RANKING = "SEARCH RANKING";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_IS_ASSET_AVAILABLE = "IS ASSET AVAILABLE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_AVAILABLE_ON = "STATUS DATE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSETGROUP = "ASSET GROUP";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSETROLE = "RELATION TYPE";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_RELATIONDESCRIPTION = "RELATION DESCRIPTION";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_REJECT_COMMENT = "COMMENT";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_OWNERSHIP = "OWNERSHIP";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_REPLACEDASSETID = "PROPOSE ASSET IN REPLACEMENT OF";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_IS_ASSET_RESTRICTED = "IS ASSET RESTRICTED";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_ASSETOVERVIEWURL = "ASSET OVERVIEW URL";
        public const string ASSET_REGISTRY_AUDIT_PARAMETER_REASON = "DOWNGRADE/UPLIFT COMMENT";
        public const string OLD_ASSET_REGISTRY_ID = "OLD ASSET REGISTRY ID";

        public const string ASSET_REGISTRY_AUDIT_VALUE_REWORK = "TOWORK";
        public const string ASSET_REGISTRY_AUDIT_VALUE_APPROVED = "APPROVED";
        public const string ASSET_REGISTRY_AUDIT_VALUE_PENDING_APPROVAL = "TOAPPROVE";
        public const string ASSET_REGISTRY_AUDIT_VALUE_REJECTED = "REJECTED";
        public const string ASSET_REGISTRY_AUDIT_VALUE_RETIRED = "RETIRED";
        public const string ASSET_REGISTRY_AUDIT_VALUE_PROPOSED = "PROPOSED";
        public const string ASSET_REGISTRY_AUDIT_VALUE_ACTIVE = "ACTIVE";
        public const string ASSET_REGISTRY_AUDIT_VALUE_DRAFT = "DRAFT";

        //Asset Business Case

        // Actions
        public const string ASSET_BUSINESS_CASE_AUDIT_ADD_ACTION = "ADD";
        public const string ASSET_BUSINESS_CASE_AUDIT_CREATE_NEW_BASELINE_ACTION = "CREATE NEW BASELINE";
        public const string ASSET_BUSINESS_CASE_AUDIT_OVERWRITE_EXISTING_BASELINE_ACTION = "OVERWRITE CURRENT BASELINE";

        //EBC Report 
        public const string EBC_REPORT_APPLICABLE_BUT_REQUIRED = "Applicable But Required";
        public const string EBC_REPORT_APPLICABLE_BUT_NOT_REQUIRED = "Applicable But Not Required";

        //Parameters 
        public const string ASSET_BUSINESS_CASE_SAVING_METHOD = "SAVING METHOD";
        public const string ASSET_BUSINESS_CASE_PERIOD = "PERIOD";
        public const string ASSET_BUSINESS_CASE_ASSET_TYPE = "ASSET TYPE";
        public const string ASSET_BUSINESS_CASE_AUTOMATION_TYPE = "AUTOMATION TYPE";
        public const string ASSET_BUSINESS_CASE_BASELINE_VERSION = "BASELINE VERSION";
        public const string ASSET_BUSINESS_CASE_BASELINE_DATE = "BASELINE DATE";
        public const string ASSET_BUSINESS_CASE_EXPECTED_EFFORT_TO_DEVELOP = "EXPECTED EFFORT TO DEVELOP/HARVEST(mhrs)";
        public const string ASSET_BUSINESS_CASE_EXPECTED_EFFORT_TO_MAINTAIN = "EXPECTED EFFORT TO MAINTAIN(mhrs)";
        public const string ASSET_BUSINESS_CASE_ACTUAL_EFFORT_TO_DEVELOP = "ACTUAL EFFORT TO DEVELOP/HARVEST(mhrs)";
        public const string ASSET_BUSINESS_CASE_ACTUAL_EFFORT_TO_MAINTAIN = "ACTUAL EFFORT TO MAINTAIN(mhrs)";
        public const string ASSET_BUSINESS_CASE_EXPECTED_EFFORT_TO_PRODUCE_PER_ITERATION_WITHOUT_REUSEABLE_ASSET = "EXPECTED EFFORT TO PRODUCE PER ITERATION WITHOUT REUSEABLE ASSET(mhrs)";
        public const string ASSET_BUSINESS_CASE_EXPECTED_EFFORT_TO_PRODUCE_PER_ITERATION_WITH_REUSEABLE_ASSET = "EXPECTED EFFORT TO PRODUCE PER ITERATION WITH REUSEABLE ASSET(mhrs)";
        public const string ASSET_BUSINESS_CASE_EXPECTED_NO_OF_ENGAGEMENTS_TO_REUSE_ASSET = "EXPECTED NUMBER OF ENGAGEMENTS TO REUSE ASSET";
        public const string ASSET_BUSINESS_CASE_EXPECTED_NUMBER_OF_ITERATIONS_PER_PROJECT_LIFE_CYCLE = "EXPECTED NUMBER OF ITERATIONS PER PROJECT LIFE CYCLE";
        public const string ASSET_BUSINESS_CASE_TPP_WITHOUT_REUSE = "TIME TO DEVELOP";
        public const string ASSET_BUSINESS_CASE_EXPECTED_NUMBER_OF_REUSES = "EXPECTED NUMBER OF REUSES";
        public const string ASSET_BUSINESS_CASE_EXPECTED_LIFECYCLE_SAVING = "EXPECTED LIFECYCLE SAVING";
        public const string ASSET_BUSINESS_CASE_SAVING_PER_REUSE = "SAVING PER REUSE(mhrs)";
        public const string ASSET_BUSINESS_CASE_EXPECTED_PERCENTAGE_SAVING_PER_REUSE = "EXPECTED %AGE SAVING PER REUSE(mhrs)";
        public const string ASSET_BUSINESS_CASE_ROI = "ROI";
        public const string ASSET_BUSINESS_CASE_EXPECTED_AUTOMATION_EXECUTION = "EXPECTED AUTOMATION EXECUTION PER PROJECT";
        public const string ASSET_BUSINESS_CASE_AUTOMATION_SAVING_PER_EXECUTION = "AUTOMATION SAVING PER EXECUTION";
        public const string ASSET_BUSINESS_CASE_AUTOMATION_SAVING_PER_PROJECT = "AUTOMATION SAVING PER PROJECT";
        public const string ASSET_BUSINESS_CASE_EFFORT_SAVING = "ONE TIME AUTOMATION BUILD EFFORT SAVING";

        //ASSET STATUS
        public const int ASSETSTATUS_PENDINGAPPROVAL = 0;
        public const int ASSETSTATUS_APPROVED = 1;
        public const int ASSETSTATUS_REJECTED = 2;
        public const int ASSETSTATUS_REWORK = 3;
        public const int ASSETSTATUS_PROPOSED = 6;
        public const int ASSETSTATUS_RETIRED = 10;
        public const int ASSETSTATUS_DRAFT = 11;

        public const string ASSETSTATUS_NAME_TOAPPROVE = "ToApprove";
        public const string ASSETSTATUS_NAME_APPROVED = "Approved";
        public const string ASSETSTATUS_NAME_PROPOSED = "Proposed";
        public const string ASSETSTATUS_NAME_REJECTED = "Rejected";
        public const string ASSETSTATUS_NAME_TOWORK = "ToWork";
        public const string ASSETSTATUS_REJECTED_SYSTEM = "This Asset Rejected By System ";
        //ASSETGROUP TAB
        public const string ROLE_PRACTITIONER = "Practitioner";
        public const string ROLE_ASSET_OWNER = "Curator Owner";
        public const string ROLE_ASSET_APPROVER = "Curator Approver";
        public const string ROLE_GLOBAL_LIBRARIAN = "Global Librarian";
        public const string ROLE_ADMINISTRATOR = "Administrator";
        public const string ROLE_PILOT = "Pilot";
        public const string ROLE_BUSINESS_OWNER = "Business Owner";
        public const string ROLE_SA_MA_LIBRARIAN = "SA-MA Librarian";
        public const string ROLE_Analytics = "Analytics";

        // ownership Type id
        public const int MA_OWNERSHIP_TYPE_ID = 2;
        public const int SA_OWNERSHIP_TYPE_ID = 1;

        public const string USER_ROLE_NAVIGATOR = "userRoleNavigator";

        //BULK UPLOAD WORKSHEET
        public const string REUSECASE_WORKSHEET_NAME = "Reusecase";
        public const string OPPORTUNITY_WORKSHEET_NAME = "Opportunity";
        public const string ASSETREGISTRY_WORKSHEET_NAME = "Asset Registry";
        public const string ASSETGROUP_WORKSHEET_NAME = "Asset Group";

        //Bulk Upload Message
        public const string TEMPLATE_COLUMN_NOTMATCHED = "ERR_AR_044: Template parse error. Column Name: {{columnname}}. The mentioned column is missing or changed in the file. Request you to please download the latest template from Export Template option and retry.";
        public const string TEMPLATE_SHEETNAME_MISMATCHED = "ERR_AG_016: Sheet Name not matched with required template file. Request you to please download the latest template from Export Template option and retry.";

        //BUSINESS CASE VERSION
        public const string OVERWRITE_CURRENT_BASELINE = "Overwrite Current Baseline";
        public const string CREATE_NEW_BASELINE = "Create New Baseline";
        public const string CREATENEWBASELINE_FROM_VIEW = "CreateNewBaseline";

        //ASSET REGISTRY BULK UPLOAD TEMPLATE
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_FRAMEWORK_COLUMN = 1;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ROLE_COLUMN = 3;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_VALID_PRODUCT_COLUMN = 9;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ALL_PRODUCT_COLUMN = 49;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_SOURCE_COLUMN = 12;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ASSETSTATUS_COLUMN = 14;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_FRAMEWORKROLE_ENGAGEMENTPHASE_COLUMN = 16;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_FRAMEWORKROLE_KNOWLEDGEAREA_COLUMN = 19;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_FRAMEWORK_ENGAGEMENTPHASE_COLUMN = 22;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ROLE_ENGAGEMENTPHASE_COLUMN = 25;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ENGAGEMENTPHASE_COLUMN = 28;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_FRAMEWORK_KNOWLEDGEAREA_COLUMN = 30;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ROLE_KNOWLEDGEAREA_COLUMN = 33;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_KNOWLEDGEAREA_COLUMN = 36;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_LANGUAGE_COLUMN = 43;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_SAVINGMETHOD_COLUMN = 45;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_ASSETTYPES_COLUMN = 46;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_OWNERSHIP_COLUMN = 47;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_BUSSINESSCASE_ASSETTYPE_COLUMN = 54;
        public const int BULK_UPLOAD_TEMPLATE_PARAMETER_BUSSINESSCASE_AUTOMATIONTYPE_COLUMN = 55;

        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_ACTION_COLUMN = 1;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_ID_COLUMN = 2;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_NAME_COLUMN = 3;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_APPROVAL_STATUS_COLUMN = 4;
        public const int BULK_UPLOAD_TEMPLATE_DATA_IS_ASSET_AVAILABLE_COLUMN = 5;
        public const int BULK_UPLOAD_TEMPLATE_DATA_AVAILABLEON_DATE_COLUMN = 6;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_URL_COLUMN = 7;
        public const int BULK_UPLOAD_TEMPLATE_DATA_IS_ASSET_RESTRICTED_COLUMN = 8;
        public const int BULK_UPLOAD_TEMPLATE_DATA_OWNERSHIP_COLUMN = 9;
        public const int BULK_UPLOAD_TEMPLATE_DATA_PRODUCT_COLUMN = 10;
        public const int BULK_UPLOAD_TEMPLATE_DATA_FRAMEWORK_COLUMN = 11;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ROLE_COLUMN = 12;
        public const int BULK_UPLOAD_TEMPLATE_DATA_KNOWLEDGEAREA_COLUMN = 13;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ENGAGEMENTPHASE_COLUMN = 14;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETTYPESNAME_COLUMN = 15;
        public const int BULK_UPLOAD_TEMPLATE_DATA_LANGUAGE_COLUMN = 16;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_SME_SIGNUM_COLUMN = 17;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_APPROVER_SIGNUM_COLUMN = 18;
        public const int BULK_UPLOAD_TEMPLATE_DATA_SOURCE_COLUMN = 19;
        public const int BULK_UPLOAD_TEMPLATE_DATA_SAVING_METHOD_COLUMN = 20;
        public const int BULK_UPLOAD_TEMPLATE_DATA_CLASSIFICATION_COLUMN = 21;
        public const int BULK_UPLOAD_TEMPLATE_DATA_SEARCH_RANKING_COLUMN = 22;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSET_DESCRIPTION_COLUMN = 23;
        public const int BULK_UPLOAD_TEMPLATE_DATA_TAGS_COLUMN = 24;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETOVERVIEWURL_COLUMN = 25;
        public const int BULK_UPLOAD_TEMPLATE_DATA_BUSINESS_CASE_ACTION_TYPE = 26;
        //25 to 33 non calulcated fields
        public const int BULK_UPLOAD_TEMPLATE_DATA_BUSINESS_CASE_PERIOD_COLUMN = 27;
        public const int BULK_UPLOAD_TEMPLATE_DATA_BUSINESS_CASE_ASSET_TYPE_COLUMN = 28;
        public const int BULK_UPLOAD_TEMPLATE_DATA_BUSINESS_CASE_AUTOMATION_TYPE_COLUMN = 29;

        public const int BULK_UPLOAD_TEMPLATE_DATA_EXPECTED_TIME_TO_DEVELOP_COLUMN = 30;
        public const int BULK_UPLOAD_TEMPLATE_DATA_EXPECTED_TIME_TO_MAINTAIN_COLUMN = 31;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETBUILDTIME_COLUMN = 32;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETACTUALTIMETOMAINTAIN_COLUMN = 33;
        public const int BULK_UPLOAD_TEMPLATE_DATA_TTC_WITHOUT_REUSE_COLUMN = 34;
        public const int BULK_UPLOAD_TEMPLATE_DATA_TTC_WITH_REUSE_ASSET_COLUMN = 35;
        public const int BULK_UPLOAD_TEMPLATE_DATA_PROJECT_COUNT_TO_REUSE = 36;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ITERATIONS_PER_PROJECT_LIFECYCLE = 37;
        public const int BULK_UPLOAD_TEMPLATE_DATA_EXPECTED_REUSE_COUNT_COLUMN = 38;
        //34 to 38 calculated fields
        public const int BULK_UPLOAD_TEMPLATE_DATA_EXPECTED_LIFECYCLE_SAVING_COLUMN = 39;
        public const int BULK_UPLOAD_TEMPLATE_DATA_SAVING_PER_REUSE_COLUMN = 40;
        public const int BULK_UPLOAD_TEMPLATE_DATA_PERCENT_SAVING_PER_REUSE_COLUMN = 41;
        public const int BULK_UPLOAD_TEMPLATE_DATA_RETURN_ON_INVESTMENT_COLUMN = 42;

        public const int BULK_UPLOAD_TEMPLATE_DATA_EXPECTED_AUTOMATION_EXECUTION_COLUMN = 43;
        public const int BULK_UPLOAD_TEMPLATE_DATA_AUTOMATION_PER_EXECUTION_COLUMN = 44;
        public const int BULK_UPLOAD_TEMPLATE_DATA_EFFORT_SAVING_COLUMN = 45;
        public const int BULK_UPLOAD_TEMPLATE_DATA_AUTOMATION_SAVING_PER_PROJECT_COLUMN = 46;

        //
        public const int BULK_UPLOAD_TEMPLATE_DATA_PROPOSED_BY_COLUMN = 47;
        public const int BULK_UPLOAD_TEMPLATE_DATA_CO_PROPOSER_COLUMN = 48;
        public const int BULK_UPLOAD_TEMPLATE_DATA_DOWNLOAD_ASSET_URL = 49;
        public const int BULK_UPLOAD_TEMPLATE_DATA_OVERWRITE_REASON = 50;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETOWNERFULLNAME = 51;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETAPPROVERFULLNAME = 52;
        public const int BULK_UPLOAD_TEMPLATE_DATA_PROPOSEDBYFULLNAME = 53;
        public const int BULK_UPLOAD_TEMPLATE_DATA_COPORPOSERFULLNAME = 54;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSEPUBLISHEDDATE = 55;
        public const int BULK_UPLOAD_TEMPLATE_DATA_ASSETLASTACTIONDATE = 56;
        public const int BULK_UPLOAD_TEMPLATE_DATA_AGINGDAYS = 57;

        //BULK UPLOAD TEMPLATE FOR GROUP ASSET
        public const string BULK_UPLOAD_GROUP_TEMPLATE_PARAM_PARENT_ROLE_NAME = "PARENT";
        public const string BULK_UPLOAD_GROUP_TEMPLATE_PARAM_CHILD_ROLE_NAME = "CHILD";
        public const string BULK_UPLOAD_GROUP_TEMPLATE_PARAM_PEER_ROLE_NAME = "PEER";
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_PARENT_ROLE = 1;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_CHILD_ROLE = 2;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_PEER_ROLE = 3;

        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_GROUP_COLUMN = 1;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_ASSET_COLUMN = 3;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_FRAMEWORK_COLUMN = 4;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_ROLE_COLUMN = 5;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_KNOWLEDGEAREA_COLUMN = 6;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_PRODUCT_COLUMN = 7;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_ENGAGEMENTPHASEGP_COLUMN = 8;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_PARAM_ENGAGEMENTPHASE_COLUMN = 9;

        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_ACTION_COLUMN = 1;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_ASSET_RELATION_ID_COLUMN = 2;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_ASSET_GROUP_COLUMN = 3;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_ASSET_NAME_COLUMN = 4;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_RELATION_COLUMN = 5;
        public const int BULK_UPLOAD_GROUP_TEMPLATE_DATA_DESCRIPTION_COLUMN = 6;


        //DOWNLOAD RAW DATA 
        public const string DOWNLOAD_RAW_DATA_ASSET_REGISTRY_SHEET_NAME = "Asset Registry";
        public const string DOWNLOAD_RAW_DATA_FEEDBACK_SHEET_NAME = "Feedback";
        public const string DOWNLOAD_RAW_DATA_FEEDBACK_ITERATION_SHEET_NAME = "Feedback_Iteration";
        public const string DOWNLOAD_RAW_DATA_ENGAGEMENT_SHEET_NAME = "Engagement";
        public const string DOWNLOAD_RAW_DATA_ENGAGEMENT_BUSINESS_CASE_SHEET_NAME = "Engagement Business Case";
        public const string DOWNLOAD_RAW_DATA_REUSE_CASE_SHEET_NAME = "Reuse Case";
        public const string DOWNLOAD_RAW_DATA_ORG_HIERARCHY_SHEET_NAME = "Org Hierarchy";
        public const string DOWNLOAD_RAW_DATA_PLANNED_ASSET_EBC2_SHEET_NAME = "Planned Asset Upto EBC2";
        public const string DOWNLOAD_RAW_DATA_EBC_PLANNED_ASSET_SHEET_NAME = "EBC Planned Asset";
        public const string DOWNLOAD_RAW_DATA_REPORTED_NULL_SEARCH_SHEET_NAME = "Reported Null Search";
        public static readonly string[] DOWNLOAD_RAW_DATA_SHEET_NAMES = { "Asset Registry", "Feedback", "Org Hierarchy",
            "Planned Asset Upto EBC2", "EBC Planned Asset", "Reported Null Search"};
        public const string DOWNLOAD_RAW_DATA_BOOKMARK_SHEET_NAME = "Bookmark";
        public static readonly string[] DOWNLOAD_LOGIN_SEARCH_RAW_DATA_SHEET_NAMES = { "Main", "Login Details" };
        public static readonly int TOTAL_SHEETS_FOR_DOWNLOAD_RAW_DATA = DOWNLOAD_RAW_DATA_SHEET_NAMES.Length;
        public const string DOWNLOAD_ASSET = "#/DownloadAsset/";

        //BULK UPLOAD TEMPLATE FOR OPPORTUNITY
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_OPPORTUNITY_ACTION_COLUMN = 1;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_OpportunityID_COLUMN = 2;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_NAME_COLUMN = 3;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_CRMID_COLUMN = 4;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_ORGFIRST_COLUMN = 5;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_ORGSECOND_COLUMN = 6;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_CUSTNAME_COLUMN = 7;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_OPPVALUE_COLUMN = 8;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_OPPORPROBABILITY_COLUMN = 9;
        public const int BULK_UPLOAD_OPPORTUNITY_TEMPLATE_PARAM_DEADLINE_COLUMN = 10;

        //BULK UPLOAD TEMPLATE FOR REUSE CASE
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_PARAM_ASSETNAME_COLUMN = 1;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_PARAM_ASSETGROUP_COLUMN = 3;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_PARAM_OPPORTUNITY_COLUMN = 5;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_PARAM_STATUS_COLUMN = 7;

        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_REUSECASE_ACTION_COLUMN = 1;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_REUSECASEID_COLUMN = 2;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_ASSETNAME_COLUMN = 3;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_ASSETGROUP_COLUMN = 4;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_OPPORTUNITY_COLUMN = 5;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_DESCRIPTION_COLUMN = 6;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_DOWNLOAD_DATE_COLUMN = 7;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_DOWNLOADER_SIGNUM_COLUMN = 8;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_ALTERNATE_SIGNUM_COLUMN = 9;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_PROJECT_MANAGER_SIGNUM_COLUMN = 10;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_EXPECTED_COST_SAVING_COLUMN = 11;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_EXPECTED_EFFORT_SAVING_COLUMN = 12;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_ACTUAL_COST_SAVING_COLUMN = 13;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_ACTUAL_EFFORT_SAVING_COLUMN = 14;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_STATUS_COLUMN = 15;
        public const int BULK_UPLOAD_REUSECASE_TEMPLATE_DATA_LAST_STATUS_DATE_COLUMN = 16;

        //Manage Portfolio Operations 
        public const string GET_TOTAL_ASSETS = "TOTAL_ASSETS";
        public const string GET_MANAGED_ASSETS = "MANAGED_ASSETS";
        public const string GET_UNMANAGED_CONTEXTUAL_ASSETS = "UNMANAGED_CONTEXTUAL_ASSETS";
        public const string GET_ALL_APPROVED_ASSETS = "ALL_APPROVED_ASSETS";
        public const string GET_ALL_PENDING_APPROVAL_ASSETS = "ALL_PENDING_APPROVAL_ASSETS";
        public const string GET_ALL_REJECTED_ASSETS = "ALL_REJECTED_ASSETS";
        public const string GET_ALL_UNPUBLISHED_ASSETS = "ALL_UNPUBLISHED_ASSETS";
        public const string GET_ALL_STOPPED_ASSETS = "ALL_STOPPED_ASSETS";
        public const string GET_ALL_RETIRED_ASSETS = "ALL_RETIRED_ASSETS";
        public const string GET_USER_SAVED_SEARCHES = "USER_SAVED_SEARCHES";
        public const string GET_USER_SAVED_SEARCHES_SHARED = "USER_SAVED_SEARCHES_SHARED";
        public const string GET_USER_SAVED_SEARCHES_SUBSCRIBED = "USER_SAVED_SEARCHES_SUBSCRIBED";
        public const string GET_ALL_MISSING_ASSETS = "ALL_MISSING_ASSETS";
        public const string GET_ALL_AGED_ASSETS = "ALL_AGED_ASSETS";
        public const string GET_ALL_UNUSED_ASSETS = "ALL_UNUSED_ASSETS";
        public const string GET_ALL_RETIRED_PRODUCT_ASSETS = "ALL_RETIRED_PRODUCT_ASSETS";
        public const string GET_ALL_DOWNLOADED_ASSETS = "ALL_DOWNLOADED_ASSETS";
        public const string GET_ALL_ASSETS_WITH_INVALID_SIGNUMS = "ALL_ASSETS_WITH_INVALID_SIGNUMS";
        public const string GET_ALL_DOWNLOAD_VS_REUSE_ASSETS = "ALL_DOWNLOAD_VS_REUSE_ASSETS";
        public const string GET_ALL_NULL_SEARCH_RESULT = "ALL_NULL_SEARCH_RESULT";
        public const string ASSET_SUB_OP_GET_REJECTED_PROPOSALS = "ProposalsRejected";
        public const string ASSET_SUB_OP_GET_ACCEPTED_PROPOSALS = "ProposalsAccepted";
        public const string GET_ALL_AGED_ASSET_VIEW = "ALL_AGED_ASSET_VIEW";
        public const string ASSET_SUB_OP_GET_UNMANAGED = "UNMANAGED";

        public const int USER_SAVED_SEARCH_SUBSCRIBED_STATUS = 1;
        public const string DEFAULT_CONNECTION_NAME = "PyramidDbConnection";
        public const string QMT_SAVING_API_LAST_PAGE_KEY = "X-LastPage";
        public const string QMT_SAVING_API_FAS_PARAMETER_VALUE = "NOTNULL";
        public const int QMT_NET_SAVING_API_GROUPBY_PARAMETER_VALUE = 1;
        public const string QMT_APP_NAME = "QMT";
        public const int QMT_FEEDBACK_VALIDATED_STATUS = 2;
        public const string QMT_DONE_FEEDBACK_COMMENT = "Record update as per Saving received from QMT";
        public const string QMT_INVALIDATE_FEEDBACK_COMMENT = "Invalidated as automated savings received from QMT";

        //FEEDBACK STATUS
        public const int FEEDBACK_STATUS_PENDING = 1;
        public const int FEEDBACK_STATUS_DONE = 2;
        public const int FEEDBACK_STATUS_CLARIFICATION = 3;
        public const int FEEDBACK_STATUS_INVALIDATED = 4;
        public const int FEEDBACK_REUSETYPE_YES = 1;
        public const int FEEDBACK_REUSETYPE_NO = 2;
        public const int FEEDBACK_REUSETYPE_DEFER = 3;
        public const string FEEDBACK_STATUS_CLARIFICATION_NAME = "Clarification";
        public const string FEEDBACK_STATUS_INVALIDATED_Name = "Invalidated";
        public const string FEEDBACK_STATUS_VALIDATED_NAME = "Validated";
        public const string FEEDBACK_STATUS_NOTREUSED_NAME = "Not Reused";
        public const string RECIEVED_FEEDBACK_SHEETNAME = "Feedback";
        public const string FEEDBACKSTATUSNOREUSE = "No reuse ever intended; downloaded for inspection/informational purposes";


        //REUSE CASE STATUS
        public const int REUSE_CASE_STATUS_PROPOSED = 9;
        public const string REUSE_CASE_STATUS_PROPOSED_TEXT = "Proposed";

        //REUSE CASE STATUS TO BE DELETED
        public const int REUSE_CASE_STATUS_DUE = 2;
        public const int REUSE_CASE_STATUS_CANDIDATE = 3;
        public const int REUSE_CASE_STATUS_REUSING = 4;
        public const int REUSE_CASE_STATUS_STOPPED = 5;
        public const int REUSE_CASE_STATUS_SUBSCRIBE = 7;
        public const int REUSE_CASE_STATUS_DUPLICATE = 8;
        public const int REUSE_CASE_STATUS_DELETED = 10;


        //Feedback Usage
        public const string USAGE_NOTUSED = "Downloaded but not used";
        public const string USAGE_REUSEAS = "Reused As-Is";
        public const string USAGE_MINORMOD = "Made minor modifications before reuse";
        public const string USAGE_MAJORMOD = "Made major modifications before reuse";

        //Product Status
        public const int PRODUCT_STATUS_VALID = 1;
        public const int PRODUCT_STATUS_RETIRED = 2;

        #region
        //BulkUPLOAD ACTION
        public const string BULK_ACTION_NONE = "NONE";
        public const string BULK_ACTION_ADD = "ADD";
        public const string BULK_ACTION_EDIT = "EDIT";
        public const string BULK_ACTION_UPDATE = "UPDATE";
        public const string BULK_ACTION_DELETE = "DELETE";
        public const string BULK_ASSET_AVAILABLEON = "NO";
        public const string BULK_ACTION_RETIRE = "RETIRE";
        public const string BULK_ACTION_APPROVE = "APPROVE";



        //Template Headers

        public static readonly string[] BULK_UPLOAD_ASSET_REGISTRY_TEMPLATE
            = new string[] { "Asset Action", "Asset ID", "Asset Name","Asset Status","Is Asset Available?", "Available on (Date)", "Asset URL", "Is Asset Restricted?", "Ownership", "Product", "Framework", "Roles", "Knowledge Areas",
            "Engagement Phase","Asset Type","Language", "Asset Owner Signum", "Asset Approver Signum", "Source", "Saving Method", "Classification", "Search Ranking", "Asset Description",
            "Tags","Asset Overview URL","Business Case Action","Business Case Period (Months)","Automation Asset Type","Automation Type",
            "Expected Effort to Develop/Harvest(mhrs)","Expected Effort To Maintain(mhrs)", "Actual Effort To Develop/Harvest(mhrs)",
            "Actual Effort To Maintain(mhrs)", "Expected Effort To Produce Per Iteration Without Reusable Asset(mhrs)", "Expected Effort To Produce Per Iteration With Reusable Asset(mhrs)",
            "Expected Number of Engagements/Projects to Re-use the Asset", "Expected Number of Iterations per Engagement/Project",
            "Expected number of Reuses", "Expected Lifecycle Saving(mhrs)", "Saving Per Reuse(mhrs)", "Expected %age Saving Per Reuse", "Return On Investment",
            "Expected Automation Execution","Automation Saving Per Execution (mhrs)","M6 - Automation Utility One-time Effort Saving (mhrs)","Automation Saving Per Project (mhrs)",
             "Proposed By", "Co-Proposer Signum", "Asset Download URL", "Overwrite Reason",
            "Asset Owner FullName","Asset Approver FullName", "Proposed By FullName", "Co-Proposer FullName","Asset Published Date","Asset Last Action Date","Asset Aging (Days)"};

        //Reusecase Headers
        public static readonly string[] BULK_UPLOAD_REUSECASE_TEMPLATE
            = new string[] { "Action", "ID", "Asset Name", "Asset Group", "Opportunity", "Reuse Case Description", "Download Date", "Downloader Signum", "Alternate Signum","Project Manager",
            "Expected Cost Saving by Reuse (KSEK)", "Expected Effort Saving by Reuse (mhrs)", "Actual Cost Saving by Reuse (KSEK)", "Actual Effort Saving by Reuse (mhrs)", "Reuse Case Status", "Last Status Date" };

        //AssetGroup Headers
        public static readonly string[] BULK_UPLOAD_ASSETGROUP_TEMPLATE
            = new string[] { "Action", "Asset Relation ID", "Asset Group", "Asset Name", "Asset Relationship", "Description", "Asset Group URL" };


        //Opportunity Header
        public static readonly string[] BULK_UPLOAD_OPPORTUNITY_TEMPLATE
            = new string[] { "Action", "ID", "Name", "CRMID", "Organization Level 1", "Organization Level 2", "Customer",
                "Opportunity Value(KSEK)","Probability (%)","DeadLine"};

        public const int DEFAULT_NOT_AVAILABLE_ID = -101;
        public const int DEFAULT_NOT_AVAILABLE_ID_ROSETTA = 8;
        //Error Code
        public const int BULK_UPLOAD_STATUS_SUCCESS = 0; //success
        public const int BUL_UPLOAD_STATUS_EMPTY = 1; //Empty
        public const int BULK_UPLOAD_STATUS_NONE = 2; //None
        public const int BULK_UPLOAD_STATUS_DATEERROR = 3; //ERR_DATE        
        public const int BULK_UPLOAD_STATUS_INVALID_SME = 4; //Invalid Asset Owner Signum
        public const int BULK_UPLOAD_STATUS_INVALID_APPROVER = 5; //Invalid Asset Approver Signum
        public const int BULK_UPLOAD_STATUS_RECORD_ALREADY_EXIST = 6;//Record Already Exists
        public const int BULK_UPLOAD_STATUS_CHECK_METADATA = 7;//Unable to Save Asset, Check Metadata
        public const int BULK_UPLOAD_STATUS_NO_RIGHTS = 8;//Don't have rights to modify     
        public const int BULK_UPLOAD_STATUS_REUSE_ASSET_NAME_MODIFIED = 9;//REUSE CASE ASSET NAME MODIFIED             
        public const int BULK_UPLOAD_STATUS_REUSE_INCORRECT_GROUP = 10;//INCORRECT GROUP MAPPED             
        public const int BULK_UPLOAD_STATUS_REUSE_INVALID_STATUS = 11;//INVALID STATUS TRANSITION
        public const int BULK_UPLOAD_STATUS_REUSE_ONLY_SUBMIT_ALLOWED = 12;//INVALID STATUS TRANSITION
        public const int BULK_UPLOAD_STATUS_REUSE_MUST_CHANGE_STATUS_PENDING_DUE = 13;//INVALID STATUS TRANSITION
        public const int BULK_UPLOAD_STATUS_REUSE_USER_NOT_SUBMIT_ASSET = 14;//INVALID STATUS TRANSITION
        public const int BULK_UPLOAD_STATUS_OPPORTUNITY_INVALID_PROBABILITY = 15;//INVALID STATUS TRANSITION
        public const int BULK_UPLOAD_STATUS_ASSET_INVALID_URL = 16;//INVALID ASSET URL
        public const int BULK_UPLOAD_STATUS_REUSE_ONLY_CANDIDATE_REUSING_ALLOWED = 17;
        public const int BULK_UPLOAD_STATUS_REUSE_PM_SAME_SIGNUM = 18;
        public const int BULK_UPLOAD_STATUS_REUSE_INVALID_PM_SIGNUM = 19;
        public const int BULK_UPLOAD_STATUS_UNAUTH_SME = 20; //Un-authorized Asset Owner Signum
        public const int BULK_UPLOAD_STATUS_UNAUTH_APPROVER = 21; //Un-authorized Asset Approver Signum
        public const int BULK_UPLOAD_STATUS_NO_RIGHTS_ASSETGROUP_DELETE = 22;
        public const int BULK_UPLOAD_STATUS_NO_RIGHTS_ASSETGROUP_EDIT = 23;
        public const int BULK_UPLOAD_STATUS_ASSET_DESCRIPTION_LENGTH = 24;
        public const int BULK_UPLOAD_STATUS_ASSET_INVALID_INT_VALUE = 25;
        public const int BULK_UPLOAD_STATUS_INVALID_PROPOSED_BY = 26; //Invalid Asset Proposed By Signum
        public const int BULK_UPLOAD_STATUS_INVALID_CO_PROPOSER = 27; //Invalid Asset CO-Proposer Signum
        public const int BULK_UPLOAD_STATUS_INVALID_OWNERSHIP = 28;
        public const int BULK_UPLOAD_STATUS_INVALID_PRODUCT_BY_OWNERSHIP = 29;
        public const int BULK_UPLOAD_STATUS_INVALID_PRODUCT_RETIRED = 30;
        public const int BULK_UPLOAD_STATUS_INVALID_MAPPED_OWNER = 31;
        public const int BULK_UPLOAD_STATUS_INVALID_MAPPED_APPROVER = 32;
        public const int BULK_UPLOAD_STATUS_RETIRED_ASSET_ASSOCIATED_WITH_EBC = 33;
        public const int BULK_UPLOAD_STATUS_AVAILABLEONDATE_LESSTHENCURRENTDATE = 34;
        public const int BULK_UPLOAD_STATUS_SAVING_METHOD_CHANGE_FROM_M1_M5_TO_M6 = 35;
        public const int BUL_UPLOAD_STATUS_EMPTY_NOT_ZERO = 36; //Empty
        public const int BULK_UPLOAD_STATUS_NEGATIVE_SAVING = 37; //Negative Saving
        public const int BULK_UPLOAD_STATUS_ASSET_OVERVIEW_URL = 38;//INVALID ASSET OVERVIEW URL
        public const int BULK_UPLOAD_STATUS_ASSET_TYPE_UNKNOWN = 39;//UNKNOWN ASSET TYPE
        public const int BULK_UPLOAD_STATUS_FRAMEWORK = 40;//INVALID FRAMEWORK
        public const int BULK_UPLOAD_STATUS_ROLE = 41;//INVALID ROLE
        public const int BULK_UPLOAD_STATUS_KNOWLEDGE_AREA = 42;//INVALID KNOWLEDGE AREA
        public const int BULK_UPLOAD_STATUS_PRODUCT = 43;//INVALID PRODUCT 
        public const int BULK_UPLOAD_STATUS_ENGAGEMENTPHASE = 44; //INVALID ENGAGEMENTPHASE
        public const int BULK_UPLOAD_STATUS_INVALID_ASSET_TYPE = 45;//INVALID ASSET TYPE
        public const int BULK_UPLOAD_STATUS_INVALID_LANGUAGE = 46; //INVALID LANGUAGE
        public const int BULK_UPLOAD_STATUS_INVALID_SOURCE = 47; //INVALID SOURCE
        public const int BULK_UPLOAD_STATUS_INVALID_SAVING_METHOD = 48; //INVALID SAVING METHOD
        public const int BULK_UPLOAD_STATUS_INVALID_EXPECTED_AUTOMATION_EXECUTION = 49;

        public static readonly string[] BULK_UPLOAD_ASSET_REGISTRY_ERROR_MESSAGE
            = new string[] { "Upload successful",                                       //BULK_UPLOAD_STATUS_SUCCESS
                "Column values can't be empty",                                         //BUL_UPLOAD_STATUS_EMPTY
                "Record not modify for action NONE ",                                   //BULK_UPLOAD_STATUS_NONE
                "Incorrect Date Format",                                                //BULK_UPLOAD_STATUS_DATEERROR
                "Invalid Asset Owner Signum",                                             //BULK_UPLOAD_STATUS_INVALID_SME
                "Invalid Asset Approver Signum",                                        //BULK_UPLOAD_STATUS_INVALID_APPROVER
                "Duplicate record exists",                                              //BULK_UPLOAD_STATUS_RECORD_ALREADY_EXIST
                "Unable to save record, Check Metadata",                                //BULK_UPLOAD_STATUS_CHECK_METADATA
                "You don't have rights to modify record",                               //BULK_UPLOAD_STATUS_NO_RIGHTS
                "Asset name modified for existing Reuse-Case which is not allowed",    //BULK_UPLOAD_STATUS_REUSE_ASSET_NAME_MODIFIED
                "Asset is not associated with mapped group",                           //BULK_UPLOAD_STATUS_REUSE_INCORRECT_GROUP
                "Invalid status specified. Status transition not allowed",              //BULK_UPLOAD_STATUS_REUSE_INVALID_STATUS
                "Either this is not a submitted asset OR status is not 'Submitted'", //BULK_UPLOAD_STATUS_REUSE_ONLY_SUBMIT_ALLOWED
                "You must change the status from Pending/Due to Candidate/Reusing",    //BULK_UPLOAD_STATUS_REUSE_MUST_CHANGE_STATUS_PENDING_DUE
                "Incorrect Reuse case status. Only 'Submitted' status for submitted assets and 'Candidate'/'Reusing' status for downloaded assets is allowed",              //BULK_UPLOAD_STATUS_REUSE_USER_NOT_SUBMIT_ASSET
                "Invalid Probability value",                                           //BULK_UPLOAD_STATUS_OPPORTUNITY_INVALID_PROBABILITY
                "Invalid value for Asset URL",                                            //BULK_UPLOAD_STATUS_ASSET_INVALID_URL
                "Either this is not a downloaded asset OR status is not 'Candidate' Or 'Reusing'",
                "Project Manager/Business Owner signum should not be same as Creator signum",
                "Invalid Project Manager/Business Owner Signum",
                "Un-Authorized Asset Owner Signum",
                "Un-Authorized Asset Approver Signum",
                "This group is not created by you, so you can't delete",
                "This group is not created by you, so you can't edit",
                "Asset Description length is more than 2048 character",
                "Incorrect value. Should be numeric and greater than zero",
                "Invalid Asset Proposed By Signum",
                "Invalid Asset Co-Proposer Signum",
                "You do not have access to Ownership selected for the asset",
                "Invalid Product selected for the Ownership of the asset",
                "Selected product is retired",
                "Asset owner signum is not mapped with ownership and product",
                "Asset approver signum is not mapped with ownership and product",
                "Asset not retired since asset is associated with EBC. Provide input/confirmation on Navigator365 Web",
                "Available on date should not less than today's date",
                "Changing Saving Method from M1,M2,M3,M4,M5 to M6 or vice-versa then you can only Create New Baseline instead of Overwrite Current Baseline",
                "Column values can't be empty or 0",
                "Submiting saving per reuse with negative value.",
                "Invalid value for Asset Overview URL",
                "Unknown is not allowed for Asset Type",
                "Invalid value for Framework",
                "Invalid value for Role",
                "Invalid value for Knoledge Area",
                "Invalid value for Product",
                "Invalid value for Engagement Phase",
                "Invalid value for Asset Type",
                "Invalid value for Language",
                "Invalid value for Source",
                "Invalid value for Saving Method or not selected from given options",
                "Invalid value for Expected Automation Execution, value for this field ranges between 0 and 999999" // BULK_UPLOAD_STATUS_INVALID_EXPECTED_AUTOMATION_EXECUTION
            };
        #endregion

        #region Feedback Master Data
        public const string SORT_DIRECTION_ASC = "ASC";
        public const string SORT_DIRECTION_DESC = "DESC";
        public const string ENTITY_MARKET_AREA = "MARKET_AREA";
        public const string ENTITY_COUNTRY = "COUNTRY";
        public const string ENTITY_CUSTOMER = "CUSTOMER";

        public const string ENTITY_ORGANIZATION = "ORGANIZATION";
        public const string ENTITY_OPPORTUNITY = "OPPORTUNITY";
        public const string ENTITY_CPAP = "CPAP";
        public const string ENTITY_FAS = "FAS";
        public const string ENTITY_FEEDBACK_ORG_ENG_MAPPING = "ENGAGEMENT MAPPING";
        public const string ACCEPTED_RELEASED = "Accepted and Released";
        public const string ENTITY_PCode = "PCODE";
        public const string ENTITY_OppStageSPD2 = "OPP STAGE–SDP2";
        #endregion

        #region Saving calculation methods
        public const int SAVING_METHOD_M0_NO_SAVING = 0;
        public const int SAVING_METHOD_M1_PREDEFINED_SAVING = 1;
        public const int SAVING_MEHTOD_M2_ADJUSTED_WITH_EFFORT = 2;
        public const int SAVING_METHOD_M3_ADJUSTED_BY_PERCENTAGE = 3;
        public const int SAVING_METHOD_M4_ADJUSTED_BY_PERCENTAGE_AND_EFFORT = 4;
        public const int SAVING_METHOD_M5_ADJUSTED_BY_PRODUCTIVITY_TOOLS = 5;
        public const int SAVING_METHOD_M6_AUTOMATED_ASSET = 6;
        #endregion

        #region Feedback Reasons for Not Reusing
        public const int FEEDBACK_NOT_REUSED_REASON_INSPECTION = 1;
        public const int FEEDBACK_NOT_REUSED_REASON_NOT_APPROPRIATE = 2;
        public const int FEEDBACK_NOT_REUSED_REASON_TOO_MUCH_REWORK = 3;
        public const int FEEDBACK_NOT_REUSED_REASON_POOR_QUALITY = 4;
        public const int FEEDBACK_NOT_REUSED_REASON_EXTERNAL = 5;
        public const int FEEDBACK_NOT_REUSED_REASON_OTHERS = 6;
        public const int FEEDBACK_NOT_REUSED_REASON_NOT_ACCESSIBLE = 7;
        public const int FEEDBACK_NOT_REUSED_REASON_DUPLICATE = 8;
        #endregion

        //Engagement Created By
        public const string CREATEDBY_ME = "Created By Me";
        public const string CREATEDBY_OTHERS = "Created By Others";

        //Organization Unit Display name -- Code Commented Because Business Area fetching from Appsettings.       

        public static readonly int?[] NOT_ALLOWED_ASSET_SAVING_METHOD = new int?[] { 0, 6 };
        public static readonly int[] OPPORTUNITY_ALLOWED_STAGES = new int[] { 1, 2, 3, 4 };
        public static readonly int[] OPPORTUNITY_NOT_ALLOWED_STAGES_FOR_ENGAGEMENT = new int[] { 6, 7, 8 };
        public static readonly int[] CORE3_SEND_NOTIFICATION_ALLOWED_STAGES = new int[] { 3, 4 };
        public static readonly int[] ALLOWED_ASSET_STATUS = new int[] { 0, 1, 3 }; //PENDING_APPROVAL, APPROVED, UNPUBLISHED(ToWork)
        public static readonly List<string> FASOPENSTATUS = new List<string>() { "Assigned", "Accepted and Released", "Technically Closed" };
        public static readonly List<string> ALLOWED_FAS_STATUS_IN_EBC1 = new List<string>() { "Assigned", "Accepted and Released" };
        public static readonly List<string> FAS_STATUS_CLOSED = new List<string> { "FAS Cancelled", "FAS Closed", "FAS Deleted" };
        public static readonly List<string> FAS_STATUS = new List<string> { "Assigned", "Accepted and Released", "Technically Closed", "Created", "FAS Sent to LM" };

        #region Cache Keys
        public const string CacheFilterGraph = "FilterGraph";
        public const string CacheProductTree = "ProductTree";
        public const string CacheAllProducts = "AllProducts";
        public const string CachePortfolioProducts = "PortfolioProducts";
        public const string CacheFramework = "Framework";
        public const string CacheAssetTypeGroup = "AssetTypeGroupList";
        public const string CacheAutomationType = "AutomationTypeList";
        public const string CacheTermLanguageData = "TermLanguageData";
        public const string CacheAppSettingsData = "AppSettingsData";
        public const string CacheCuratorOwnerList = "CuratorOwnerList";
        public const string CacheAssetGroupOwnerList = "AssetGroupOwnerList";
        public const string CacheCuratorApproverList = "CuratorApproverList";
        public const string CacheAreaApproverList = "AreaApproverList";
        public const string CacheAdministratorList = "AdministratorList";
        public const string CacheLibrarianList = "LibrarianList";
        public const string CacheProjectManagerList = "ProjectManagerList";
        public const string CachePilotList = "PilotList";
        public const string CacheAnalyticsList = "AnalyticsList";
        public const string CachePortfolioActiveLanguageList = "PortfolioActiveLanguageList";
        public const string CachePortfolioAllLanguageList = "PortfolioAllLanguageList";
        public const string CachePortfolioFrameworkList = "PortfolioFrameworkList";
        public const string CachePortfolioRoleList = "PortfolioRoleList";
        public const string CachePortfolioKAList = "PortfolioKAList";
        public const string CachePortfolioEPList = "PortfolioEPList";
        public const string CachePortfolioEPGroupList = "PortfolioEPGroupList";
        public const string CachePortfolioAssetStatusList = "PortfolioAssetStatusList";
        public const string CachePortfolioSourceList = "PortfolioSourceList";
        public const string CachePortfolioAFTList = "PortfolioAFTList";
        public const string Cache_EP_With_EPGroup = "EP_With_EPGroup";
        public const string CacheSolutionAreaList = "CacheSolutionAreaList ";
        public const string CacheOwnership = "Ownership";
        public const string CacheMarketArea = "marketarea";
        public const string CacheAssetType = "AssetTypeList";
        #endregion

        //UnmanagedError
        public const string UNMANAGEDERROR = "Elastic/Index Error";
        public const string ELASTICAUTHFAILEDERROR = "Elastic Search Authentication Error";
        public const string INDEX_OUT_OF_BOUND = "ERR_EBC_095: Imported file columns are not matched with Template file. Please verify and try again";

        //Rosetta API Constants
        public const string ROSETTA_MANDATORY_FIELD_MISSING = "'{0}' not provided. '{0}' is mandatory to register asset in Navigator365.";
        public const string ROSETTA_INVALID_VALUE = "Invalid '{0}' provided for the asset.";

        public const string ASSET_GROUP_AUDIT_PARAMETER_OWNER = "OWNER";

        public const string ASSET_CATEGORY_SA = "01-Managed Contextualized Assets by Solution Area";
        public const string ASSET_CATEGORY_MA = "02-Managed Contextualized Assets by Market Area";
        public const string ASSET_CATEGORY_UNMANAGED = "03-Unmanaged Contextualized Assets";


        public const string DUPLICATE_ASSET_CATEGORY_SA = "Managed Contextualized Assets by Solution Area";
        public const string DUPLICATE_ASSET_CATEGORY_MA = "Managed Contextualized Assets by Market Area";
        public const string DUPLICATE_ASSET_CATEGORY_UNMANAGED = "Unmanaged Contextualized Assets";
        public const string UNMANAGED_ASSET_QUALIFY_DOWNLOAD_THRESHOLD = "Unmanaged_Asset_Qualify_Download_Threshold";
        public const string ASSET_CLUSTER_CUTOFF_SUPPORT_LEVEL = "ASSET_CLUSTER_CUTOFF_SUPPORT_LEVEL";
        public const string NOTIFY_CORE3_CUTOFF_PROBABILITY = "NOTIFY_CORE3_CUTOFF_PROBABILITY";

        #region Constants for Email Notifications
        // ------------------------- Practitioner -----------------------
        public const string P_SUBSCRIBED_TO_DOWNLOADED_ASSET = "P SUBSCRIBED DOWNLOADED ASSET";
        public const string P_SUBSCRIBED_TO_SAVED_SEARCH_ASSET = "P SUBSCRIBED SAVEDSEARCH ASSET";
        public const string P_ASSET_PROPOSED = "P ASSET PROPOSED";
        public const string P_ASSET_APPROVED = "P ASSET ACCEPTED";
        public const string P_ASSET_REJECTED = "P ASSET REJECTED";
        public const string P_REMINDER1_TO_PROVIDE_FEEDBACK = "P REMINDER1 TO PROVIDE FEEDBACK";
        public const string P_REMINDER2_TO_PROVIDE_FEEDBACK = "P REMINDER2 TO PROVIDE FEEDBACK";
        public const string P_PRIME_MEMBERSHIP_ACTIVATION = "P PRIME MEMBERSHIP ACTIVATION";
        public const string P_PRIME_MEMBERSHIP_RENEWAL = "P PRIME MEMBERSHIP RENEWAL";
        public const string P_PRIME_MEMBERSHIP_DEACTIVATION = "P PRIME MEMBERSHIP DEACTIVATION";
        public const string P_FEEDBACK_STATUS_CHANGED = "P FEEDBACK STATUS CHANGED";
        public const string P_BOOKMARK_SHARED = "P BOOKMARK SHARED";
        public const string P_SUSBCRIBED_EMAIL = "P SUSBCRIBED EMAIL";
        public const string P_AUTO_RETIRE_UNUSED_ASSET = "P AUTO RETIRE UNUSED ASSET";
        public const string P_AUTO_RETIRE_ON_PRODUCT_RETIRE_ASSET = "P AUTO RETIRE ON PRODUCT RETIRE ASSET";
        public const string P_ESCALATION_FOR_PROPOSED_ASSET_APPROVAL = "P ESCALATION FOR PROPOSED ASSET APPROVAL";
        public const string P_APPROVED_ASSET_UPDATED = "P APPROVED ASSET UPDATED";
        public const string P_BOOKMARK_ASSETLIST_CHANGED = "P BOOKMARK ASSET LIST CHANGED";
        public const string P_EBC_BOOKMARK_ASSETLIST_CHANGED = "P EBC BOOKMARK ASSET LIST CHANGED";
        public const string P_EBC_CONTRIBUTOR_ADDED = "P EBC CONTRIBUTOR ADDED";
        public const string P_EBC_ASSET_RETIRED = "P EBC ASSET RETIRED";
        public const string P_NOTIFY_ENG_OWNER_BLANK_EBC = "P NOTIFY ENG OWNER BLANK EBC";
        public const string P_HANDOVER_EBC_ON_CLOSED_OPPORTUNITY = "HANDOVER EBC ON CLOSED OPPORTUNITY";
        public const string P_STEP_CHNAGED_EBC2_TO_HANDOVER = "ENGAGEMENT IS HANDED OVER TO DELIVERY";



        // ------------------------- Core3 -----------------------
        public const string C3_ENGAGEMENT_FAIL_NOTIFICATION = "C3 ENGAGEMENT FAIL NOTIFICATION";

        // ------------------------- SA MA -----------------------
        public const string SAMA_ENGAGEMENT_FAIL_NOTIFICATION = "SAMA ENGAGEMENT FAIL NOTIFICATION";
        public const string MA_NOTIFY_ENG_OWNER_BLANK_EBC = "MA NOTIFY ENG OWNER BLANK EBC";

        //------------------------ Curator Owner ----------------------
        public const string CO_PROPOSED_ASSET_APPROVAL_REMINDER1 = "CO PROPOSED ASSET APPROVAL REMINDER1";
        public const string CO_PROPOSED_ASSET_APPROVAL_REMINDER2 = "CO PROPOSED ASSET APPROVAL REMINDER2";
        public const string CO_ESCALATION_FOR_PROPOSED_ASSET_APPROVAL = "CO ESCALATION FOR PROPOSED ASSET APPROVAL";
        public const string CO_PROPOSED_ASSET_ACCEPTED = "CO PROPOSED ASSET ACCEPTED";
        public const string CO_ASSET_APPROVED = "CO ASSET APPROVED";
        public const string CO_ASSET_AGED = "CO ASSET AGED";
        public const string CO_FEEDBACK_RECEIVED_ON_ASSET = "CO FEEDBACK RECEIVED ON ASSET";
        public const string CO_ASSET_REJECTED = "CO ASSET REJECTED";
        public const string CO_ASSET_FEEDBACK_REJECTED = "CO FEEDBACK REJECTED";
        public const string CO_BULK_IMPORT_OUTPUT = "CO BULK IMPORT OUTPUT";
        public const string CO_OWNERSHIP_CHANGE = "CO OWNERSHIP CHANGE";
        public const string CO_ASSET_RETIRED = "CO ASSET RETIRED";
        public const string CO_ASSET_APPROVAL_REQUIRED = "CO ASSET APPROVAL REQUIRED";
        public const string CO_ASSET_PROPOSED = "CO ASSET PROPOSED";
        public const string CO_PLANNED_ASSET_OVERDUE = "CO PLANNED ASSET OVERDUE";
        public const string CO_AUTO_RETIRE_UNUSED_ASSET = "CO AUTO RETIRE UNUSED ASSET";
        public const string CO_AUTO_RETIRE_ON_PRODUCT_RETIRE_ASSET = "CO AUTO RETIRE ON PRODUCT RETIRE ASSET";
        public const string CO_AUTO_REJECT_ON_PROPOSED_ASSET = "CO AUTO REJECT ON PROPOSED ASSET";
        public const string CO_MONTHLY_EMAIL_For_ABC = "CO MONTHLY EMAIL For ABC";

        //----------------------- Curator Approver ----------------
        public const string CA_ASSET_APPROVAL_REQUIRED = "CA ASSET APPROVAL REQUIRED";
        public const string CA_ASSET_APPROVED = "CA ASSET APPROVED";
        public const string CA_ASSET_RETIRED = "CA ASSET RETIRED";
        public const string CA_PLANNED_ASSET_OVERDUE = "CA PLANNED ASSET OVERDUE";
        public const string CA_AUTO_RETIRE_UNUSED_ASSET = "CA AUTO RETIRE UNUSED ASSET";
        public const string CA_AUTO_RETIRE_ON_PRODUCT_RETIRE_ASSET = "CA AUTO RETIRE ON PRODUCT RETIRE ASSET";
        public const string CA_ESCALATION_FOR_ASSET_APPROVAL = "CA ESCALATION FOR ASSET APPROVAL";
        public const string CA_NEW_MA_ASSET_EMAIL_PROD_SA_LIB = "CA NEW MA ASSET EMAIL PROD SA LIB";

        //---------------------------- Librarian -----------------------
        public const string L_ESCALATION_FOR_ASSET_APPROVAL = "L ESCALATION FOR ASSET APPROVAL";
        public const string L_ESCALATION_FOR_PROPOSED_ASSET_APPROVAL = "L ESCALATION FOR PROPOSED ASSET APPROVAL";
        public const string L_ESCALATION_FOR_AGED_ASSET = "L ESCALATION FOR AGED ASSET";
        public const string L_ASSET_RETIRED = "L ASSET RETIRED";
        public const string L_ASSET_APPROVAL_REQUIRED = "L ASSET APPROVAL REQUIRED";
        public const string L_ASSET_APPROVED = "L ASSET APPROVED";
        public const string L_ESCALATION_OUTSTANDING_SLA_NOTIFICATION = "L ESCALATION OUTSTANDING SLA NOTIFICATION";
        public const string L_PLANNED_ASSET_OVERDUE = "L PLANNED ASSET OVERDUE";
        public const string L_AUTO_RETIRE_UNUSED_ASSET = "L AUTO RETIRE UNUSED ASSET";
        public const string L_AUTO_RETIRE_ON_PRODUCT_RETIRE_ASSET = "L AUTO RETIRE ON PRODUCT RETIRE ASSET";
        public const string L_ENGAGEMENT_FAIL_NOTIFICATION = "L ENGAGEMENT FAIL NOTIFICATION";

        //------------------------- Area Approver --------------------
        public const string AA_ASSET_RETIRED = "AA ASSET RETIRED";
        public const string AA_ASSET_APPROVED = "AA ASSET APPROVED";
        public const string AA_PLANNED_ASSET_OVERDUE = "AA PLANNED ASSET OVERDUE";
        public const string AA_AUTO_RETIRE_UNUSED_ASSET = "AA AUTO RETIRE UNUSED ASSET";
        public const string AA_AUTO_RETIRE_ON_PRODUCT_RETIRE_ASSET = "AA AUTO RETIRE ON PRODUCT RETIRE ASSET";
        public const string AA_PROPOSED_ASSET_APPROVAL_REMINDER2 = "AA PROPOSED ASSET APPROVAL REMINDER2";
        public const string AA_ESCALATION_FOR_PROPOSED_ASSET_APPROVAL = "AA ESCALATION FOR PROPOSED ASSET APPROVAL";
        public const string AA_ASSET_APPROVAL_REQUIRED = "AA ASSET APPROVAL REQUIRED";
        public const string AA_ESCALATION_FOR_ASSET_APPROVAL = "AA ESCALATION FOR ASSET APPROVAL";
        public const string AA_NEW_MA_ASSET_EMAIL_PROD_SA_LIB = "AA NEW MA ASSET EMAIL PROD SA LIB";
        public const string AA_NOTIFY_ENG_OWNER_AGED_OPPORTUNITY = "AA NOTIFY ENG OWNER AGED OPPORTUNITY";

        //------------------------- Business Owner --------------------
        public const string BO_FEEDBACK_STATUS_CHANGED = "BO FEEDBACK STATUS CHANGED";
        public const string BO_REMINDER1_OUTSTANDING_SLA_NOTIFICATION = "BO REMINDER1 OUTSTANDING SLA NOTIFICATION";
        public const string BO_REMINDER2_OUTSTANDING_SLA_NOTIFICATION = "BO REMINDER2 OUTSTANDING SLA NOTIFICATION";
        public const string BO_NOTIFY_FAS_CPM_ON_FEEDBACK = "BO NOTIFY FAS CPM ON FEEDBACK";
        public const string BO_ENG_CREATED = "BO ENG CREATED";
        public const string BO_NOTIFY_ENG_OWNER_AGED_OPPORTUNITY = "BO NOTIFY ENG OWNER AGED OPPORTUNITY";
        public const string BO_REMINDER_TO_CPM_FOR_ASSET_USAGE = "BO REMINDER TO CPM FOR ASSET USAGE";
        public const string BO_MANAGE_ENGAGEMENT_NOTIFICATION = "BO MANAGE ENGAGEMENT NOTIFICATION";
        public const string BO_EBC_VERSION_UPDATE = "BO EBC VERSION UPDATE";


        //------------------------- Asset Status --------------------
        public const string ASSET_STATUS_PLANNED = "Planned";
        public const string ASSET_STATUS_AVAILABLE = "Available";
        #endregion

        #region -- Engagement settings constant --

        public const int OPPORTUNITY = 1;
        public const int FAS = 2;
        public const int ENGAGEMENT = 3;
        public const string RESONSEMESSAGE = "Setting already exists in the system.";
        public const string TOGGLERESPONSE = "No setting exist in the system.";
        #endregion

        #region Practitioner Dashboard Constants
        public const string PRAC_DASHBOARD_EXPORT_MAIN_WORKSHEET = "Main";
        public const string PRAC_DASHBOARD_EXPORT_DASHBOARD_WORKSHEET = "Dashboard";
        public const string PRAC_DASHBOARD_EXPORT_LOGIN_WORKSHEET = "Login";
        public const string PRAC_DASHBOARD_EXPORT_SEARCH_WORKSHEET = "Search";
        public const string PRAC_DASHBOARD_EXPORT_DOWNLOAD_WORKSHEET = "Download";
        public const string PRAC_DASHBOARD_EXPORT_FEEDBACK_WORKSHEET = "Feedback";
        public const string PRAC_DASHBOARD_EXPORT_REUSE_WORKSHEET = "Reuse";
        public const string PRAC_DASHBOARD_EXPORT_SAVING_WORKSHEET = "Saving";
        public const string PRAC_DASHBOARD_EXPORT_PENDING_FEEDBACK_WORKSHEET = "Pending_Feedback";
        public const string PRAC_DASHBOARD_EXPORT_OVERDUE_FEEDBACK_WORKSHEET = "Overdue_Feedback";
        public const string PRAC_DASHBOARD_EXPORT_PROPOSALS_WORKSHEET = "Proposal";
        public const string PRAC_DASHBOARD_EXPORT_ACCEPTED_PROPOSALS_WORKSHEET = "Accepted_Proposal";

        public const int PRAC_DASHBOARD_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int PRAC_DASHBOARD_EXPORT_NAME_FIELD_CELL_COLUMN = 6;
        public const int PRAC_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_ROW = 12;
        public const int PRAC_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_COLUMN = 6;
        public const int PRAC_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_ROW = 13;
        public const int PRAC_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_COLUMN = 6;
        public const int PRAC_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_ROW = 14;
        public const int PRAC_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_COLUMN = 6;

        public const int PRAC_DASHBOARD_EXPORT_DOWNLOAD_COUNT_CELL_ROW = 10;
        public const int PRAC_DASHBOARD_EXPORT_DOWNLOAD_COUNT_CELL_COLUMN = 2;
        public const int PRAC_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int PRAC_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_COLUMN = 4;
        public const int PRAC_DASHBOARD_EXPORT_REUSE_COUNT_CELL_ROW = 10;
        public const int PRAC_DASHBOARD_EXPORT_REUSE_COUNT_CELL_COLUMN = 6;
        public const int PRAC_DASHBOARD_EXPORT_SAVING_COUNT_CELL_ROW = 10;
        public const int PRAC_DASHBOARD_EXPORT_SAVING_COUNT_CELL_COLUMN = 8;
        public const int PRAC_DASHBOARD_EXPORT_PENDING_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int PRAC_DASHBOARD_EXPORT_PENDING_FEEDBACK_COUNT_CELL_COLUMN = 10;
        public const int PRAC_DASHBOARD_EXPORT_OVERDUE_FEEDBACK_COUNT_CELL_ROW = 16;
        public const int PRAC_DASHBOARD_EXPORT_OVERDUE_FEEDBACK_COUNT_CELL_COLUMN = 2;
        public const int PRAC_DASHBOARD_EXPORT_PROPOSALS_COUNT_CELL_ROW = 16;
        public const int PRAC_DASHBOARD_EXPORT_PROPOSALS_COUNT_CELL_COLUMN = 4;
        public const int PRAC_DASHBOARD_EXPORT_ACCEPTED_PROPOSALS_COUNT_CELL_ROW = 16;
        public const int PRAC_DASHBOARD_EXPORT_ACCEPTED_PROPOSALS_COUNT_CELL_COLUMN = 6;
        public const int PRAC_DASHBOARD_EXPORT_LOGIN_COUNT_CELL_ROW = 16;
        public const int PRAC_DASHBOARD_EXPORT_LOGIN_COUNT_CELL_COLUMN = 8;
        public const int PRAC_DASHBOARD_EXPORT_SEARCH_COUNT_CELL_ROW = 16;
        public const int PRAC_DASHBOARD_EXPORT_SEARCH_COUNT_CELL_COLUMN = 10;

        #endregion

        #region Project Manager Dashboard Constants

        public const string PM_DASHBOARD_MENU_PERMISSION_NAME = "ProjectManagerDashboard";
        public const string ENGAGEMENT_OPP_OWNER_PERMISSION_NAME = "EngagementOpportunityOwner";
        public const string ENGAGEMENT_PROJECT_OWNER_PERMISSION_NAME = "EngagementProjectOwner";
        public const string ENGAGEMENT_MENU_PERMISSION_NAME = "EngagementView";
        public const string ENGAGEMENT_BUSINESS_CASE_MENU_PERMISSION_NAME = "EngagementBusinessCaseView";
        public const string ENGAGEMENT_BUSINESS_CASE_CONTRIBUTOR = "EngagementBusinessCaseContributor";
        public const string ENGAGEMENT_PROJECT_OWNER_PERMISSION_FOR_SUPPORTINGCPM = "EngagementProjectOwnerForSupportingCPM";
        public const string ENGAGEMENT_PERMISSION_FOR_SUPPORTINGCPM = "EngagementRoleForSupportingCPM";
        public const string ENGAGEMENT_PERMISSION_FOR_LEADSA = "EngagementRoleForLeadSA";
        public const string EBC_PENDING_HANDOVER_REPORT_PERMISSION_NAME = "EBCReport";
        public const string EBC_SELECTED_REPORT_PERMISSION_NAME = "EBCAuditingReport";
        public const string EBC_AUTOMATION_API = "EBCAutomationReport";
        public const string EBC_CU_SPOC_PERMISSION_NAME = "EBCCUSpocMapping";
        public const string PM_DASHBOARD_BID_CORETEAM_PERMISSION = "EngagementBidCoreTeamPermisssion";
        public const string MASKED_FAS_IDNAME = "NDAConfiguration";
        public const string ALL_ABOUT_FAS = "allAboutFAS";
        public const string PoPLite = "PoPLite";
        public const string PM_DASHBOARD_NonPrimary_CORETEAM_PERMISSION = "EngagementNonPrimaryCoreTeamPermisssion";

        public const string PM_DASHBOARD_EXPORT_MAIN_WORKSHEET = "Main";
        public const string PM_DASHBOARD_EXPORT_DASHBOARD_WORKSHEET = "Dashboard";
        public const string PM_DASHBOARD_EXPORT_PROJECT_WORKSHEET = "Project";
        public const string PM_DASHBOARD_EXPORT_ENGAGEMENT_WORKSHEET = "Engagement";
        public const string PM_DASHBOARD_EXPORT_FEEDBAK_WORKSHEET = "Feedback";
        public const string PM_DASHBOARD_EXPORT_SAVING_WORKSHEET = "Saving";
        public const string PM_DASHBOARD_EXPORT_OPPORTUNITY_WORKSHEET = "Opportunity";
        public const string PM_DASHBOARD_EXPORT_EXCEPTIONAL_FEEDBACK_WORKSHEET = "ExceptionalFeedback";
        public const string EBC_PLANNED_ASSET_VIEW = "EBCPlannedAssetView";

        public const int PM_DASHBOARD_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int PM_DASHBOARD_EXPORT_NAME_FIELD_CELL_COLUMN = 6;
        public const int PM_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_ROW = 12;
        public const int PM_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_COLUMN = 6;
        public const int PM_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_ROW = 13;
        public const int PM_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_COLUMN = 6;
        public const int PM_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_ROW = 14;
        public const int PM_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_COLUMN = 6;

        public const int PM_DASHBOARD_EXPORT_PROJECT_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_PROJECT_COUNT_CELL_COLUMN = 2;
        public const int PM_DASHBOARD_EXPORT_OPPPORTUNITY_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_OPPPORTUNITY_COUNT_CELL_COLUMN = 4;
        public const int PM_DASHBOARD_EXPORT_ENGAGEMENT_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_ENGAGEMENT_COUNT_CELL_COLUMN = 6;
        public const int PM_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_COLUMN = 8;
        public const int PM_DASHBOARD_EXPORT_SAVING_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_SAVING_COUNT_CELL_COLUMN = 10;
        public const int PM_DASHBOARD_EXPORT_EXCEPTIONAL_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int PM_DASHBOARD_EXPORT_EXCEPTIONAL_FEEDBACK_COUNT_CELL_COLUMN = 12;


        public const int SAMA_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int SAMA_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_COLUMN = 2;
        public const int SAMA_DASHBOARD_EXCEPTIONAL_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int SAMA_DASHBOARD_EXPORT_EXCEPTIONAL_FEEDBACK_COUNT_CELL_COLUMN = 4;
        public const int SAMA_DASHBOARD_PROPOSED_COUNT_CELL_ROW = 10;
        public const int SAMA_DASHBOARD_PROPOSED_COUNT_CELL_COLUMN = 6;
        public const int SAMA_DASHBOARD_TOAPPROVE_COUNT_CELL_ROW = 10;
        public const int SAMA_DASHBOARD_TOAPPROVE_COUNT_CELL_COLUMN = 8;
        public const int SAMA_DASHBOARD_AGEDASSET_COUNT_CELL_ROW = 10;
        public const int SAMA_DASHBOARD_AGEDASSET_COUNT_CELL_COLUMN = 10;


        public const int PM_DASHBOARD_MAIN_DASHBOARD_DESC_ROW = 17;
        public const int PM_DASHBOARD_MAIN_PROJECT_DESC_ROW = 18;
        public const int PM_DASHBOARD_MAIN_OPPPORTUNITY_DESC_ROW = 19;
        public const int PM_DASHBOARD_MAIN_ENGAGEMENT_DESC_ROW = 20;
        public const int PM_DASHBOARD_MAIN_FEEDBACK_DESC_ROW = 21;
        public const int PM_DASHBOARD_MAIN_SAVING_DESC_ROW = 22;
        public const int PM_DASHBOARD_MAIN_EXCEPTIONAL_FEEDBACK_DESC_ROW = 23;


        public const int EXCEPTIONALFEEDBACK_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int EXCEPTIONALFEEDBACK_EXPORT_NAME_FIELD_CELL_COLUMN = 6;
        public const int EXCEPTIONALFEEDBACK_EXPORT_REPORT_DATE_FIELD_CELL_ROW = 12;
        public const int EXCEPTIONALFEEDBACK_EXPORT_REPORT_DATE_FIELD_CELL_COLUMN = 6;
        public const int EXCEPTIONALFEEDBACK_EXPORT_START_DATE_FIELD_CELL_ROW = 13;
        public const int EXCEPTIONALFEEDBACK_EXPORT_START_DATE_FIELD_CELL_COLUMN = 6;
        public const int EXCEPTIONALFEEDBACK_EXPORT_END_DATE_FIELD_CELL_ROW = 14;
        public const int EXCEPTIONALFEEDBACK_EXPORT_END_DATE_FIELD_CELL_COLUMN = 6;
        #endregion

        #region -- Planned Asset Roadmap Sheetname Constant

        public const string PLANNED_ASSET_EXPORT_FILENAME = "PlannedAssetFileName";
        public const string PLANNED_ASSET_EXPORT_MAIN_WORKSHEET = "PlannedAssetMainSheetName";
        public const string PLANNED_ASSET_EXPORT_ROADMAP_WORKSHEET = "PlannedAssetRoadMapSheetName";
        public const string PLANNED_ASSET_EXPORT_ASSETDETAILS_WORKSHEET = "PlannedAssetDetailSheetName";
        public const string PLANNED_ASSET_EXPORT_ASSETHISTORY_WORKSHEET = "PlannedAssetHistorySheetName";

        public const int PLANNED_ASSET_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int PLANNED_ASSET_EXPORT_NAME_FIELD_CELL_COLOUMN = 6;
        public const int PLANNED_ASSET_EXPORT_GENERATEDON_FIELD_CELL_ROW = 12;
        public const int PLANNED_ASSET_EXPORT_GENERATEDON_FIELD_CELL_COLOUMN = 6;
        public const int PLANNED_ASSET_EXPORT_REPORTPERIODSTARTDATE_FIELD_CELL_ROW = 13;
        public const int PLANNED_ASSET_EXPORT_REPORTPERIODSTARTDATE_FIELD_CELL_COLOUMN = 6;
        public const int PLANNED_ASSET_EXPORT_REPORTPERIODENDDATE_FIELD_CELL_ROW = 14;
        public const int PLANNED_ASSET_EXPORT_REPORTPERIODENDDATE_FIELD_CELL_COLOUMN = 6;
        public const int PLANNED_ASSET_EXPORT_LAYOUT_FIELD_CELL_ROW = 15;
        public const int PLANNED_ASSET_EXPORT_LAYOUT_FIELD_CELL_COLOUMN = 6;
        public const int PLANNED_ASSET_EXPORT_COLORCODE_FIELD_CELL_ROW = 16;
        public const int PLANNED_ASSET_EXPORT_COLORCODE_FIELD_CELL_COLOUMN = 6;


        public const int PLANNED_ASSET_EXPORT_NotAvailable_NoOverDue_ROW = 19;
        public const int PLANNED_ASSET_EXPORT_NotAvailable_NoOverDue_COLUMN = 5;
        public const int PLANNED_ASSET_EXPORT_NotAvailable_NoOverDue_LABEL_COLUMN = 6;
        public const int PLANNED_ASSET_EXPORT_Available_NoOverDue_ROW = 20;
        public const int PLANNED_ASSET_EXPORT_Available_NoOverDue_COLUMN = 5;
        public const int PLANNED_ASSET_EXPORT_Available_NoOverDue_LABEL_COLUMN = 6;
        public const int PLANNED_ASSET_EXPORT_Available_OverDue_ROW = 21;
        public const int PLANNED_ASSET_EXPORT_Available_OverDue_COLUMN = 5;
        public const int PLANNED_ASSET_EXPORT_Available_OverDue_LABLE_COLUMN = 6;
        public const int PLANNED_ASSET_EXPORT_NotAvailable_OverDue_ROW = 22;
        public const int PLANNED_ASSET_EXPORT_NotAvailable_OverDue_COLUMN = 5;
        public const int PLANNED_ASSET_EXPORT_NotAvailable_OverDue_LABEL_COLUMN = 6;
        public const int PLANNED_ASSET_EXPORT_COLORCODE_ROW_DELETE = 16;
        public const int PLANNED_ASSET_EXPORT_PLANNEDASSETHISTORY_ROW_DELETE = 27;


        public const int PLANNED_ASSET_VIEW_EXPORT_STARTINDEX_ROW = 2;
        public const int PLANNED_ASSET_DETAIL_EXPORT_STARTINDEX_ROW = 2;

        public const int PLANNED_ASSET_DETAIL_EXPORT_ASSETID_COLUMN = 1;
        public const int PLANNED_ASSET_DETAIL_EXPORT_ASSET_NAME_COLUMN = 2;
        public const int PLANNED_ASSET_DETAIL_EXPORT_STATUS_COLUMN = 3;
        public const int PLANNED_ASSET_DETAIL_EXPORT_DATE_COLUMN = 4;
        public const int PLANNED_ASSET_DETAIL_EXPORT_AVAILABILITY_COLUMN = 5;
        public const int PLANNED_ASSET_DETAIL_EXPORT_PRODUCT_COLUMN = 6;
        public const int PLANNED_ASSET_DETAIL_EXPORT_PRODUCT_STATUS_COLUMN = 7;
        public const int PLANNED_ASSET_DETAIL_EXPORT_OWNERSHIP_COLUMN = 8;
        public const int PLANNED_ASSET_DETAIL_EXPORT_SOURCE_COLUMN = 9;
        public const int PLANNED_ASSET_DETAIL_EXPORT_FRAMEWORK_COLUMN = 10;
        public const int PLANNED_ASSET_DETAIL_EXPORT_ROLE_COLUMN = 11;
        public const int PLANNED_ASSET_DETAIL_EXPORT_KNOWLEDGE_AREA_COLUMN = 12;
        public const int PLANNED_ASSET_DETAIL_EXPORT_ENGAGEMENT_PHASE_COLUMN = 13;
        public const int PLANNED_ASSET_DETAIL_EXPORT_LANGUAGE_COLUMN = 14;
        public const int PLANNED_ASSET_DETAIL_EXPORT_OWNER_COLUMN = 15;
        public const int PLANNED_ASSET_DETAIL_EXPORT_APPROVER_COLUMN = 16;
        public const int PLANNED_ASSET_DETAIL_EXPORT_ASSETTYPES_COLUMN = 17;
        public const int PLANNED_ASSET_DETAIL_EXPORT_EEPP_COLUMN = 18;
        public const int PLANNED_ASSET_DETAIL_EXPORT_EETR_COLUMN = 19;
        public const int PLANNED_ASSET_DETAIL_EXPORT_PSPR_COLUMN = 20;

        public const int PLANNED_ASSET_HISTORY_EXPORT_STARTINDEX_ROW = 2;
        public const int PLANNED_ASSET_HISTORY_EXPORT_ASSETID_COLUMN = 1;
        public const int PLANNED_ASSET_HISTORY_EXPORT_ASSET_NAME_COLUMN = 2;
        public const int PLANNED_ASSET_HISTORY_EXPORT_ASSETAVAILABLE_COLUMN = 3;
        public const int PLANNED_ASSET_HISTORY_EXPORT_NEWSTATUSDATE_COLUMN = 4;
        public const int PLANNED_ASSET_HISTORY_EXPORT_OLDSTATUSDATE_COLUMN = 5;
        public const int PLANNED_ASSET_HISTORY_EXPORT_SIGNUM_COLUMN = 6;
        public const int PLANNED_ASSET_HISTORY_EXPORT_UPDATEDDATE_COLUMN = 7;

        public const string PLANNED_ASSET_GROUPVIEW = "Group View";
        public const string PLANNED_ASSET_ASSETVIEW = "Asset View";
        public const string PLANNED_ASSET_FIRSTPLANNEDDATE = "First Planned Date";
        public const string PLANNED_ASSET_LASTPLANNEDDATE = "Last Planned Date";
        public const string PLANNED_ASSET_STATUS_AVAILABLE = "Available";
        public const string PLANNED_ASSET_STATUS_PLANNED = "Planned";
        public const string PLANNED_ASSET_NOTGROUPED_PLANNED = "Not Grouped";

        #endregion

        #region -- Color Settings Name Constant --

        public const string ASSET_PLANNED_NOTAVAILABLE_NOOVERDUE_OTHERS = "ASSET_PLANNED_NOTAVAILABLE_NOOVERDUE_OTHERS";
        public const string ASSET_PLANNED_AVAILABLE_OVERDUE_OTHERS = "ASSET_PLANNED_AVAILABLE_OVERDUE_OTHERS";
        public const string ASSET_PLANNED_AVAILABLE_NOOVERDUE_OTHERS = "ASSET_PLANNED_AVAILABLE_NOOVERDUE_OTHERS";
        public const string ASSET_PLANNED_NOTAVAILABLE_OVERDUE_OTHERS = "ASSET_PLANNED_NOTAVAILABLE_OVERDUE_OTHERS";
        public const string ASSET_COMMON_CODING_PRACTITIONER = "ASSET_COMMON_CODING_PRACTITIONER";

        public const string ASSET_PLANNED_NOTAVAILABLE_NOOVERDUE_PRACTITIONER = "ASSET_PLANNED_NOTAVAILABLE_NOOVERDUE_PRACTITIONER";
        public const string ASSET_PLANNED_NOTAVAILABLE_OVERDUE_PRACTITIONER = "ASSET_PLANNED_NOTAVAILABLE_OVERDUE_PRACTITIONER";
        public const string ASSET_PLANNED_AVAILABLE_OVERDUE_PRACTITIONER = "ASSET_PLANNED_AVAILABLE_OVERDUE_PRACTITIONER";
        public const string ASSET_PLANNED_AVAILABLE_NOOVERDUE_PRACTITIONER = "ASSET_PLANNED_AVAILABLE_NOOVERDUE_PRACTITIONER";

        #endregion

        #region -- Librarian Dashboard --

        public const string LIBRARIANDASHBOARD = "LibrarianDashboard";
        public const string SAMA_LIBRARIANDASHBOARD_PROPOSED_SHEET = "ProposedAsset";
        public const string SAMA_LIBRARIANDASHBOARD_TOAPPROVE_SHEET = "PendingApprovalAssets";
        public const string SAMA_LIBRARIANDASHBOARD_AGEDASSET_SHEET = "AgedAssets";
        public const string EBC_CU_SPOC_DASHBOARD = "EBCCUSpocDashboard";
        #endregion

        #region -- Prime user --
        public const string PRIMEUSER_EXPORT_MAIN_WORKSHEET = "Main";
        public const string PRIMEUSER_EXPORT_HALLOFFAME_WORKSHEET = "ListOfPrimeMembers";
        public const string PRIMEUSER_EXPORT_FROM_HALLOFFAME = "HallOfFame";

        //Main Column const.
        public const int PRIMEUSER_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int PRIMEUSER_EXPORT_NAME_FIELD_CELL_COLUMN = 6;
        public const int PRIMEUSER_EXPORT_REPORT_DATE_FIELD_CELL_ROW = 12;
        public const int PRIMEUSER_EXPORT_REPORT_DATE_FIELD_CELL_COLUMN = 6;
        #endregion


        public const string JOB_BIDOFFICEJOB = "BidOfficeJob";
        public const string JOB_GETSavingFromQMT = "SavingFromQMT";
        public const string JOB_SavingSummaryFromQMT = "NetSavingFromQMT";
        public const string JOB_OpportunityNonCoreTeam = "OpportunityNonCoreTeam";
        public const string JOB_SubmitFeedbackForAutomationAsset = "SubmitFeedbackForAutomationAsset";
        public static readonly Dictionary<string, string> FeedBackPropertyDictionary = new Dictionary<string, string>()
        {
            {"QualityRating","Rating" },{"OpportunityName","Opportunity" },{"EngagementName","Engagement" },{"FasName","FAS" },{"Comment","Comment" },{"MarketAreaName","Market Area" },{"CustomerUnitName","Customer Unit" }, {"IsDocumentUsed","Is Reused" },
              {"CustomerName","Customer" },{"ReuseCount","Iteration Reuse" }, {"ActualPercentageOfReuse", "Actual Percentage of Reuse"}, {"ExpectedEffortToProduce", "Expected Effort to Produce" }
              , {"ActualTimeToComplete", "Actual Time to Complete" }, {"StatusName", "Feedback Status"}, {"NoOfAutomationExecution", "No of Automation Execution"}
        };

        #region  Bookmark Constants
        public const string BOOKMARK_CREATED_BY_ME = "Bookmark Owned By Me";
        public const string BOOKMARK_SHARED_WITH_ME = "Bookmark Shared With Me";
        public const string BOOKMARK_SHARED_BY_LIBRARIAN = "Global Bookmark";
        public const string BOOKMARK_SHEETNAME = "Bookmark";
        public const string NESTED_BOOKMARK_SHEETNAME = "Nested Bookmark";
        public const string APPROVED_LEGEND_COLOR = "#000068";
        public const string RETIRED_LEGEND_COLOR = "#ff0000";
        public const string PENDING_LEGEND_COLOR = "#e6a000";
        public const string ERIMATCH_RESOURCE_ALLOCATION_STATUS = "Allocated";

        #endregion

        //Product Owner Mapping Report
        public const string PRODUCT_OWNER_MAPPING_REPORT_WORKSHEET = "ProductOwnerMappingSheetName";
        //Product Approver Mapping Report
        public const string PRODUCT_APPROVER_MAPPING_REPORT_WORKSHEET = "ProductApproverMappingSheetName";
        //Product Report
        public const string PRODUCT_REPORT_WORKSHEET = "ProductReportSheetName";

        public const string PRODUCT_MAIN_WORKSHEET = "Main";
        public const int PRODUCT_FIELD_CELL_ROW = 11;
        public const int PRODUCT_FIELD_CELL_COLUMN = 6;
        public const int PRODUCT_DATE_FIELD_CELL_ROW = 12;
        public const int PRODUCT_DATE_FIELD_CELL_COLUMN = 6;

        // CUSTOM Attribute Name
        public const string MATCHED_PROPERTY_ATTRIBUTE = "MatchedPropertyAttribute";

        // Feedback Saving History Actions Name
        public const string OVERWRITE_ABC_FEEDBACK_SAVING_HISTORY_DESCRIPTION = "OVERWRITE ABC";
        public const string UPDATE_EBC_FEEDBACK_SAVING_HISTORY_DESCRIPTION = "UPDATE EBC";

        //Feedback Duration Default Month
        public const int FEEDBACK_DURATION_MONTH = 6;
        public const int BLANK_EBC_DELETE_DAYS = 7;
        public const int Closed_WON_Opportunity_Stage_ID = 5;
        public const string Delete_Blank_EBC_for_Close_Won_Opportunity = "Delete_Blank_EBC_for_Close_Won_Opportunity";

        #region EngagementStates
        public const int EBC0 = 1;
        public const int EBC1 = 2;
        public const int EBC2 = 3;
        public const int EBC3 = 4;
        public const int EBC4 = 5;
        public const int EBC5 = 6;
        public static readonly int?[] PreSalesSteps = new int?[] { 1, 2, 3 };
        public static readonly int?[] DeliverySteps = new int?[] { 4, 5 };
        #endregion

        #region OpportunityStatges
        public const string CLOSED_LOST = "Closed Lost";
        public const string CLOSED_DUPLICATE = "Closed-Duplicate";
        public const string CLOSED_WITHDRAWN = "Closed-Withdrawn";

        #endregion

        #region FAS XLPMStage
        public const string TG2Approved = "TG2 Approved";
        public const string TG3ApprovedorOptOut = "TG3 Approved or Opt-Out";
        public const string TG4Approved = "TG4 Approved";
        public const string FinalHandovertoSupportApproved = "Final Handover to Support Approved";
        #endregion

        #region Engagement Origin
        public const string Engagement_Origin_OPPORTUNITY = "OPPORTUNITY";
        public const string Engagement_Origin_FAS = "FAS";
        #endregion


        #region -- Engagement CLone--

        public const string FULL_CLONE = "FC";
        public const string SELECTIVE_CLONE = "SC";

        #endregion

        #region Line Manager Dashboard

        public const string LINE_MANAGER_DASHBOARD = "LineManagerDashboard";
        public const string LINE_MANAGER_DASHBOARD_EXPORT_MAIN_WORKSHEET = "Main";
        public const string LINE_MANAGER_DASHBOARD_EXPORT_DETAILED_WORKSHEET = "Detailed";
        public const string LINE_MANAGER_DASHBOARD_EXPORT_SUMMARY_WORKSHEET = "Summary";
        public const int LINE_MANAGER_DASHBOARD_EXPORT_NAME_FIELD_CELL_ROW = 11;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_NAME_FIELD_CELL_COLUMN = 6;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_ROW = 12;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_REPORT_DATE_FIELD_CELL_COLUMN = 6;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_ROW = 13;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_START_DATE_FIELD_CELL_COLUMN = 6;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_ROW = 14;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_END_DATE_FIELD_CELL_COLUMN = 6;

        public const int LINE_MANAGER_DASHBOARD_EXPORT_LOGIN_COUNT_CELL_ROW = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_LOGIN_COUNT_CELL_COLUMN = 2;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_DOWNLOAD_COUNT_CELL_ROW = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_DOWNLOAD_COUNT_CELL_COLUMN = 4;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_ROW = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_FEEDBACK_COUNT_CELL_COLUMN = 6;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_REUSE_COUNT_CELL_ROW = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_REUSE_COUNT_CELL_COLUMN = 8;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_SAVING_COUNT_CELL_ROW = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_SAVING_COUNT_CELL_COLUMN = 10;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_OVERDUE_FEEDBACK_COUNT_CELL_ROW = 16;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_OVERDUE_FEEDBACK_COUNT_CELL_COLUMN = 2;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_PROPOSALS_COUNT_CELL_ROW = 16;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_PROPOSALS_COUNT_CELL_COLUMN = 4;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_ACCEPTED_PROPOSALS_COUNT_CELL_ROW = 16;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_ACCEPTED_PROPOSALS_COUNT_CELL_COLUMN = 6;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_PRIMEMEMBER_COUNT_CELL_ROW = 16;
        public const int LINE_MANAGER_DASHBOARD_EXPORT_PRIMEMEMBER_COUNT_CELL_COLUMN = 8;

        #endregion

        #region EBCPreProcessorMessage
        public const string ErrorOpportunutyBID = "Opportunity Number or Bid ID not provided. Opportunity Number or Bid ID is mandatory to publish asset in EBC pre-processors";
        public const string ErrorComment = "Comment is not provided. Comment is mandatory to publish asset in EBC pre-processors";
        public const string ErrorCommentLength = "EBC Processor Comment Length is greater than 1024";
        public const string ErrorAssetCommentLength = "Comment Length is greater than 1024 for Asset ID {0}";
        public const string ErrorNoAsset = "Asset is not provided. Asset is mandatory to publish asset in EBC pre-processors";
        public const string ErrorNoAssetTagFound = "Assets xml Tag is not provided. This is mandatory to publish asset in EBC pre-processors";
        public const string ErrorInvalidOpportunityNumber = "Opportunity number provided is not valid";
        public const string ErrorInvalidFASID = "Fas Id provided is not valid";
        public const string ErrorInvalidOpportunity = "Opportunity number provided does not exist or Opportunity is in closed state";
        public const string ErrorInvalidOpportunityDataType = "Opportunity number provided is not a number";
        public const string ErrorInvalidBIDDataType = "BID provided is not a number";
        public const string ErrorInvalidBID = "BID Id provided does not exist.";
        public const string ErrorInvalidAssetId = "Asset Id {0} not found in Navigator 365";
        public const string ErrorInvalidAssetIdNumber = "Asset Id provided is not a number";
        public const string ErrorInvalidProduceWithoutAssetNumber = "Produce Without Asset provided is not a number";
        public const string ErrorInvalidProduceWithAssetNumber = "Produce With Asset provided is not a number";
        public const string ErrorInvalidIerationNumber = "Iteration for asset provided is not a number";
        public const string ErrorInvalidAssetStatus = "No Pending Approval, Approved or Unpublished Asset is passed.";
        public const string ErrorInvalidZeroAssetId = "Asset Id XML Tag is not correct.";
        public const string ErrorNegativeSaving = "Expected Saving is negative for Asset-ID {0}. It is not allowed to publish asset list with negative saving. Please correct and re-publish the asset list into EBC Pre-Processor";
        public const string ErrorM6AssetSaving = "Expected Automation Executions or Automation Saving Per Execution is not valid for Asset-ID {0}. It is not allowed to publish asset list either it is Empty or entered digits are more than 6 for M6 Assets. Please correct and re-publish the asset list into EBC Pre-Processor";
        public const string ErrorExpectedAutomationSavingDigitLimitCheck = "Expected Automation Executions is not valid for Asset IDs {0}. It is not allowed to publish asset list because value of Expected Automation Executions  is more than 6 Digits. Please correct and re-publish the asset list into EBC Pre-Processor";
        public const string ErrorInvalidIterationPerReuse = "EBC Iteration per reuse is zero or negative for asset provided";
        public const string ErrorRequestFormat = "Request format is not correct";
        public const string ErrorInvalidAuthentication = "Invalid Authentication";
        public const string ErrorInvalidClientLabel = "EBC Pre-Processor with same label already exist and you are not authorized to update this record";
        public const string ErrorInvalidAssetStateMessage = "Asset ID {0} are ignore because asset is either in proposed, rejected or retired state";
        public const string ErrorInvalidRequestBody = "Invalid Request body format is passed, please correct it";
        public const string ErrorInvalidRequestFormat = "Invalid Request format is passed, Request format should be XML";
        public const string ErrorInvalidRequestXML = "There is an error in XML document";
        public const string ErrorInvalidRequestNullableObject = "Nullable object must have a value";
        public const string ErrorInvalidDeleteAssetId = "Provided Asset ID in delete asset tag should exists in assets list";
        public const string ErrorInvalidDeleteAssetIdInN365 = "Delete Asset Id {0} not found in Navigator 365";
        #endregion

        #region EstimatorUpdateAssetTagMessage
        public const string ErrorAssetId = "Asset ID not provided. Asset ID is mandatory to update asset tags";
        public const string ErrorNewTag = "New tag is not provided. New tag is mandatory to update asset tags";
        public const string ErrorNewTagLength = "New tag length should not greater than 250 character";
        public const string ErrorOldTag = "Old tag does not exist in Asset tag, to replace old tag it is nessasary Asset tag should contain old tag provided";
        public const string ErrorInvalidAssetID = "Asset Id not found in Navigator 365";
        public const string SuccessUpdateAssetTags = "Asset Tags updated for the provided Asset";
        public const string ErrorUpdateAssetTags = "Asset Tags not updated for the provided Asset";
        #endregion

        #region EBCAutoGenerateMessage
        public const string ErrorOpportunuty = "Opportunity Number not provided. Opportunity Number is mandatory to create an engagement";
        public const string SuccessEngagementAdd = "Engagement {0} created successfully along with bookmark {1} which shall be auto-synced with the assets of EBC";
        public const string ErrorDuplicateEngagement = "Engagement on Opportunity {0} already exist. Duplicate engagement on the same opportunity can't be created using API.";
        public const string ErrorBookmarkName = "Bookmark Name provided does not exists or Bookmark is not Global or Bookmark is Nested.";
        public const string ErrorEmptyBookmarkName = "Bookmark Name is Mandatory.";
        public const string ErrorEngagementAdd = "Engagement has not been created";
        public const string ErrorEmptyOpportunityFAS = "Opportunity Number or FAS is Mandatory.";
        public const string ErrorNotFoundOpportunityFAS = "No Open Engagement found on Opportunity Number and/or FAS.";
        public const string ErrorCurrentOwner = "Only Business Owner or Core3 user of the opportunity can be the owner of the engagement.";
        #endregion

        #region Asset Saving Methond
        public enum SAVING_CALCULATIONS_METHODS
        {
            NO_SAVING = 0,
            SAVING_PER_USE = 1,
            SAVING_ADJUSTED_WITH_EFFORT = 2,
            SAVING_ADJUSTED_BY_PERCENTAGE = 3,
            SAVING_REUSE_PERCENTAGE = 4,
            SAVING_ON_PRODUCTIVITY_TOOLS = 5,
            SAVING_AUTOMATED_ASSETS = 6
        }
        #endregion

        #region --Feedback Deviation --
        public const int MinimumFeedbackValue = 2;
        public const int MinimumFeedbackValue_FOREMAIL = 5;
        #endregion

        #region Engagement View Definition
        public const string ViewEngagement = "SavingsEngagement";
        public const string ViewEngagementBid = "SavingsBID";
        public const string ViewEngagementWithoutAsset = "EngagementWithoutAsset";
        public const string ViewEngagementWithAsset = "EngagementWithAsset";
        #endregion

        #region -- EngagementNotes Staus --        
        public const string Engagement_Notes_New = "N";
        public const string Engagement_Notes_Existing = "E";
        public const string Engagement_Notes_Update = "U";
        public const string Engagement_Notes_Delete = "D";
        #endregion

        #region AutoGenerate Comment Note
        public const string Engagement_Notes_Action = "Engagement Created";
        public const string Engagement_Note = "Engagement Created By API";
        public const string Engagement_Note_AddedBy = "Auto Generate - ";
        #endregion

        //        1	Product Supported Process
        //2	QMT on-boarded assets
        //3	Others
        #region --BusinessCase AutomationType--
        public const int PRODUCT_SUPPORTED_PROCESS = 1;
        public const int QMT_ONBOARD_ASSET = 2;
        public const int OTHERS = 3;

        #endregion

        #region -- BusinessCase AssetType Group --
        public const int ASSET_TYPE_GROUP_5GC = 1;
        public const int ASSET_TYPE_GROUP_OTHERS = 2;
        #endregion

        public static readonly string[] OppReminderEmailHeader = new[] { "Market Area", "Customer Unit", "Parent Engagement", "Bid Id", "Child Engagement", "Parent Engagement Current Owner", "Parent Engagement Created By", "Parent Engagement Created Date", "Asset(s) Planned", "Engagement Aging (days)" };
        public static readonly string[] EBCfailToEmailLibrarianEmailHeader = new[] { "Sr No", "Opportunity Number", "Opportunity Name", "CFR Signum", "CSR Signum", "ACR Signum", "Market Area", "Opportunity Stage", "Customer Unit" };
        public static readonly string[] OPP_CLOSE_WON_Email_TO_LibrarianEmailHeader = new[] { "Market Area", "Customer Unit", "Opportunity", "Parent Engagement", "Child Engagement", "Child Engagement Owner", "Child Engagement Step", "CFR Signum", "CSR Signum", "ACR Signum", "Mapped FAS", "FAS Status", "FAS CPM", "Expected Reuse Saving", "Expected Automation Saving" };
        public const string CFR_CSR_null = "Note: CFR and CSR are not yet assigned to this Opportunity as per Salesforce data. This is a kind request to ACR to have " +
                                "the CFR and CSR assigned in Salesforce so that handover of EBC can be done as per process. Kindly contact the respective Market Area Navigator365 SPOC for any " +
                                "support related to the EBC process.</br></br>";

        public static readonly string[] EBCCloseWonOpportunityEmailHeader = new[] { "Opportunity Number", "Parent Engagement", "Child Engagement", "Child Step", "Parent Owner", "Child Owner", "Child Created By", "Child Created Date" };
        public static readonly string[] AutomatedReminderToCPMForAssetUsageHeader = new[] { "Child Engagement", "Engagement Owner", "Engagement Created By", "Supporting CPMs", "EBC Contributors", "Planned but not Reused" };
        public static readonly string[] PlannedbutnotReusedHeader = new[] { "No. of Assets", "Expected Reuse Saving (Hrs)", "Expected Automation Saving (Hrs)" };
        public static readonly string PlannedButNotReused = "Planned but not Reused";
        public static readonly string[] QMTFeedbackRecivedEmailHeader = new[] { "Asset Id / Name", "EBC - Expected Automation Execution Per Project", "EBC - Automation Saving per Execution", "EBC - Expected One-time Effort Saving (mhrs)", "Auto created Feedback Id", "Feedback - Actual Number of Automation Execution",  };

        public static readonly string Core3Notification_Particular = "Particular";
        public static readonly string Core3Notification_Details = "Details";
        public static readonly string Core3Notification_Engagement = "Engagement Name";
        public static readonly string Core3Notification_ParentEngagement = "Parent Engagement";
        public static readonly string Core3Notification_ChildEngagement = "Child Engagement";
        public static readonly string Core3Notification_MarketArea = "Market Area";
        public static readonly string Core3Notification_CustomerName = "Customer Name";
        public static readonly string Core3Notification_CustomerUnit = "Customer Unit";
        public static readonly string Core3Notification_EngagementStep = "Engagement Step";
        public static readonly string Core3Notification_OpportunityStage = "Opportunity Stage";
        public static readonly string Core3Notification_FASStatus = "FAS Status";
        public static readonly string Core3Notification_ExpectedReuseSavings = "Expected Reuse Savings";
        public static readonly string Core3Notification_ExpectedAutomationSavings = "Expected Automation Savings";
        public static readonly string Core3Notification_Project = "FAS";
        public static readonly string Core3Notification_FasDelegatedCPM = "FAS Delegated CPM";
        public static readonly string Core3Notification_FasCPM = "FAS CPM";
        public static readonly string Core3Notification_SupportingCPM1 = "Supporting CPM1";
        public static readonly string Core3Notification_SupportingCPM2 = "Supporting CPM2";
        public static readonly string Core3Notification_SupportingCPM3 = "Supporting CPM3";
        public static readonly string Core3Notification_LEADSA = "Lead SA";
        public static readonly string Core3Notification_EXPECTEDREUSESAVING = "Expected Reuse Savings";
        public static readonly string Core3Notification_EXPECTEDAUTOMATIONSAVING = "Expected Automation Savings";
        public static readonly string Core3Notification_Opportunity = "Opportunity";
        public static readonly string Core3Notification_CurrentOwner = "Current Owner";


        public static readonly string Core3Notification_Subject = "Action: Navigator365 | Handover EBCs on Closed-Won " +
                                "Opportunity {{Opp Name}} to delivery";
        public static readonly string Core3Notification_EmailBody = "Opportunity <b> {{Opp Name}} </b> is now moved " +
                "into Closed-Won stage in Salesforce. Please hand over the below child EBC(s) created for this Opportunity to the " +
                "delivery team. As required, please update the EBC(s) before handover, to reflect the final list of assets considered " +
                "in the solution sold to customer.";
        public static readonly string Email_Notes = "You are receiving this email because you are either " +
                                        "Core3 or Engagement Owner or CPM or Delegated CPM or Supporting CPM or Lead SA of the Engagement.";

        public static readonly string Nav365_HandOverDelivery = "Navigator365 Notification - The Engagement {{Eng Name}} is handed over to delivery";

        public static readonly string HandOverDelivery_EmailBody = "Engagement <b> {{Eng Name}} </b> is handed over from Pre-Sales to Delivery. " +
            "Please find below the details of the Engagement. Please review the assets associated in EBC and plan to reuse during delivery of the project.";



        public const string BO = "Business Owner";
        public const string ACR = "ACR (Salesforce Primary)";
        public const string CFR = "CFR (Salesforce Primary)";
        public const string CSR = "CSR (Salesforce Primary)";
        public const string CPAPCFR = "CPAP CFR";
        public const string KAM = "KAM (Salesforce)";
        public const string CPM = "CPM";
        public const string DELEGATED_CPM = "Delegated CPM";
        public const string CONTRIBUTOR = "Contributor";
        public const string SUPPORTINGCPM = "Supporting CPM";
        public const string LIBRARIAN = "Librarian";
        public const string BID_ACR = "ACR (BidTool)";
        public const string BID_CFR = "CFR (BidTool)";
        public const string BID_CSR = "CSR (BidTool)";
        public const string Non_Primary_ACR = "ACR (Salesforce)";
        public const string Non_Primary_CFR = "CFR (Salesforce)";
        public const string Non_Primary_CSR = "CSR (Salesforce)";
        public const string LEAD_SA = "Lead SA";

        public const string MANAGED_ASSET_VIEW_URL = "#/assetRegistry/MANAGED_ASSETS/view/";
        public const string ENGAGEMENT_VIEW_URL = "#/engagement/view/";
        public const string EBC_VERSION_VIEW_URL = "#/viewEngagement/";
        public const string BOOKMARK_VIEW_URL = "#/Bookmark/view/";
        public const string PROVIDED_FEEDBACK_VIEW_URL = "#/viewFeedback/providedFeedback/view/";
        public const string RECEIVED_FEEDBACK_VIEW_URL = "#viewFeedback/myAssetsFeedback/view/";
        public const string PENDING_FEEDBACK_VIEW_URL = "#/viewFeedback/pendingFeedback/view/";
        public const string BO_DASHBOARD_FEEDBACK_VIEW_URL = "#/ProjectManagerDashboard/viewFeedback/view/";
        public const string AGED_ASSET_VIEW_URL = "#/assetRegistry/ALL_AGED_ASSET_VIEW/view/";
        public const string UNUSED_ASSET_VIEW_URL = "#/assetRegistry/ALL_UNUSED_ASSETS/view/";
        public const string RETIRED_PRODUCT_ASSET_VIEW_URL = "#/assetRegistry/ALL_RETIRED_PRODUCT_ASSETS/view/";

        public static readonly List<string> ACTIVEPROJECTSTATUS = new List<string> { "Created", "Assigned", "FAS Sent to LM", "Accepted and Released" };
        public static readonly List<int> ACTIVEOPPORTUNITYSTATUS = new List<int> { 1, 2, 3, 4 };
        public const string ASSSETDOWNLOADED_REQUEST_PAGE_VERSIONLIST = "Version List";
        public const string ASSSETDOWNLOADED_REQUEST_PAGE_BOOKMARK = "Bookmark";

        public const int BOOKMARK_TEMPLATE_ASSSET_NAME_COLUMN = 5;
        public const int BOOKMARK_TEMPLATE_ASSSET_STATUS_COLUMN = 6;
        public const int BOOKMARK_TEMPLATE_ASSSET_Available_COLUMN = 7;


        public const int VIEWSHARED_BOOKMARK_TEMPLATE_ASSSET_NAME_COLUMN = 1;
        public const int VIEWSHARED_BOOKMARK_TEMPLATE_ASSSET_STATUS_COLUMN = 3;
        public const int VIEWSHARED_BOOKMARK_TEMPLATE_ASSSET_Available_COLUMN = 4;

        public const int EBC_TEMPLATE_ASSSET_NAME_COLUMN = 3;
        public const int EBC_TEMPLATE_ASSSET_STATUS_COLUMN = 5;
        public const int EBC_TEMPLATE_ASSSET_Available_COLUMN = 6;


        public const int ENGAGEMENT_TEMPLATE_ASSSET_NAME_COLUMN = 3;
        public const int ENGAGEMENT_TEMPLATE_ASSSET_STATUS_COLUMN = 5;
        public const int ENGAGEMENT_TEMPLATE_ASSSET_Available_COLUMN = 6;

        #region Engagement Step ID
        public const int ENGAGEMENT_STEP_ID_EBC0 = 1;
        public const int ENGAGEMENT_STEP_ID_EBC1 = 2;
        public const int ENGAGEMENT_STEP_ID_EBC2 = 3;
        public const int ENGAGEMENT_STEP_ID_EBC3 = 4;
        public const int ENGAGEMENT_STEP_ID_EBC4 = 5;
        public const int ENGAGEMENT_STEP_ID_EBC5 = 6;
        #endregion

        public const string DUPLICATEEBCONSAMEOPPORTUNITY = "DUPLICATEEBCONSAMEOPPORTUNITY";

        public const string ENGAGEMENT_WBS_SETTING_NAME = "ENGWBSColumnData";

        public const string ENG_ASSOCIATED_BID_USER_ACR = "ACR (BidTool)";
        public const string ENG_ASSOCIATED_BID_USER_CFR = "CFR (BidTool)";
        public const string ENG_ASSOCIATED_BID_USER_CSR = "CSR (BidTool)";
        public const string ENG_ASSOCIATED_NON_PRIMARY_USER_ACR = "ACR (Salesforce)";
        public const string ENG_ASSOCIATED_NON_PRIMARY_USER_CFR = "CFR (Salesforce)";
        public const string ENG_ASSOCIATED_NON_PRIMARY_USER_CSR = "CSR (Salesforce)";
        public const string ENG_ASSOCIATED_OPPORTUNITY_ACR = "ACR (Salesforce Primary)";
        public const string ENG_ASSOCIATED_OPPORTUNITY_CFR = "CFR (Salesforce Primary)";
        public const string ENG_ASSOCIATED_OPPORTUNITY_CSR = "CSR (Salesforce Primary)";
        public const string ENG_ASSOCIATED_OPPORTUNITY_KAM = "KAM (Salesforce Primary)";
        public const string ENG_ASSOCIATED_FAS_CPM = "FAS CPM";
        public const string ENG_ASSOCIATED_FAS_DELEGATED_CPM = "FAS Delegated CPM";
        public const string ENG_ASSIGENED_SUPPORTING_CPM = "Supporting CPM";
        public const string ENG_ASSIGENED_LEAD_SA = "Lead SA";
        public const string ENG_ASSIGENED_CPAP_CFR = "Program CFR";

        public const string OPP_CFR = "CFR";
        public const string OPP_CSR = "CSR";
        public const string OPP_ACR = "ACR";
        public const string FILTER_NULL = "Null";
        public const string FILTER_NOTNULL = "NotNull";

        //Engagement Report
        public const string ENGAGEMENT_REPORT_WORKSHEET = "EngagementReportSheetName";

        public const string ENGAGEMENT_MAIN_WORKSHEET = "Main";
        public const string ASSET_MAIN_WORKSHEET = "Main";

        public const int ENGAGEMENT_FIELD_CELL_ROW = 11;
        public const int ENGAGEMENT_FIELD_CELL_COLUMN = 6;
        public const int ENGAGEMENT_DATE_FIELD_CELL_ROW = 12;
        public const int ENGAGEMENT_DATE_FIELD_CELL_COLUMN = 6;


        public const string LEAD_SA_EMAIL_BODY = "You have been added as a Lead SA for Engagement: <b> #engagementName </b> by <b> " +
                    "#userName ( #currentUserSignum )</b>. With this, you should be able to manage Engagement Business Case. <br/>" +
                    "To contribute in managing Engagement Business Case, please visit <a href='#appurl'>Navigator365</a>.";
        public const string EMAIL_NOTES = "You are receiving this email because you are recently added as a Lead SA for Engagement in Navigator365.";
        public const string SUBJECT = "Info: Navigator365 | You are added as a Lead SA in Engagement";

        public const string LOG_TYPE_INFO = "INFO";
        public const string LOGI_TYPE_ERROR = "ERROR";

        public const string ENGAGEMENT_STEP_EBC3 = "EBC3";
        public const string ENGAGEMENT_STEP_EBC4 = "EBC4";

        public const string CONSUMER_QUEUE_LOGINSERTION_METHOD_NAME = "messsageQueue/writeLogs";
        public const string CONSUMER_QUEUE_QUEUEMESSAGE_METHOD_NAME = "messsageQueue/addAndUpdateMessageQueueRequestDetails";


        //Sales Force API Token Request Params
        public const string REQUEST_GRANT_TYPE = "grant_type";
        public const string REQUEST_CLIENT_ID = "client_id";
        public const string REQUEST_CLIENT_SECRET = "client_secret";
        public const string REQUEST_USERNAME = "username";
        public const string REQUEST_PASSWORD = "password";

        public const string RESPONSE_CONTENT_TYPE_EXCELSHEET = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        public const string RESPONSE_CONTENT_TYPE_OCTET_STREAM = "application/octet-stream";
        public const string OPPORTUNITY_NON_CORE_TEAM_SCHEDULER_NAME = "OPPORTUNITYNONCORETEAM";
        public const int MAX_USER_SEARCH_COUNT = 500;

        public const int ENGAGEMENT_OPPORTUNITY_MAPPING_KEY = 1;
        public const int ENGAGEMENT_FAS_MAPPING_KEY = 2;
        public const int DataFetchChunkSize = 30000;

        public const int RED = 1;
        public const int GREEN = 2;
        public const int AMBER = 3;

        public const int EXPECTED_AUTOMATION_EXECUTION_MAX_DIGIT = 6;

        public static readonly string[] FAS_STAGE_FOR_EBC_PENDING_ACTION = new[] { "TG5 Approved", "TG4 Approved", "TG2 Approved", "TG3 Approved or Opt-Out", "MS6 Approved", "Final Handover to Support Approved", "Final Handover to Support Approved or Opt-Out" };


    }
}