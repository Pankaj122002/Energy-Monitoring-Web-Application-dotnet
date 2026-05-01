using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Abstractions.Repositories;


namespace ComplaintMTG.Core.SERVICES
{
    public class DataService : IData<GResposnse>
    {
        private IRepository<GResposnse> _masterRepository1;
        // private IRepository<DeviceInfo> _masterRepository2;

        public DataService(IRepository<GResposnse> masterRepository1)
        {

            this._masterRepository1 = masterRepository1;



        }
        public GResposnse AddAndUpdate(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingle(spQuery, Param);
        }
        public string GetAllRow(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicList(spQuery, Param);
        }


    }
}
