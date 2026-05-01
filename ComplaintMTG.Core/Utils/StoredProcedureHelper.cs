using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMTG.Core.Utils
{
    public class StoredProcedureHelper
    {




        #region Employee
        public const string spGetValidateLogin = "[dbo].[spGetValidateLogin] '{0}','{1}','{2}'";
        public const string GetAllUsers = "[dbo].[sp_GetAllUsers] '{0}','{1}','{2}','{3}','{4}','{5}'";
        public const string spGetAllRoles = "[dbo].[spGetAllRoles] '{0}'";
        public const string GetUserDataById = "[dbo].[GetUserDataById] {0}";
        public const string spGetMenuByRole = "[dbo].[spGetMenuByRole] '{0}'";
        public const string spGetALLMenuMaster = "[dbo].[spGetALLMenuMaster] {0}";
        public const string spGetALLCircleMaster = "[dbo].[spGetALLCircleMaster] '{0}'";
        public const string spGetAllSubMenuMaster = "[dbo].[spGetAllSubMenuMaster] {0}";
        public const string spSaveNupdateRole = "[dbo].[spSaveNupdateRole]";
        public const string SaveandupdateUser = "[dbo].[sp_InsertOrUpdateUser]";
        public const string spGetAllSubMenuByRoleV1 = "[dbo].[spGetAllSubMenuByRoleV1] '{0}'";
        public const string spGetAllSubMenuByRole = "[dbo].[spGetAllSubMenuByRole] '{0}'";
        public const string spGetAllCircleWardMaster = "[dbo].[spGetAllAssigendModule] '{0}','{1}'";
        #endregion


        #region Configuration

        public const string sp_GetAllMenuM = "[dbo].[sp_GetAllMenuM] '{0}'";
        public const string sp_GetAllMenuMP = "[dbo].[sp_GetAllMenuMP] ";
        public const string spGetALLMenuMasterByMenuId = "[dbo].[spGetALLMenuMasterByMenuId] '{0}'";
        public const string SaveOrUpdateMenuMaster = "[dbo].[SaveOrUpdateMenuMaster] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
        public const string sp_GetAllSubMenuM = "[dbo].[sp_GetAllSubMenuM]";
        public const string SaveOrUpdateSubMenuMaster = "[dbo].[SaveOrUpdateSubMenuMaster] '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}'";
        public const string spGetALLSubMenuMasterBySubMenuId = "[dbo].[spGetALLSubMenuMasterBySubMenuId] '{0}'";
        public const string GetAllCountry = "[dbo].[spGetAllCountry] '{0}'";
        public const string SaveandupdateCountry = "[dbo].[spSaveAndUpdateCountry] '{0}','{1}','{2}'";
        public const string spGetAllState = "[dbo].[spGetAllState] '{0}'";
        public const string spSaveandupdateState = "[dbo].[spSaveAndUpdateState] '{0}','{1}','{2}','{3}'";
        public const string spGetAllCity = "[dbo].[spGetAllCity] '{0}'";
        public const string spSaveandupdateCity = "[dbo].[spSaveAndUpdateCity] '{0}','{1}','{2}','{3}'";
        public const string sp_saveAndUpdateAddressType = "[dbo].[sp_saveAndUpdateAddressType] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
        public const string sp_AddressType = "[dbo].[sp_AddressType]";
        public const string sp_DeleteAddressType = "[dbo].[sp_DeleteAddressType] '{0}'";
        public const string sp_GetStateByCountry = "[dbo].[sp_GetStateByCountry] '{0}'";
        public const string sp_GetCityByStateId = "[dbo].[sp_GetCityByStateId] '{0}'";
        public const string spSaveNupdateCustmer = "[dbo].[spSaveNupdateCustmer]";
        public const string sp_GetAllCustomer = "[dbo].[sp_GetAllCustomer] '{0}'";
        public const string sp_GetAddressByCustomerId = "[dbo].[sp_GetAddressByCustomerId] '{0}'";
        public const string sp_GetCustomerByCustomerId = "[dbo].[sp_GetCustomerByCustomerId] '{0}'";
        public const string sp_DeleteCoustomer = "[dbo].[sp_DeleteCoustomer] '{0}'";

        public const string sp_GatAllZone = "[dbo].[sp_GatAllZone]";
        public const string sp_saveAndUpdateZone = "[dbo].[sp_saveAndUpdateZone] '{0}', '{1}','{2}','{3}','{4}'";
        public const string sp_DeleteZone = "[dbo].[sp_DeleteZone] '{0}'";
        public const string sp_GatAllZoneByCityId = "[dbo].[sp_GatAllZoneByCityId] '{0}'";

        public const string GetAllAppSetting = "[dbo].[sp_GetAppSetting]";
        #endregion

        #region DeshBoard
        public const string sp_GetAllDevie = "[dbo].[sp_GetAllDevice] '{0}'";
        public const string sp_DeshHVACAlerts = "[dbo].[sp_DeshHVACAlerts] '{0}'";
        public const string sp_GetAlerts = "[dbo].[sp_GetAlerts]";
        public const string sp_AllOverallComplianceofStore = "[dbo].[sp_AllOverallComplianceofStore]";
        public const string sp_GetAllDeviationOverallComplianceofStore_Summary = "[dbo].[sp_AllOverallComplianceofStore_Summary]";
        public const string sp_GetAllDeviationOverallComplianceofStore = "[dbo].[sp_AllDeviationOverallComplianceofStore]";
        public const string sp_DeshAlerts = "[dbo].[sp_DeshAlerts]";
        public const string sp_EnergyMeterRealtimeBARCHART = "[dbo].[sp_EnergyMeterRealtimeBARCHART] '{0}','{1}','{2}','{3}'";
        public const string sp_EnergyMeterByDateBARCHART = "[dbo].[sp_EnergyMeterByDateBARCHART] '{0}','{1}'";
        public const string sp_GetTopValueMeter = "[dbo].[sp_GetTopValueMeter]";
        public const string GetTopValuetransactionTempSensor = "[dbo].[GetTopValuetransactionTempSensor] '{0}'";
        public const string GetTopValuetransactionTempHumidSensor = "[dbo].[GetTopValuetransactionTempHumidSensor] '{0}'";
        public const string sp_Getallmeterdetailsbymetername = "[dbo].[sp_Getallmeterdetailsbymetername] '{0}'";
        public const string sp_GetallmeterdetailsbymeternameChart = "[dbo].[sp_GetallmeterdetailsbymeternameChart] '{0}','{1}'";
        public const string sp_GetallmeterdetailsbymeternameChartByDate = "[dbo].[sp_GetallmeterdetailsbymeternameChartByDate] '{0}','{1}','{2}','{3}'";
        public const string MapDeatils = "[dbo].[MapDeatils]";
        public const string sp_GetTimeForChart = "[dbo].[sp_GetTimeForChart]";
        public const string sp_transactionTempSensorForChart = "[dbo].[sp_transactionTempSensorForChart] '{0}'";
        public const string sp_GetAlltransactionTempSensorByDateTime = "[dbo].[sp_GetAlltransactionTempSensorByDateTime] '{0}','{1}','{2}'";
        public const string sp_GetAllSiteByCustomerId = "[dbo].[sp_GetAllSiteByCustomerId] '{0}'";
        public const string sp_GetAllAssetBySiteId = "[dbo].[sp_GetAllAssetBySiteId] '{0}','{1}'";
        public const string sp_EnergyConsumptionAverage = "[dbo].[sp_EnergyConsumptionAverage]";
        public const string sp_EnergyConsumptiontotal = "[dbo].[sp_EnergyConsumptiontotal]";
        public const string sp_ELECTRICALHEALTHAverage = "[dbo].[sp_ELECTRICALHEALTHAverage]";
        public const string sp_GetEnergyDistributionDashboard = "[dbo].[sp_GetEnergyDistributionDashboard]";
        public const string sp_TimeofDayENERGYCONSUMPTION = "[dbo].[sp_TimeofDayENERGYCONSUMPTION]";
        public const string sp_ThermalMonitoringHVACAvg = "[dbo].[sp_ThermalMonitoringHVACAvg] '{0}'";
        public const string sp_GetEmployeeGuestConfort_Dashboard = "[dbo].[sp_GetEmployeeGuestConfort_Dashboard]";
        public const string sp_GetEmployeeGuestConfortDetail_Dashboard = "[dbo].[sp_GetEmployeeGuestConfort_Dashboard_Detail]";
        public const string sp_GetUPS_Energy_Dashboard = "[dbo].[sp_GetUPS_Energy_Dashboard]";
        public const string sp_Get_Gas_Consumption = "[dbo].[sp_Get_Gas_Consumption]";
        public const string sp_Get_GasConsumption_TimeOfDay = "[dbo].[sp_Get_GasConsumption_TimeOfDay]";
        public const string sp_Get_Customer_Footfall = "[dbo].[sp_Get_Customer_Footfall]";
        public const string sp_Get_Customer_Footfall_TimeOfDay = "[dbo].[sp_Get_Customer_Footfall_TimeOfDay]";
        public const string sp_Get_EV_Health_Dashboard = "[dbo].[sp_Get_EV_Health_Dashboard]";
        public const string sp_GetAllAQI_Dashboard_Ext = "[dbo].[sp_GetAllAQI_Dashboard_Ext] '{0}','{1}'";
        public const string sp_GetAllAQI_TimeOfDay_Ext = "[dbo].[sp_GetAllAQI_TimeOfDay_Ext] '{0}','{1}'";
        public const string sp_AQIAlerts_Dashboard = "[dbo].[sp_AQIAlerts_Dashboard] '{0}','{1}'";
        public const string sp_AllOverallAQICompliance_Dashboard = "[dbo].[sp_AllOverallAQICompliance_Dashboard] '{0}','{1}'";
        public const string sp_GetAlertDataByDateTime = "[dbo].[sp_GetAlertDataByDateTime] '{0}','{1}','{2}','{3}'";
        public const string sp_GetAlertCountByDateTime = "[dbo].[sp_GetAlertCountByDateTime] '{0}','{1}'";
        public const string sp_GetSiteOperationWindow = "[dbo].[sp_GetSiteOperationWindow] '{0}','{1}'";
        public const string sp_GetSiteOperationWindowofcompliance = "[dbo].[sp_GetSiteOperationWindowofcompliance] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverall_Hot = "[dbo].[sp_ComplianceDashboardAllOverall_Hot] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverall_Warm = "[dbo].[sp_ComplianceDashboardAllOverall_Warm] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverall_Cold = "[dbo].[sp_ComplianceDashboardAllOverall_Cold] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStore_Hot = "[dbo].[sp_DeviceWiseComplicanceofStore_Hot] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStore_Warm = "[dbo].[sp_DeviceWiseComplicanceofStore_Warm] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStore_Cold = "[dbo].[sp_DeviceWiseComplicanceofStore_Cold] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreNonOps_Hot = "[dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Hot] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreNonOps_Warm = "[dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Warm] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreNonOps_Cold = "[dbo].[sp_DeviceWiseComplicanceofStoreNonOps_Cold] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreOps_Hot = "[dbo].[sp_DeviceWiseComplicanceofStoreOps_Hot] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreOps_Warm = "[dbo].[sp_DeviceWiseComplicanceofStoreOps_Warm] '{0}','{1}'";
        public const string sp_DeviceWiseComplicanceofStoreOps_Cold = "[dbo].[sp_DeviceWiseComplicanceofStoreOps_Cold] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallNonOps_Hot = "[dbo].[sp_ComplianceDashboardAllOverallNonOps_Hot] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallNonOps_Warm = "[dbo].[sp_ComplianceDashboardAllOverallNonOps_Warm] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallNonOps_Cold = "[dbo].[sp_ComplianceDashboardAllOverallNonOps_Cold] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallOps_Hot = "[dbo].[sp_ComplianceDashboardAllOverallOps_Hot] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallOps_Warm = "[dbo].[sp_ComplianceDashboardAllOverallOps_Warm] '{0}','{1}'";
        public const string sp_ComplianceDashboardAllOverallOps_Cold = "[dbo].[sp_ComplianceDashboardAllOverallOps_Cold] '{0}','{1}'";
        public const string sp_GetAlertCountByDateTime_Hot = "[dbo].[sp_GetAlertCountByDateTime_Hot] '{0}','{1}'";
        public const string sp_GetAlertCountByDateTime_Warm = "[dbo].[sp_GetAlertCountByDateTime_Warm] '{0}','{1}'";
        public const string sp_GetAlertCountByDateTime_Cold = "[dbo].[sp_GetAlertCountByDateTime_Cold] '{0}','{1}'";
        public const string sp_GetOperationsWiseCompliance_Hot = "[dbo].[sp_GetOperationsWiseCompliance_Hot] '{0}','{1}'";
        public const string sp_GetOperationsWiseCompliance_Warm = "[dbo].[sp_GetOperationsWiseCompliance_Warm] '{0}','{1}'";
        public const string sp_GetOperationsWiseCompliance_Cold = "[dbo].[sp_GetOperationsWiseCompliance_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboard_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboard_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboard_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboard_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboard_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboard_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardOps_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboardOps_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardOps_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboardOps_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardOps_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboardOps_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardNonOps_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardNonOps_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardNonOps_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboardNonOps_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetail_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetail_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetail_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetail_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetail_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetail_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailOps_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailOps_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailOps_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailOps_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailOps_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailOps_Cold] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailNonOps_Hot = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailNonOps_Hot] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailNonOps_Warm = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailNonOps_Warm] '{0}','{1}'";
        public const string sp_GetEmployeeGuestComfortDashboardDetailNonOps_Cold = "[dbo].[sp_GetEmployeeGuestComfortDashboardDetailNonOps_Cold] '{0}','{1}'";
        public const string sp_Getallmainmeterdetails_hot = "[dbo].[sp_Getallmainmeterdetails_hot] '{0}','{1}'";
        public const string sp_Getallmainmeterdetails_warm = "[dbo].[sp_Getallmainmeterdetails_warm] '{0}','{1}'";
        public const string sp_Getallmainmeterdetails_cold = "[dbo].[sp_Getallmainmeterdetails_cold] '{0}','{1}'";
       
        public const string sp_GetAlertCount_OpsNonOpsPercentage = "[dbo].[sp_GetAlertCount_OpsNonOpsPercentage] '{0}','{1}' ";
        public const string sp_GetOperationsWiseAlerts_Cold = "[dbo].[sp_GetOperationsWiseAlerts_Cold] '{0}','{1}'";
        public const string sp_GetOperationsWiseAlerts_Hot = "[dbo].[sp_GetOperationsWiseAlerts_Hot] '{0}','{1}'";
        public const string sp_GetOperationsWiseAlerts_Warm = "[dbo].[sp_GetOperationsWiseAlerts_Warm] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStore_Cold = "[dbo].[sp_DiningWiseComplicanceofStore_Cold] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStore_Hot = "[dbo].[sp_DiningWiseComplicanceofStore_Hot] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStore_Warm = "[dbo].[sp_DiningWiseComplicanceofStore_Warm] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreNonOps_Cold = "[dbo].[sp_DiningWiseComplicanceofStoreNonOps_Cold] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreNonOps_Hot = "[dbo].[sp_DiningWiseComplicanceofStoreNonOps_Cold] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreNonOps_Warm = "[dbo].[sp_DiningWiseComplicanceofStoreNonOps_Cold] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreOps_Cold = "[dbo].[sp_DiningWiseComplicanceofStoreOps_Cold] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreOps_Warm = "[dbo].[sp_DiningWiseComplicanceofStoreOps_Warm] '{0}','{1}'";
        public const string sp_DiningWiseComplicanceofStoreOps_Hot = "[dbo].[sp_DiningWiseComplicanceofStoreOps_Hot] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStore_Cold = "[dbo].[sp_ProductionWiseComplicanceofStore_Cold] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStore_Hot = "[dbo].[sp_ProductionWiseComplicanceofStore_Hot] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStore_Warm = "[dbo].[sp_ProductionWiseComplicanceofStore_Warm] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreNonOps_Cold = "[dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Cold] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreNonOps_Warm = "[dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Warm] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreNonOps_Hot = "[dbo].[sp_ProductionWiseComplicanceofStoreNonOps_Hot] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreOps_Warm = "[dbo].[sp_ProductionWiseComplicanceofStoreOps_Warm] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreOps_Hot = "[dbo].[sp_ProductionWiseComplicanceofStoreOps_Hot] '{0}','{1}'";
        public const string sp_ProductionWiseComplicanceofStoreOps_Cold = "[dbo].[sp_ProductionWiseComplicanceofStoreOps_Cold] '{0}','{1}'";






        #endregion

        #region EnergyParamters

        //Powerfactor
        public const string sp_GetAllMeters_ActualPowerfactor = "[dbo].[sp_GetAllMeters_ActualPowerfactor] '{0}' , '{1}'";
        public const string sp_GetAllMeters_LastUpdated_Powerfactor = "[dbo].[sp_GetAllMeters_LastUpdated_Powerfactor]";
        public const string sp_GetAllmeter_DailyAvgPowerfactor_warm = "[dbo].[sp_GetAllmeter_DailyAvgPowerfactor_warm] '{0}' , '{1}'";
        public const string sp_GetAllmeter_HourlyAvgPowerfactor_hot = "[dbo].[sp_GetAllmeter_HourlyAvgPowerfactor_hot] '{0}' , '{1}'";
        public const string sp_GetAllmeter_WeeklyAvgPowerfactor_cold = "[dbo].[sp_GetAllmeter_WeeklyAvgPowerfactor_cold] '{0}' , '{1}'";
        public const string sp_GetAllmeter_AvgPowerfactor = "[dbo].[sp_GetAllmeter_AvgPowerfactor]  '{0}' , '{1}'";


        //Runhour
        public const string sp_GetMainMeter_Runhr = "[dbo].[sp_GetMainMeter_Runhr]";
        public const string sp_GetSubMeter_Runhr = "[dbo].[sp_GetSubMeter_Runhr] ";
        public const string sp_GetDevice_AvgRunhr = "[dbo].[sp_GetDevice_AvgRunhr] '{0}','{1}'";
        public const string sp_GetDevice_SumRunhr = "[dbo].[sp_GetDevice_SumRunhr] '{0}','{1}'";

        //Voltage
        public const string sp_GetMainMeter_Voltage = "[dbo].[sp_GetMainMeter_Voltage] ";
        public const string sp_GetSubMeter_Voltage = "[dbo].[sp_GetSubMeter_Voltage] ";
        public const string sp_GetMainmeter_HourlyAvgVoltage_hot = "[dbo].[sp_GetMainmeter_HourlyAvgVoltage_hot] '{0}','{1}'";
        public const string sp_GetMainmeter_DailyAvgVoltage_warm = "[dbo].[sp_GetMainmeter_DailyAvgVoltage_warm] '{0}','{1}'";
        public const string sp_GetMainmeter_WeeklyAvgVoltage_cold = "[dbo].[sp_GetMainmeter_WeeklyAvgVoltage_cold] '{0}','{1}'";
        public const string sp_GetMainMeter_HighVoltage = "[dbo].[sp_GetMainMeter_HighVoltage] '{0}','{1}'";
        public const string sp_GetMainMeter_LowVoltage = "[dbo].[sp_GetMainMeter_LowVoltage] '{0}','{1}'";
        public const string sp_GetSubMeter_HighVoltage = "[dbo].[sp_GetSubMeter_HighVoltage] '{0}','{1}'";
        public const string sp_GetSubMeter_LowVoltage = "[dbo].[sp_GetSubMeter_LowVoltage] '{0}','{1}'";
        public const string sp_GetMainMeter_ActualVoltage = "[dbo].[sp_GetMainMeter_ActualVoltage] '{0}','{1}' ";

        //Power
        public const string sp_GetAllMeters_LastUpdated_Power = "[dbo].[sp_GetAllMeters_LastUpdated_Power] ";
        public const string sp_GetAllMeters_LastUpdatedPower_piegraph = "[dbo].[sp_GetAllMeters_LastUpdatedPower_piegraph] ";
        public const string sp_GetAllMeters_AvgPower_Operationwise = "[dbo].[sp_GetAllMeters_AvgPower_Operationwise] '{0}'";
        public const string sp_GetAllmeter_AvgPower = "[dbo].[sp_GetAllmeter_AvgPower] '{0}'";
        public const string sp_GetAllmeter_AvgPower_bargraph = "[dbo].[sp_GetAllmeter_AvgPower_bargraph] '{0}'";
        public const string sp_GetAllmeter_ActualPower = "[dbo].[sp_GetAllmeter_ActualPower] '{0}'";

        //Current
        public const string sp_GetAllMeters_LastUpdated_Current = "[dbo].[sp_GetAllMeters_LastUpdated_Current] ";
        public const string sp_GetAllMeters_LastUpdatedCurrent_piegraph = "[dbo].[sp_GetAllMeters_LastUpdatedCurrent_piegraph] ";
        public const string sp_GetAllMeters_AvgCurrent_Operationwise = "[dbo].[sp_GetAllMeters_AvgCurrent_Operationwise] '{0}'";
        public const string sp_GetAllmeter_AvgCurrent = "[dbo].[sp_GetAllmeter_AvgCurrent] '{0}'";
        public const string sp_GetAllmeter_AvgCurrent_bargraph = "[dbo].[sp_GetAllmeter_AvgCurrent_bargraph] '{0}'";
        public const string sp_GetAllmeter_ActualCurrent = "[dbo].[sp_GetAllmeter_ActualCurrent] '{0}'";




        #endregion


        #region Device 
        public const string sp_PushDeviceHandlingMonitoringSensor = "[dbo].[sp_PushDeviceHandlingMonitoringSensor] '{0}','{1}','{2}','{3}'";
        public const string sp_GetDeviceHandlingMonitoringSensor = "[dbo].[sp_GetDeviceHandlingMonitoringSensor]";
        public const string sp_saveTempAndHumidityMonitoringSensor = "[dbo].[sp_saveTempAndHumidityMonitoringSensor] '{0}','{1}','{2}','{3}','{4}'";
        public const string sp_GetTempAndHumidityMonitoringSensor = "[dbo].[sp_GetTempAndHumidityMonitoringSensor]";
        public const string sp_saveAndUpdateTransactionTempSensor = "[dbo].[sp_saveAndUpdateTransactionTempSensor] '{0}','{1}','{2}','{3}'";
        public const string sp_GetAlltransactionTempSensor = "[dbo].[sp_GetAlltransactionTempSensor]";
        public const string sp_GetAllEnergyMeter = "[dbo].[sp_GetAllEnergyMeter]";
        public const string GetAllAQI = "[dbo].[GetAllAQI]";
        public const string sp_GetAllAQI_Dashboard = "[dbo].[sp_GetAllAQI_Dashboard] '{0}','{1}'";
        public const string sp_GetAllAQI_TimeOfDay = "[dbo].[sp_GetAllAQI_TimeOfDay]";
        public const string GetAllOdour = "[dbo].[GetAllOdour]";
        public const string sp_AssetType = "[dbo].[sp_AssetType]";
        public const string sp_saveAndUpdateAssetType = "[dbo].[sp_saveAndUpdateAssetType] '{0}','{1}','{2}','{3}'";
        public const string sp_DeleteAssetTypeId = "[dbo].[sp_DeleteAssetTypeId] '{0}'";
        public const string sp_saveAndUpdateAsset = "[dbo].[sp_saveAndUpdateAsset] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}','{11}','{12}','{13}','{14}'";
        public const string sp_saveAndUpdateEnergyMeter = "[dbo].[sp_saveAndUpdateEnergyMeter] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}', '{16}','{17}','{18}','{19}','{20}','{21}','{22}','{23}','{24}','{25}','{26}','{27}','{28}','{29}','{30}','{31}','{32}','{33}','{34}','{35}','{36}','{37}','{38}','{39}','{40}','{41}'";
        public const string sp_saveAndUpdateOdour = "[dbo].[sp_saveAndUpdateOdour] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}'";
        public const string sp_saveAndUpdateAQI = "[dbo].[sp_saveAndUpdateAQI] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}'";
        public const string sp_Asset = "[dbo].[sp_Asset]";
        public const string sp_GetAssetByAssetId = "[dbo].[sp_GetAssetByAssetId] {0}";
        public const string sp_DeleteAsset = "[dbo].[sp_DeleteAsset] {0}";
        public const string sp_AssetPrameters = "[dbo].[sp_AssetPrameters]";
        public const string sp_saveAndUpdateAssetPrameters = "[dbo].[sp_saveAndUpdateAssetPrameters] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
        public const string sp_DeleteAssetPrameter = "[dbo].[sp_DeleteAssetPrameter] '{0}'";
        public const string sp_GetDeviceDeviceStatus = "[dbo].[sp_GetDeviceDeviceStatus]";
        public const string sp_saveAndUpdateDeviceStatus = "[dbo].[sp_saveAndUpdateDeviceStatus] '{0}','{1}','{2}','{3}'";
        public const string sp_DeleteDeviceStatus = "[dbo].[sp_DeleteDeviceStatus] '{0}'";
        public const string sp_GetAllDeviceDetails = "[dbo].[sp_GetAllDeviceDetails]";
        public const string sp_saveAndUpdateDeviceDetails = "[dbo].[sp_saveAndUpdateDeviceDetails] '{0}','{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}', '{11}', '{12}','{13}','{14}'";
        public const string sp_DeleteDeviceDetails = "[dbo].[sp_DeleteDeviceDetails] '{0}'";
        public const string sp_GetDeviceDetailsByDeviceId = "[dbo].[sp_GetDeviceDetailsByDeviceId] '{0}'";
        public const string sp_GetAllDeviceType = "[dbo].[sp_GetAllDeviceType]";
        public const string sp_saveAndUpdateDeviceType = "[dbo].[sp_saveAndUpdateDeviceType] '{0}','{1}','{2}','{3}'";
        public const string sp_DeleteDeviceType = "[dbo].[sp_DeleteDeviceType] '{0}'";
        public const string sp_saveAndUpdateAssetRules = "[dbo].[sp_saveAndUpdateAssetRules] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}'";
        public const string sp_GetAllAssetRules = "[dbo].[sp_GetAllAssetRules]";
        public const string sp_GetAllAssetRulesById = "[dbo].[sp_GetAllAssetRulesById] {0}";
        public const string sp_DeleteAssetRues = "[dbo].[sp_DeleteAssetRues] {0}";
        public const string sp_GetStatus = "[dbo].[sp_GetStatus]";
        public const string sp_saveAndUpdateStatus = "[dbo].[sp_saveAndUpdateStatus] '{0}','{1}','{2}','{3}'";
        public const string sp_DeleteStatus = "[dbo].[sp_DeleteStatus] '{0}'";
        public const string sp_saveAndUpdateAssetOverride = "[dbo].[sp_saveAndUpdateAssetOverride] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}','{7}'";
        public const string sp_GetAssetOverride = "[dbo].[sp_GetAssetOverride]";
        public const string sp_GetAssetOverrideByAssetOverrideId = "[dbo].[sp_GetAssetOverrideByAssetOverrideId] {0}";
        public const string sp_DeleteAssetOverride = "[dbo].[sp_DeleteAssetOverride] {0}";
        #endregion


        #region Site
        public const string sp_Site = "[dbo].[sp_Site]";
        public const string sp_saveAndUpdateSite = "[dbo].[sp_saveAndUpdateSite] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}','{11}'";
        public const string sp_GetSiteBySiteId = "[dbo].[sp_GetSiteBySiteId] '{0}'";
        public const string sp_DeleteSite = "[dbo].[sp_DeleteSite] '{0}'";
        public const string GetAllSiteOperatingRules = "[dbo].[GetAllSiteOperatingRules]";
        public const string sp_saveAndUpdateSiteOperatingRules = "[dbo].[sp_saveAndUpdateSiteOperatingRules] '{0}','{1}','{2}','{3}','{4}'";
        public const string sp_DeleteSiteOperatingRules = "[dbo].[sp_DeleteSiteOperatingRules] '{0}'";
        public const string GetAllSiteOperationWindow = "[dbo].[GetAllSiteOperationWindow]";
        public const string sp_saveAndUpdateSiteOperationWindow = "[dbo].[sp_saveAndUpdateSiteOperationWindow] '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}'";
        public const string sp_DeleteSiteOperationWindow = "[dbo].[sp_DeleteSiteOperationWindow] '{0}'";
        public const string sp_GetAllSiteInformation = "[dbo].[sp_GetAllSiteInformation]";
        public const string sp_saveAndUpdateSiteInformation = "[dbo].[sp_saveAndUpdateSiteInformation] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}'";
        public const string sp_GetSiteInformationBySiteInformationId = "[dbo].[sp_GetSiteInformationBySiteInformationId] '{0}'";
        public const string sp_DeleteSiteInformation = "[dbo].[sp_DeleteSiteInformation] '{0}'";
        public const string sp_GetAllSiteInformationBaseline = "[dbo].[sp_GetAllSiteInformationBaseline]";
        public const string sp_saveAndUpdateSiteInformationBaseline = "[dbo].[sp_saveAndUpdateSiteInformationBaseline] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}'";
        public const string sp_GetSiteInformatioBaselinenBySiteInformationBaselineId = "[dbo].[sp_GetSiteInformationBaselineBySiteInformationBaselineId] '{0}'";
        public const string sp_DeleteSiteInformationBaseline = "[dbo].[sp_DeleteSiteInformationBaseline] '{0}'";
        #endregion

        #region Master
        public const string sp_GatAllDesignation = "[dbo].[sp_GatAllDesignation]";
        public const string sp_saveAndUpdateDesignation = "[dbo].[sp_saveAndUpdateDesignation] '{0}', '{1}','{2}','{3}'";
        public const string sp_DeleteDesignation = "[dbo].[sp_DeleteDesignation] '{0}'";
        #endregion

        #region Inventory
        public const string sp_GetAllOrder = "[dbo].[sp_GetAllOrder]";
        public const string sp_saveAndUpdateOrders = "[dbo].[sp_saveAndUpdateOrders] '{0}', '{1}','{2}','{3}','{4}','{5}','{6}', '{7}', '{8}','{9}','{10}'";
        public const string sp_GetAllOrderByOrderId = "[dbo].[sp_GetAllOrderByOrderId] '{0}'";
        public const string sp_DeleteOrder = "[dbo].[sp_DeleteOrder] '{0}'";
        #endregion

        #region Report
        public const string sp_GetAlltransactionTempSensorByDateTimeReport = "[dbo].[sp_GetAlltransactionTempSensorByDateTimeReport] '{0}','{1}','{2}','{3}'";
        public const string sp_GetallmeterdetailsbymeternameByDateAndTimeV2 = "[dbo].[sp_GetallmeterdetailsbymeternameByDateAndTimeV2] '{0}','{1}','{2}'";
        public const string sp_GetallmeterdetailsbymeternameByDateAndTime = "[dbo].[sp_GetallmeterdetailsbymeternameByDateAndTime] '{0}','{1}','{2}'";
        public const string sp_GetFirstAndLastRowEnergyDetails = "[dbo].[sp_GetFirstAndLastRowEnergyDetails] '{0}','{1}'";
        public const string sp_GetAllGetAlltransactionTempSensorByDateTimeReportPaging = "[dbo].[sp_GetAllGetAlltransactionTempSensorByDateTimeReportPaging] '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}'";
        public const string sp_GetAllGetAllmeterByDateTimeReportPaging = "[dbo].[sp_GetAllGetAllmeterByDateTimeReportPaging] '{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}'";
        public const string sp_GetAlltransactionTempSensorByRealTimeReport = "[dbo].[sp_GetAlltransactionTempSensorByRealTimeReport] '{0}'";
        #endregion

        #region Energy
        public const string sp_EnergyConsumptionActual = "[dbo].[sp_EnergyConsumptionActual] '{0}','{1}'";
        public const string sp_EnergyConsumptionCumulative = "[dbo].[sp_EnergyConsumptionCumulative] '{0}','{1}'";
        public const string sp_EnergyConsumptionAvg = "[dbo].[sp_EnergyConsumptionAvg] '{0}','{1}'";

        public const string sp_EnergyConsumptionActual_BarGraph_Dashboard = "[dbo].[sp_EnergyConsumptionActual_BarGraph_Dashboard] '{0}'";
        public const string sp_EnergyConsumptionAverage_BarGraph_Dashboard = "[dbo].[sp_EnergyConsumptionAverage_BarGraph_Dashboard] '{0}'";
        public const string sp_EnergyConsumption_TimeOfDay_Dashboard = "[dbo].[sp_EnergyConsumption_TimeOfDay_Dashboard] '{0}'";
        public const string sp_EnergyConsumptionCumulative_Dashboard = "[dbo].[sp_EnergyConsumptionCumulative_Dashboard]";
        public const string sp_GetEnergyDistribution_EnergyDashboard = "[dbo].[sp_GetEnergyDistribution_EnergyDashboard] '{0}','{1}'";
        public const string sp_GetPowerOutage_EnergyDashboard = "[dbo].[sp_GetPowerOutage_EnergyDashboard] '{0}','{1}'";
        public const string sp_EnergyConsumption_TimeOfDay_Dd = "[dbo].[sp_EnergyConsumption_TimeOfDay_Dd] '{0}'";


        //trends Stored Procedure
        //Hourly Actual Trends
        public const string sp_EnergyTrends_EnergyProfileHourlyActual = "[dbo].[sp_EnergyTrends_EnergyProfileHourlyActual] '{0}' , '{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionPeakHourlyActual = "[dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyActual] '{0}' , '{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionHourlyActual = "[dbo].[sp_EnergyTrends_EnergyConsumptionHourlyActual] '{0}' , '{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual = "[dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual] '{0}','{1}'";

        //Live Trends
        public const string sp_EnergyTrends_EnergyConsumptionLive = "[dbo].[sp_EnergyTrends_EnergyConsumptionLive] '{0}' , '{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionAndTemperatureLive = "[dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureLive] '{0}','{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionAndTemperature = "[dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperature] '{0}','{1}'";
        public const string sp_EnergyTrends_CumulativeEnergyConsumptionLive = "[dbo].[sp_EnergyTrends_CumulativeEnergyConsumptionLive] '{0}','{1}','{2}'";

        //Hourly Average Trends
        public const string sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage = "[dbo].[sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage] '{0}','{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionHourlyAverage = "[dbo].[sp_EnergyTrends_EnergyConsumptionHourlyAverage] '{0}','{1}'";
        public const string sp_EnergyTrends_EnergyProfileHourlyAverage = "[dbo].[sp_EnergyTrends_EnergyProfileHourlyAverage] '{0}','{1}'";
        public const string sp_EnergyTrends_EnergyConsumptionPeakHourlyAverage = "[dbo].[sp_EnergyTrends_EnergyConsumptionPeakHourlyAverage] '{0}','{1}'";

        //Meter Filter
        public const string sp_GetFilterbyMeter = "[dbo].[sp_GetFilterbyMeter]";

        public const string sp_EnergyTrends_EnergyConsumptionPeak = "[dbo].[sp_EnergyTrends_EnergyConsumptionPeak] '{0}'";
        public const string sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature = "[dbo].[sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature] '{0}'";
        public const string sp_EnergyTrends_EnergyProfile = "[dbo].[sp_EnergyTrends_EnergyProfile] '{0}'";
        #endregion

        #region Thermal Monitoring

        public const string sp_Get_HVAC_DashboardAlert = "[dbo].[sp_GetHVACDashboardAlert] '{0}'";
        public const string sp_Get_HVAC_DashboardAlerts = "[dbo].[sp_GetHVACDashboardAlerts] '{0}'";
        public const string sp_Get_HVAC_ThermalMonitoringTable = "[dbo].[sp_GetHVACThermalMonitoringTable] '{0}'";
        public const string sp_Get_HVAC_Compliance = "[dbo].[sp_GetHVACDashboardCompliance] '{0}'";
        public const string sp_Get_HVAC_ThermalMonitoringOps = "[dbo].[sp_GetHVACThermalMonitoringOpsInfo] '{0}'";
        public const string sp_Get_HVAC_ThermalMonitoringSeries = "[dbo].[sp_GetHVACThermalMonitoringSeries] '{0}'";

        public const string sp_Get_Ambient_DashboardAlerts = "[dbo].[sp_GetAmbientThermalDashboardAlerts] '{0}'";
        public const string sp_Get_Ambient_DashboardCompliance = "[dbo].[sp_GetAmbientThermalDashboardCompliance] '{0}'";
        public const string sp_Get_Ambient_ThermalMonitoringOps = "[dbo].[sp_GetAmbientThermalMonitoringOpsInfo] '{0}'";
        public const string sp_Get_Ambient_ThermalMonitoringTable = "[dbo].[sp_GetAmbientThermalMonitoringTable] '{0}'";
        public const string sp_Get_Ambient_ThermalMonitoringSeries = "[dbo].[sp_GetAmbientThermalMonitoringSeries] '{0}'";
        public const string sp_Get_AmbientAssets = "[dbo].[sp_GetAmbientAssetList] '{0}'";
        public const string sp_Get_Ambient_HumidityDashboardAlerts = "[dbo].[sp_GetAmbientHumidityDashboardAlerts] '{0}'";
        public const string sp_Get_Ambient_HumidityMonitoringTable = "[dbo].[sp_GetAmbientHumidityMonitoringTable] '{0}'";
        public const string sp_Get_Ambient_HumidityMonitoringSeries = "[dbo].[sp_GetAmbientHumidityMonitoringSeries] '{0}'";
        public const string sp_GetAmbientHumidityDashboardCompliance = "[dbo].[sp_GetAmbientHumidityDashboardCompliance] '{0}'";
        public const string sp_GetAmbientHumidityMonitoringOpsInfo = "[dbo].[sp_GetAmbientHumidityMonitoringOpsInfo] '{0}'";

        public const string sp_Get_KitchenAsset_DashboardAlerts = "[dbo].[sp_GetKitchenAssetDashboardAlerts] '{0}'";
        public const string sp_Get_KitchenAsset_ThermalMonitoringTable = "[dbo].[sp_GetKitchenAssetThermalMonitoringTable] '{0}'";
        public const string sp_Get_KitchenAsset_Compliance = "[dbo].[sp_GetKitchenAssetDashboardCompliance] '{0}'";
        public const string sp_Get_KitchenAsset_ThermalMonitoringOps = "[dbo].[sp_GetKitchenAssetThermalMonitoringOpsInfo] '{0}'";
        public const string sp_Get_KitchenAsset_ThermalMonitoringRefrigerationOps = "[dbo].[sp_GetKitchenAssetThermalMonitoringRefrigerationOpsInfo] '{0}'";
        public const string sp_Get_KitchenAsset_ThermalMonitoringSeries = "[dbo].[sp_GetKitchenAssetThermalMonitoringSeries] '{0}'";

        public const string sp_Get_HVACAssets = "[dbo].[sp_GetHVACAssetList] '{0}'";
        public const string sp_Get_KitchenAssets = "[dbo].[sp_GetKitchenAssetList] '{0}'";

        public const string sp_Get_Trends_ThermalMonitoringSeries_Hot_ByAssetId = "[dbo].[sp_GetThermalMonitoringSeries_Hot_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientThermalMonitoringSeries_Hot_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringSeries_Hot_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientHumidityMonitoringSeries_Hot_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringSeries_Hot_ByAssetId] '{0}'";
        public const string sp_Get_Trends_ThermalMonitoringSeries_Warm_ByAssetId = "[dbo].[sp_GetThermalMonitoringSeries_Warm_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientHumidityMonitoringSeries_Warm_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringSeries_Warm_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientThermalMonitoringSeries_Warm_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringSeries_Warm_ByAssetId] '{0}'";
        public const string sp_Get_Trends_ThermalMonitoringSeries_Cold_ByAssetId = "[dbo].[sp_GetThermalMonitoringSeries_Cold_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientHumidityMonitoringSeries_Cold_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringSeries_Cold_ByAssetId] '{0}'";
        public const string sp_Get_Trends_AmbientThermalMonitoringSeries_Cold_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringSeries_Cold_ByAssetId] '{0}'";


        public const string sp_GetThermalMonitoring_Trends_Hot = "[dbo].[sp_GetThermalMonitoring_Trends_Hot] '{0}'";
        public const string sp_GetAmbientThermalMonitoring_Trends_Hot = "[dbo].[sp_GetAmbientThermalMonitoring_Trends_Hot] '{0}'";
        public const string sp_GetAmbientHumidityMonitoring_Trends_Hot = "[dbo].[sp_GetAmbientHumidityThermalMonitoring_Trends_Hot] '{0}'";
        public const string sp_GetThermalMonitoring_Trends_Warm = "[dbo].[sp_GetThermalMonitoring_Trends_Warm] '{0}'";
        public const string sp_GetAmbientThermalMonitoring_Trends_Warm = "[dbo].[sp_GetAmbientThermalMonitoring_Trends_Warm] '{0}'";
        public const string sp_GetAmbientHumidityMonitoring_Trends_Warm = "[dbo].[sp_GetAmbientHumidityThermalMonitoring_Trends_Warm] '{0}'";
        public const string sp_GetThermalMonitoring_Trends_Cold = "[dbo].[sp_GetThermalMonitoring_Trends_Cold] '{0}'";
        public const string sp_GetAmbientThermalMonitoring_Trends_Cold = "[dbo].[sp_GetAmbientThermalMonitoring_Trends_Cold] '{0}'";
        public const string sp_GetAmbientHumidityMonitoring_Trends_Cold = "[dbo].[sp_GetAmbientHumidityThermalMonitoring_Trends_Cold] '{0}'";

        public const string sp_GetEnergyConsumption_Hot = "[dbo].[sp_GetEnergyConsumption_Hot]";
        public const string sp_GetEnergyConsumption_Warm = "[dbo].[sp_GetEnergyConsumption_Warm]";
        public const string sp_GetEnergyConsumption_Cold = "[dbo].[sp_GetEnergyConsumption_Cold]";

        public const string sp_GetThermalMonitoringHeatMap_Trends_Hot_ByAssetId = "[dbo].[sp_GetThermalMonitoringHeatMap_Trends_Hot_ByAssetId] '{0}'";
        public const string sp_GetThermalMonitoringHeatMap_Trends_Warm_ByAssetId = "[dbo].[sp_GetThermalMonitoringHeatMap_Trends_Warm_ByAssetId] '{0}'";
        public const string sp_GetThermalMonitoringHeatMap_Trends_Cold_ByAssetId = "[dbo].[sp_GetThermalMonitoringHeatMap_Trends_Cold_ByAssetId] '{0}'";
        public const string sp_GetThermalMonitoringContinuousSeries_ByAssetId = "[dbo].[sp_GetThermalMonitoringContinuousSeries_ByAssetId] '{0}'";
        public const string sp_GetAmbientHumidityMonitoringHeatMap_Trends_Hot_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringHeatMap_Trends_Hot_ByAssetId] '{0}'";
        public const string sp_GetAmbientThermalMonitoringHeatMap_Trends_Hot_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringHeatMap_Trends_Hot_ByAssetId] '{0}'";
        public const string sp_GetAmbientHumidityMonitoringHeatMap_Trends_Warm_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringHeatMap_Trends_Warm_ByAssetId] '{0}'";
        public const string sp_GetAmbientThermalMonitoringHeatMap_Trends_Warm_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringHeatMap_Trends_Warm_ByAssetId] '{0}'";
        public const string sp_GetAmbientHumidityMonitoringHeatMap_Trends_Cold_ByAssetId = "[dbo].[sp_GetAmbientHumidityMonitoringHeatMap_Trends_Cold_ByAssetId] '{0}'";
        public const string sp_GetAmbientThermalMonitoringHeatMap_Trends_Cold_ByAssetId = "[dbo].[sp_GetAmbientThermalMonitoringHeatMap_Trends_Cold_ByAssetId] '{0}'";

        public const string sp_GetThermalMonitoring_KitchenAsset_Trends_Hot = "[dbo].[sp_GetThermalMonitoring_KitchenAsset_Trends_Hot] '{0}'";
        public const string sp_GetThermalMonitoring_KitchenAsset_Trends_Warm = "[dbo].[sp_GetThermalMonitoring_KitchenAsset_Trends_Warm] '{0}'";
        public const string sp_GetThermalMonitoring_KitchenAsset_Trends_Cold = "[dbo].[sp_GetThermalMonitoring_KitchenAsset_Trends_Cold] '{0}'";

        public const string sp_GetThermalMonitoring_AssetRules = "[dbo].[sp_GetThermalMonitoring_Trends_AssetRules] '{0}'";

        public const string sp_GetThermalMonitoring_hvac_report = "[dbo].[sp_GetThermalMonitoring_hvac_report]";
        public const string sp_GetThermalMonitoring_ambient_report = "[dbo].[sp_GetThermalMonitoring_ambient_report]";
        public const string sp_GetThermalMonitoring_kitchenasset_report = "[dbo].[sp_GetThermalMonitoring_kitchenasset_report]";

        public const string sp_GetSiteName = "[dbo].[sp_GetSiteName] '{0}'";
        public const string sp_SyncCustomerFootfallData = "[dbo].[sp_SyncCustomerFootfallData] '{0}'";
        public const string sp_SyncUpsReadingData = "[dbo].[sp_SyncUpsReadingData] '{0}','{1}','{2}','{3}','{4}','{5}', '{6}', '{7}'";


        #endregion

        #region Thermal Monitoring Trends
        public const string sp_GetThermalMonitoringHVAC_live_ByAssetId = "[dbo].[sp_GetThermalMonitoringHVAC_live_ByAssetId] '{0}'";
        public const string sp_GetThermalMonitoringHVAC_AverageTrends_Hot = "[dbo].[sp_GetThermalMonitoringHVAC_AverageTrends_Hot] '{0}'";
        public const string sp_GetThermalMonitoringHVAC_live_ByAssetId_warm = "[dbo].[sp_GetThermalMonitoringHVAC_live_ByAssetId_warm] '{0}'";
        public const string sp_GetThermalMonitoringHVAC_AverageTrends_cold = "[dbo].[sp_GetThermalMonitoringHVAC_AverageTrends_cold] '{0}'";
        public const string sp_GetThermalMonitoringHVAC_live_ByAssetId_cold = "[dbo].[sp_GetThermalMonitoringHVAC_live_ByAssetId_cold] '{0}'";
        public const string sp_GetThermalMonitoringHVAC_AverageTrends_warm = "[dbo].[sp_GetThermalMonitoringHVAC_AverageTrends_warm] '{0}'";
        public const string sp_GetHVACAssetList = "[dbo].[sp_GetHVACAssetList]";
        #endregion


        #region Ambient Monitoring Trends
        public const string sp_GetThermalMonitoringAmbient_AverageTrends_cold = "[dbo].[sp_GetThermalMonitoringAmbient_AverageTrends_cold] '{0}'";
        public const string sp_GetThermalMonitoringAmbient_AverageTrends_warm = "[dbo].[sp_GetThermalMonitoringAmbient_AverageTrends_warm] '{0}'";
        public const string sp_GetThermalMonitoringAmbient_AverageTrends_Hot = "[dbo].[sp_GetThermalMonitoringAmbient_AverageTrends_Hot] '{0}'";
        public const string sp_GetThermalMonitoringAmbient_live_ByAssetId = "[dbo].[sp_GetThermalMonitoringAmbient_live_ByAssetId] '{0}'";
        public const string sp_GetThermalMonitoringAmbient_live_ByAssetId_warm = "[dbo].[sp_GetThermalMonitoringAmbient_live_ByAssetId_warm] '{0}'";
        public const string sp_GetThermalMonitoringAmbient_live_ByAssetId_cold = "[dbo].[sp_GetThermalMonitoringAmbient_live_ByAssetId_cold] '{0}'";

        public const string sp_GetHumidityMonitoringAmbient_AverageTrends_cold = "[dbo].[sp_GetHumidityMonitoringAmbient_AverageTrends_cold] '{0}'";
        public const string sp_GetHumidityMonitoringAmbient_AverageTrends_warm = "[dbo].[sp_GetHumidityMonitoringAmbient_AverageTrends_warm] '{0}'";
        public const string sp_GetHumidityMonitoringAmbient_AverageTrends_Hot = "[dbo].[sp_GetHumidityMonitoringAmbient_AverageTrends_Hot] '{0}'";
        public const string sp_GetHumidityMonitoringAmbient_live_ByAssetId_cold = "[dbo].[sp_GetHumidityMonitoringAmbient_live_ByAssetId_cold] '{0}'";
        public const string sp_GetHumidityMonitoringAmbient_live_ByAssetId_warm = "[dbo].[sp_GetHumidityMonitoringAmbient_live_ByAssetId_warm] '{0}'";
        public const string sp_GetHumidityMonitoringAmbient_live_ByAssetId = "[dbo].[sp_GetHumidityMonitoringAmbient_live_ByAssetId] '{0}'";
        public const string sp_GetAmbientThermalAssetList = "[dbo].[sp_GetAmbientThermalAssetList]";
        #endregion
    }
}
