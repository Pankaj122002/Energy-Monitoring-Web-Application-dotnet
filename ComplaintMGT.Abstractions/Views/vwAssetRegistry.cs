using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Views
{
    [Table("vwAsset_Registry")]
    public class vwAssetRegistry : IRequestHandler
    {
        [Key, Column("asset_registry_id")]
        public int AssetRegistryId { get; set; }
        [Column("asset_name")]
        public string AssetName { get; set; }
        [Column("asset_url")]
        public string AssetUrl { get; set; }
        [Column("sme_signum")]
        public string SmeSignum { get; set; }
        [Column("approver_signum")]
        public string ApproverSignum { get; set; }
        [Column("proposed_by")]
        public string ProposedBy { get; set; }
        [Column("co_proposer")]
        public string CoProposer { get; set; }
        [Column("status_date")]
        public string StatusDate { get; set; }
        [Column("framework_name")]
        public string FrameworkName { get; set; }
        [Column("role_name")]
        public string RoleName { get; set; }
        [Column("knowledge_area_name")]
        public string KnowledgeAreaName { get; set; }
        [Column("product_name")]
        public string ProductName { get; set; }
        [Column("product_number")]
        public string ProductNumber { get; set; }
        [Column("engagement_phase_name")]
        public string EngagementPhaseName { get; set; }
        [Column("Asset Expected Reuse Phase")]
        public string AssetExpectedReusePhase { get; set; }
        [Column("asset_approval_status_name")]
        public string AssetApprovalStatusName { get; set; }
        [Column("updated_date")]
        public DateTime UpdatedDate { get; set; }
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        [Column("source_name")]
        public string SourceName { get; set; }
        [Column("ownership_id")]
        public int? OwnershipId { get; set; }
        [Column("ownership_name")]
        public string OwnershipName { get; set; }
        [Column("is_asset_available")]
        public bool? IsAssetAvailable { get; set; }
        [Column("Asset File Type")]
        public string AssetFileType { get; set; }

        [Column("Asset Types")]
        public string AssetTypesName { get; set; }
        [Column("Asset Language")]
        public string AssetLanguage { get; set; }
        [Column("asset_business_case_id")]
        public int? AssetBusinessCaseId { get; set; }
        [Column("saving_method_id")]
        public int? SavingMethodId { get; set; }
        [Column("saving_method_description")]
        public string SavingMethodDescription { get; set; }
        [Column("ABC - Asset Type")]
        public string ABC_AssetType { get; set; }
        [Column("ABC - Asset Type Group")]
        public string ABC_AssetTypeGroup { get; set; }
        [Column("ABC - Asset Automation Type")]
        public string ABC_AssetAutomationType { get; set; }
        [Column("ABC - Expected Effort To Produce Without Reusbale Asset")]
        public decimal? ABC_ExpectedEffortToProduceWithoutReusbaleAsset { get; set; }
        [Column("ABC - Expected Effort To Produce With Reusbale Asset")]
        public decimal? ABC_ExpectedEffortToProduceWithReusbaleAsset { get; set; }
        [Column("ABC - Number of Iterations Per Project")]
        public int? ABC_NumberofIterationsPerProject { get; set; }
        [Column("ABC - Saving Per Reuse")]
        public decimal? ABC_SavingPerReuse { get; set; }
        [Column("ABC - Reuse Saving Per Project")]
        public decimal? ABC_ReuseSavingPerProject { get; set; }
        [Column("ABC - Expected Automation Executions")]
        public int? ABC_ExpectedAutomationExecutions { get; set; }
        [Column("ABC - Automation Saving Per Execution")]
        public decimal? ABC_AutomationSavingPerExecution { get; set; }
        [Column("ABC - Automation Saving Per Project")]
        public decimal? ABC_AutomationSavingPerProject { get; set; }
        [Column("Owner L1ORG")]
        public string OwnerL1ORG { get; set; }
        [Column("Owner L2ORG")]
        public string OwnerL2ORG { get; set; }
        [Column("Owner L3ORG")]
        public string OwnerL3ORG { get; set; }
        [Column("Owner L4ORG")]
        public string OwnerL4ORG { get; set; }
        [Column("Owner L5ORG")]
        public string OwnerL5ORG { get; set; }
        [Column("Owner L6ORG")]
        public string OwnerL6ORG { get; set; }
        [Column("Owner L7ORG")]
        public string OwnerL7ORG { get; set; }
        [Column("Owner L8ORG")]
        public string OwnerL8ORG { get; set; }
        [Column("Owner L1")]
        public string OwnerL1 { get; set; }
        [Column("Owner L2")]
        public string OwnerL2 { get; set; }
        [Column("Owner L3")]
        public string OwnerL3 { get; set; }
        [Column("Owner L4")]
        public string OwnerL4 { get; set; }
        [Column("Owner L5")]
        public string OwnerL5 { get; set; }
        [Column("Owner L6")]
        public string OwnerL6 { get; set; }
        [Column("Owner L7")]
        public string OwnerL7 { get; set; }
        [Column("Owner L8")]
        public string OwnerL8 { get; set; }
        [Column("Owner L9")]
        public string OwnerL9 { get; set; }
    }
}
