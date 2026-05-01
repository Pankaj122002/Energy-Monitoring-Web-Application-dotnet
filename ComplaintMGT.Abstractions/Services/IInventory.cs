using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Services
{
    public interface IInventory<T1,T2>
    {
        T1 AddAndUpdate(string spQuery, object[] Param);
        string GetAll(string spQuery, object[] Param);
        string Delete(string spQuery, object[] Param);
        T2 GetOrderById(string spQuery, object[] Param);
    }
}
