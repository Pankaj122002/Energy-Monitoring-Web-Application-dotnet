using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Abstractions.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ComplaintMTG.Core.SERVICES
{
    public class SiteService : ISite<GResposnse,SiteInfo,SiteInformationInfo,SiteInformationBaselineInfo>
    {
        private IRepository<GResposnse> _masterRepository1;
        private IRepository<SiteInfo> _masterRepository2;
        private IRepository<SiteInformationInfo> _masterRepository3;
        private IRepository<SiteInformationBaselineInfo> _masterRepository4;
        public SiteService(IRepository<GResposnse> masterRepository1, IRepository<SiteInfo> masterRepository2, IRepository<SiteInformationInfo> masterRepository3, IRepository<SiteInformationBaselineInfo> masterRepository4)
        {

            this._masterRepository1 = masterRepository1;
            this._masterRepository2 = masterRepository2;
            this._masterRepository3 = masterRepository3;
            this._masterRepository4 = masterRepository4;

        }

        public GResposnse AddAndUpdate(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingle(spQuery, Param);
        }
        public string GetAll(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicList(spQuery, Param);
        }
        public string Delete(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingleDynamic(spQuery, Param);
        }
        public SiteInfo GetSiteById(string spQuery, object[] Param)
        {
            return _masterRepository2.ExecuteQuerySingle(spQuery, Param);
        } 
        public SiteInformationInfo GetSiteInformationBySiteInformationId(string spQuery, object[] Param)
        {
            return _masterRepository3.ExecuteQuerySingle(spQuery, Param);
        }
        public SiteInformationBaselineInfo GetSiteInformationBaselineBySiteInformationBaselineId(string spQuery, object[] Param)
        {
            return _masterRepository4.ExecuteQuerySingle(spQuery, Param);
        }
    }
}
