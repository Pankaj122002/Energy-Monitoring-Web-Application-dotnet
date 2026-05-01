using ComplaintMGT.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Linq;
using System.IO;
using Microsoft.Extensions.FileProviders;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class MasterController : Controller
    {
        [CustomAuthorize]
        public IActionResult Designation()
        {
            return View();
        }
        [HttpPost]
        public IActionResult GetAllDesignation()
        {
            string endpoint = "api/Master/GetAllDesignation";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult AddOrUpdateDesignation(string DesignationName,string DesignationId,bool IsActive)
        {

            string CreateBy = this.User.GetUserId();

            var obj = new { DesignationName = DesignationName, DesignationId = DesignationId, IsActive = IsActive, CreateBy = CreateBy };
            string endpoint = "api/Master/AddOrUpdateDesignation";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteDesignation(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Master/DeleteDesignation?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }
        public IActionResult UploadFile()
        {
            string FolderName = Convert.ToString(Request.Form["FolderName"]).Replace('"', ' ').Trim();
            var filename = "";
            GResposnse rst = new GResposnse();
            try
            {
                var files = Request.Form.Files;
                if (files != null)
                {
                    foreach (var file in files)
                    {

                        if (file.Length > 0)
                        {
                            //Getting FileName
                            var fileName = Path.GetFileName(file.FileName);

                            //Assigning Unique Filename (Guid)
                            var myUniqueFileName = Convert.ToString(Guid.NewGuid());

                            //Getting file Extension
                            var fileExtension = Path.GetExtension(fileName);

                            // concatenating  FileName + FileExtension
                            var newFileName = String.Concat(myUniqueFileName, fileExtension);

                            // Combines two strings into a path. Path.Combine("/images/") +
                            var filepath =
                            new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", FolderName)).Root + $@"{newFileName}";
                            var filepath1 = $@"{newFileName}";
                            filename = filepath1;


                            using (FileStream fs = System.IO.File.Create(filepath))
                            {
                                file.CopyTo(fs);
                                fs.Flush();
                            }
                        }


                    }

                }
                rst.Code = filename;
                rst.Msg = "File Uploaded Successfully";
                rst.Result = 1;
            }
            catch (Exception ex)
            {
                rst.Code = "";
                rst.Msg = ex.Message.ToString();
                rst.Result = 0;
            }
            return Json(rst);
        }
    }
}
