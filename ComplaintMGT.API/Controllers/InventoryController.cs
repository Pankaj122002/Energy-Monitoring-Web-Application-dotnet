using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Inventory;
using ComplaintMTG.Core.Utils;

namespace ComplaintMGTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private IInventory<GResposnse, OrderInfo> _dataRepository;
        public InventoryController(IInventory<GResposnse, OrderInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpPost]
        [Route("AddOrUpdateOrder")]
        public IActionResult AddOrUpdateOrder(OrderInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.OrderId>0?obj.OrderId:0,
                                          obj.CustomerId,
                                          obj.SiteId,
                                          obj.AssetId,
                                          obj.StatusId,
                                          obj.Quantity,
                                          obj.Price,
                                          obj.Discount,
                                          obj.ApplicablePrice,
                                          obj.IsActive,
                                          obj.CreateBy
                                         
                                          

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateOrders, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllOrder")]
        public IActionResult GetAllOrder()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.sp_GetAllOrder, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        [HttpGet]
        [Route("GetOrderByOrderId")]
        public IActionResult GetOrderByOrderId(string param)
        {

            try
            {

                object[] parameters = { param };
                OrderInfo Result = _dataRepository.GetOrderById(StoredProcedureHelper.sp_GetAllOrderByOrderId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteOrder")]
        public IActionResult DeleteOrder(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteOrder, parameters);
                    var response = new { data = Result, Status = 200 };
                    return Ok(response);
                }
                catch (Exception e)
                {
                    return Ok(CommonHelper.InvalidRequestMessage());
                }
            }
            else
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }
        }
    }
}
