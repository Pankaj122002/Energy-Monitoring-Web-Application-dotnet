using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ComplaintMGT.Abstractions.DomainModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using ComplaintMTG.Core.Utils;

namespace ComplaintMGT.Core.CustomAttributes
{
    public class CustomAuthorize : AuthorizeAttribute, IAuthorizationFilter
    {

        public string Permissions { get; set; } //Permission string to get from controller

        public void OnAuthorization(AuthorizationFilterContext context)
        
        {
            string menu = context.HttpContext.User.GetMenuList();
            if (!string.IsNullOrEmpty(menu))
            {
                List<RoleMaster> mList = JsonConvert.DeserializeObject<List<RoleMaster>>(menu);
                if (mList != null)
                {

                    var descriptor = context?.ActionDescriptor as ControllerActionDescriptor;
                    if (descriptor != null)
                    {
                        var actionName = descriptor.ActionName.ToLower();
                        var ctrlName = descriptor.ControllerName.ToLower();

                       // bool isView = mList.Any(x => x.an.ToLower() == actionName && x.cn.ToLower() == ctrlName);
                        bool isView = true;
                        if (isView)
                            return;
                        else
                        {
                            context.Result = new UnauthorizedResult();
                            return;
                        }

                    }
                    else
                    {
                        context.Result = new UnauthorizedResult();
                        return;
                    }
                }
                else
                {
                    context.Result = new UnauthorizedResult();
                    return;
                }
            }
            else
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }
    }
}
