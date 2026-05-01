using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.Services
{
    public interface ISite<T1,T2,T3,T4>
    {
        T1 AddAndUpdate(string spQuery, object[] Param);
        string GetAll(string spQuery, object[] Param);
        string Delete(string spQuery, object[] Param);
        T2 GetSiteById(string spQuery, object[] Param);
        T3 GetSiteInformationBySiteInformationId(string spQuery, object[] Param); 
        T4 GetSiteInformationBaselineBySiteInformationBaselineId(string spQuery, object[] Param);
    }
}
