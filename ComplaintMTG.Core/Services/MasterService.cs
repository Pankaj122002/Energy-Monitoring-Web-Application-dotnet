using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Abstractions.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ComplaintMTG.Core.SERVICES
{
    public class MasterService : IMaster<GResposnse>
    {
        private IRepository<GResposnse> _masterRepository1;
      
        public MasterService(IRepository<GResposnse> masterRepository1)
        {

            this._masterRepository1 = masterRepository1;

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
    }
}
