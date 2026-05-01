using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Services
{

    public interface IConfiguration<T1, T2, T3>
    {
        T1 GetMenuById(string spQuery, object[] Param);
       T2 AddAndUpdate(string spQuery, object[] Param);
        T3 GetSubMenuById(string spQuery, object[] Param);
        
        string ExcuteRowSqlCommand(string spQuery, object[] Param);
        string ExcuteRowSqlCommandMultiResultSet(string spQuery, object[] Param);
        string ExcuteSingleRowSqlCommand(string spQuery, object[] Param);
        string ExcuteDataTableRowSqlCommand(string spQuery, SqlParameter[] Param);

       

    }
}
