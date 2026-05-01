using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;


namespace ComplaintMGT.Abstractions.Services
{
    public interface IDeviceTransaction<T1>
    {
      
        T1 AddAndUpdate(string spQuery, object[] Param);
        string GetAllRow(string spQuery, object[] Param);


    }
}
