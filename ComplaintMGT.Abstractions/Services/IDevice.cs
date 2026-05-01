using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Services
{
    public interface IDevice<T1,T2,T3,T4,T5>
    {
        T1 AddAndUpdateAssetType(string spQuery, object[] Param);
        string GetAllAssetType(string spQuery, object[] Param);
        string DeleteAssetType(string spQuery, object[] Param);
        T2 GetAssetById(string spQuery, object[] Param);
        T3 GetDeviceDetailsByDeviceId(string spQuery, object[] Param);
        T4 GetAssetRulesByAssetRulesId(string spQuery, object[] Param);
        T5 GetAssetOverrideByAssetOverrideId(string spQuery, object[] Param);
    }
}
