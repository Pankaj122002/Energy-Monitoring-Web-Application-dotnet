using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Repositories;

namespace ComplaintMTG.Core.SERVICES
{
    public class ConfigurationService : IConfiguration<Menu,GResposnse,SubMenuInfo>
    {
        private IRepository<Menu> _masterRepository1;
        private IRepository<GResposnse> _masterRepository2;
        private IRepository<SubMenuInfo> _masterRepository3;
        public ConfigurationService(IRepository<Menu> masterRepository1, IRepository<GResposnse> masterRepository2, IRepository<SubMenuInfo> masterRepository3)
        {
           
            this._masterRepository1 = masterRepository1;
            this._masterRepository2 = masterRepository2;
            this._masterRepository3 = masterRepository3;
        }
        public GResposnse AddAndUpdate(string spQuery, object[] Param)
        {
            return _masterRepository2.ExecuteQuerySingle(spQuery, Param);
        }
        public Menu GetMenuById(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingle(spQuery, Param);
        }
        public SubMenuInfo GetSubMenuById(string spQuery, object[] Param)
        {
            return _masterRepository3.ExecuteQuerySingle(spQuery, Param);
        }
        public string ExcuteRowSqlCommand(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicList(spQuery, Param);
        }
        public string ExcuteRowSqlCommandMultiResultSet(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQueryDynamicListMultiResultSet(spQuery, Param);
        }
        public string ExcuteSingleRowSqlCommand(string spQuery, object[] Param)
        {
            return _masterRepository1.ExecuteQuerySingleDynamic(spQuery, Param);
        }
        public string ExcuteDataTableRowSqlCommand(string spQuery, SqlParameter[] Param)
        {
            return _masterRepository1.ExecuteQuerySingleDataTableDynamic(spQuery, Param);
        }
    }
}
