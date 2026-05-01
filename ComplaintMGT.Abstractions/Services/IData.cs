using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Services
{
    public interface IData<T1>
    {

        T1 AddAndUpdate(string spQuery, object[] Param);
        string GetAllRow(string spQuery, object[] Param);


    }
}
