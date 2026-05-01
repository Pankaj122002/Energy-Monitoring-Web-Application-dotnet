using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Abstractions.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMTG.Core.SERVICES
{
    public class DeviceService : IDevice<GResposnse,AssetInfo,DeviceInfo,AssetRulesInfo,AssetOverrideInfo>
    {
        private IRepository<GResposnse> _masterRepository1;
        private IRepository<AssetInfo> _masterRepository2;
        private IRepository<DeviceInfo> _masterRepository3;
        private IRepository<AssetRulesInfo> _masterRepository4;
        private IRepository<AssetOverrideInfo> _masterRepository5;
        public DeviceService(IRepository<GResposnse> masterRepository1, IRepository<AssetInfo> masterRepository2, IRepository<DeviceInfo> masterRepository3, IRepository<AssetRulesInfo> masterRepository4, IRepository<AssetOverrideInfo> masterRepository5)
        {

            this._masterRepository1 = masterRepository1;
            this._masterRepository2 = masterRepository2;
            this._masterRepository3 = masterRepository3;
            this._masterRepository4 = masterRepository4;
            this._masterRepository5 = masterRepository5;
           
        }

        public GResposnse AddAndUpdateAssetType(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingle(spQuery, Param);
        } 
        public string GetAllAssetType(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicList(spQuery, Param);
        }
        public string DeleteAssetType(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingleDynamic(spQuery, Param);
        }
        public AssetInfo GetAssetById(string spQuery, object[] Param)
        {
            return _masterRepository2.ExecuteQuerySingle(spQuery, Param);
        }
        public AssetRulesInfo GetAssetRulesByAssetRulesId(string spQuery, object[] Param)
        {
            return _masterRepository4.ExecuteQuerySingle(spQuery, Param);
        }
        public DeviceInfo GetDeviceDetailsByDeviceId(string spQuery, object[] Param)
        {
            return _masterRepository3.ExecuteQuerySingle(spQuery, Param);
        }
        public AssetOverrideInfo GetAssetOverrideByAssetOverrideId(string spQuery, object[] Param)
        {
            return _masterRepository5.ExecuteQuerySingle(spQuery, Param);
        }
    }
}
