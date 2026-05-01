using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGTAPI;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using System;
using System.Linq;

namespace ComplaintMGT.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThermalController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;

        public ThermalController(IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        #region HVAC 

        [HttpGet]
        [Route("GetHVACDashboardAlerts")]
        public IActionResult GetHVACDashboardAlerts(int days = 0) 
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_DashboardAlerts, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpGet]
        //[Route("GetHVACDashboardAlert")]
        //public IActionResult GetHVACDashboardAlert(int duration = 0)
        //{
        //    try
        //    {
        //        object[] parameters = { duration };
        //        string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_DashboardAlert, parameters);

        //        return Ok(_response);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpGet]
        [Route("GetHVACDashboardThermalMonitoriting")]
        public IActionResult GetHVACDashboardThermalMonitoriting(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_ThermalMonitoringTable, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHVACDashboardCompliance")]
        public IActionResult GetHVACDashboardCompliance(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_Compliance, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHVACOpsThermalMonitoring")]
        public IActionResult GetHVACOpsThermalMonitoring(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_ThermalMonitoringOps, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHVACThermalMonitoringSeries")]
        public IActionResult GetHVACThermalMonitoringSeries(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVAC_ThermalMonitoringSeries, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion

        #region Ambient
        

        [HttpGet]
        [Route("ambient/GetHumidityDashboardAlerts")]
        public IActionResult GetAmbientHumidityDashboardAlerts(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_HumidityDashboardAlerts, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAmbientHumidityDashboardCompliance")]
        public IActionResult GetAmbientHumidityDashboardCompliance(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityDashboardCompliance, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAmbientHumidityMonitoringOpsInfo")]
        public IActionResult GetAmbientHumidityMonitoringOpsInfo(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoringOpsInfo, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ambient/GetThermalDashboardCompliance")]
        public IActionResult GetAmbientThermalDashboardCompliance(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_DashboardCompliance, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ambient/GetAmbientOpsThermalMonitoring")]
        public IActionResult GetAmbientOpsThermalMonitoring(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_ThermalMonitoringOps, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ambient/GetHumidityMonitoring")]
        public IActionResult GetAmbientDashboardHumidityMonitoriting(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_HumidityMonitoringTable, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       
        [HttpGet]
        [Route("ambient/GetHumidityMonitoringSeries")]
        public IActionResult GetAmbientHumidityMonitoringSeries(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_HumidityMonitoringSeries, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ambient/GetThermalDashboardAlerts")]
        public IActionResult GetAmbientThermalDashboardAlerts(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_DashboardAlerts, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ambient/GetThermalMonitoring")]
        public IActionResult GetAmbientDashboardThermalMonitoriting(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_ThermalMonitoringTable, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("ambient/GetThermalMonitoringSeries")]
        public IActionResult GetAmbientThermalMonitoringSeries(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Ambient_ThermalMonitoringSeries, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion

        #region Kitchen Asset APIs

        [HttpGet]
        [Route("kitchenasset/GetDashboardAlert")]
        public IActionResult GetKitchenAssetDashboardAlert(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_DashboardAlerts, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("kitchenasset/GetThermalMonitoring")]
        public IActionResult GetKitchenAssetDashboardThermalMonitoriting(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_ThermalMonitoringTable, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("kitchenasset/GetComplianace")]
        public IActionResult GetKitchenAssetDashboardCompliance(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_Compliance, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("kitchenasset/GetThermalMonitoringOpsData")]
        public IActionResult GetKitchenAssetOpsThermalMonitoring(int days = 0)
        {
            try
            {
               // object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_ThermalMonitoringOps, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("kitchenasset/GetThermalMonitoringRefrigerationOpsData")]
        public IActionResult GetThermalMonitoringRefrigerationOpsData(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_ThermalMonitoringRefrigerationOps, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("kitchenasset/GetThermalMonitoringSeries")]
        public IActionResult GetKitchenAssetThermalMonitoringSeries(int days = 0)
        {
            try
            {
                //object[] parameters = { getType(days), getLoginId() };
                object[] parameters = { days };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAsset_ThermalMonitoringSeries, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        #endregion

        #region Trends & Reports


        [HttpGet]
        [Route("hvac/GetAssetList")]
        public IActionResult GetHVACAssetList()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_HVACAssets, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("ambient/GetAssetList")]
        public IActionResult GetAmbientAssetList()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_AmbientAssets, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("kitchenasset/GetAssetList")]
        public IActionResult GetKitchenAssetList()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_KitchenAssets, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/HotThermalMonitoring")]
        public IActionResult GetHotThermalMonitoringSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_ThermalMonitoringSeries_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientHotThermalMonitoring")]
        public IActionResult GetAmbientHotThermalMonitoringSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientHumidityMonitoringSeries_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempHotThermalMonitoring")]
        public IActionResult GetAmbientTempHotThermalMonitoringSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientThermalMonitoringSeries_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/WarmThermalMonitoring")]
        public IActionResult GetWarmThermalMonitoringSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_ThermalMonitoringSeries_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientWarmThermalMonitoring")]
        public IActionResult AmbientWarmThermalMonitoring(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientHumidityMonitoringSeries_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempWarmThermalMonitoring")]
        public IActionResult GetAmbientTempWarmThermalMonitoring(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientThermalMonitoringSeries_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/ColdThermalMonitoring")]
        public IActionResult GetColdThermalMonitoringSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_ThermalMonitoringSeries_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientColdThermalMonitoring")]
        public IActionResult GetAmbientColdThermalMonitoring(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientHumidityMonitoringSeries_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempColdThermalMonitoring")]
        public IActionResult GetAmbientTempColdThermalMonitoring(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Trends_AmbientThermalMonitoringSeries_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringHot")]
        public IActionResult ConsolidatedThermalMonitoringHot()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_Trends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientConsolidatedThermalMonitoringHot")]
        public IActionResult AmbientConsolidatedThermalMonitoringHot()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoring_Trends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempConsolidatedThermalMonitoringHot")]
        public IActionResult AmbientTempConsolidatedThermalMonitoringHot()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoring_Trends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringWarm")]
        public IActionResult ConsolidatedThermalMonitoringWarm()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_Trends_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientConsolidatedThermalMonitoringWarm")]
        public IActionResult AmbientConsolidatedThermalMonitoringWarm()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoring_Trends_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempConsolidatedThermalMonitoringWarm")]
        public IActionResult AmbientTempConsolidatedThermalMonitoringWarm()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoring_Trends_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringCold")]
        public IActionResult ConsolidatedThermalMonitoringCold()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_Trends_Cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientConsolidatedThermalMonitoringCold")]
        public IActionResult AmbientConsolidatedThermalMonitoringCold()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoring_Trends_Cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempConsolidatedThermalMonitoringCold")]
        public IActionResult AmbientTempConsolidatedThermalMonitoringCold()
        {
            try
            {
                object[] parameters = { getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoring_Trends_Cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ThermalMonitoringHeatMapHot")]
        public IActionResult ThermalMonitoringHeatMapHot(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHeatMap_Trends_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientThermalMonitoringHeatMapHot")]
        public IActionResult AmbientThermalMonitoringHeatMapHot(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoringHeatMap_Trends_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/AmbientTempThermalMonitoringHeatMapHot")]
        public IActionResult AmbientTempThermalMonitoringHeatMapHot(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoringHeatMap_Trends_Hot_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientThermalMonitoringHeatMapCold")]
        public IActionResult AmbientThermalMonitoringHeatMapCold(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoringHeatMap_Trends_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempThermalMonitoringHeatMapCold")]
        public IActionResult AmbientTempThermalMonitoringHeatMapCold(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoringHeatMap_Trends_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/AmbientThermalMonitoringHeatMapWarm")]
        public IActionResult AmbientThermalMonitoringHeatMapWarm(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientHumidityMonitoringHeatMap_Trends_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/AmbientTempThermalMonitoringHeatMapWarm")]
        public IActionResult AmbientTempThermalMonitoringHeatMapWarm(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalMonitoringHeatMap_Trends_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("tends/ThermalMonitoringHeatMapWarm")]
        public IActionResult ThermalMonitoringHeatMapWarm(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHeatMap_Trends_Warm_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("tends/ThermalMonitoringHeatMapCold")]
        public IActionResult ThermalMonitoringHeatMapCold(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHeatMap_Trends_Cold_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ThermalMonitoringContinuousSeries")]
        public IActionResult ThermalMonitoringContinuousSeries(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringContinuousSeries_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/EnergyConsumptionHot")]
        public IActionResult EnergyConsumptionHot()
        {
            try
            {
                object[] parameters = {getLoginId() };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEnergyConsumption_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/EnergyConsumptionWarm")]
        public IActionResult EnergyConsumptionWarm()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEnergyConsumption_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/EnergyConsumptionCold")]
        public IActionResult EnergyConsumptionCold()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEnergyConsumption_Cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringKitchenAssetHot")]
        public IActionResult ConsolidatedThermalMonitoringKitchenAssetHot()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_KitchenAsset_Trends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringKitchenAssetWarm")]
        public IActionResult ConsolidatedThermalMonitoringKitchenAssetWarm()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_KitchenAsset_Trends_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ConsolidatedThermalMonitoringKitchenAssetCold")]
        public IActionResult ConsolidatedThermalMonitoringKitchenAssetCold()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_KitchenAsset_Trends_Warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tends/ThermalMonitoringAssetRules")]
        public IActionResult GetThermalMonitoringAssetRules(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_AssetRules, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("reports/hvac")]
        public IActionResult GetThermalHVACReport()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_hvac_report, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("reports/ambient")]
        public IActionResult GetThermalAmbientReport()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_ambient_report, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("reports/kitchenasset")]
        public IActionResult GetThermalKitchenAssetReport()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoring_kitchenasset_report, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetSiteName")]
        public IActionResult GetSiteName(int assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSiteName, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        #endregion

        #region Hvac thermal trends

        [HttpGet]
        [Route("GetHVACAssetLists")]
        public IActionResult GetHVACAssetLists()
        {
            try
            {
                object[] parameters = {  };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHVACAssetList, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_AverageTrends_Hot")]
        public IActionResult GetThermalMonitoringHVAC_AverageTrends_Hot( string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_AverageTrends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_live_ByAssetId")]
        public IActionResult GetThermalMonitoringHVAC_live_ByAssetId(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_live_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_live_ByAssetId_warm")]
        public IActionResult GetThermalMonitoringHVAC_live_ByAssetId_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_live_ByAssetId_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_live_ByAssetId_cold")]
        public IActionResult GetThermalMonitoringHVAC_live_ByAssetId_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_live_ByAssetId_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_AverageTrends_cold")]
        public IActionResult GetThermalMonitoringHVAC_AverageTrends_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_AverageTrends_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringHVAC_AverageTrends_warm")]
        public IActionResult GetThermalMonitoringHVAC_AverageTrends_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringHVAC_AverageTrends_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        #endregion


        #region Ambient thermal trends

        [HttpGet]
        [Route("GetAmbientThermalAssetList")]
        public IActionResult GetAmbientThermalAssetList()
        {
            try
            {
                object[] parameters = { };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAmbientThermalAssetList, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_AverageTrends_cold")]
        public IActionResult GetThermalMonitoringAmbient_AverageTrends_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_AverageTrends_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_AverageTrends_warm")]
        public IActionResult GetThermalMonitoringAmbient_AverageTrends_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_AverageTrends_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_AverageTrends_Hot")]
        public IActionResult GetThermalMonitoringAmbient_AverageTrends_Hot(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_AverageTrends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_live_ByAssetId_warm")]
        public IActionResult GetThermalMonitoringAmbient_live_ByAssetId_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_live_ByAssetId_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_live_ByAssetId_cold")]
        public IActionResult GetThermalMonitoringAmbient_live_ByAssetId_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_live_ByAssetId_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetThermalMonitoringAmbient_live_ByAssetId")]
        public IActionResult GetThermalMonitoringAmbient_live_ByAssetId(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetThermalMonitoringAmbient_live_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion




        #region Ambient Humidity trends

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_AverageTrends_cold")]
        public IActionResult GetHumidityMonitoringAmbient_AverageTrends_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_AverageTrends_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_AverageTrends_warm")]
        public IActionResult GetHumidityMonitoringAmbient_AverageTrends_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_AverageTrends_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_AverageTrends_Hot")]
        public IActionResult GetHumidityMonitoringAmbient_AverageTrends_Hot(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_AverageTrends_Hot, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_live_ByAssetId_cold")]
        public IActionResult GetHumidityMonitoringAmbient_live_ByAssetId_cold(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_live_ByAssetId_cold, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_live_ByAssetId_warm")]
        public IActionResult GetHumidityMonitoringAmbient_live_ByAssetId_warm(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_live_ByAssetId_warm, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetHumidityMonitoringAmbient_live_ByAssetId")]
        public IActionResult GetHumidityMonitoringAmbient_live_ByAssetId(string assetid)
        {
            try
            {
                object[] parameters = { assetid };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetHumidityMonitoringAmbient_live_ByAssetId, parameters);

                return Ok(_response);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        #endregion


        #region Private Methods

        private string getType(int duration)
        {
            switch (duration)
            {
                case 30:
                    return "warm";
                case 90:
                    return "cold";
                default:
                    return "hot";
            };
        }

        private string getLoginId()
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            //validate jwt token here
            string Key = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Key"));
            string Issuer = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Issuer"));
            string Audience = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Audience"));
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Key);
            tokenHandler.ValidateToken(authHeader.Parameter, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = Issuer,
                ValidAudience = Audience
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "LoginId").Value;
            return userClaim;

        }

        #endregion


    }
}
