using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Abstractions.ExtensionMethods
{
    public static class CommonExtensions
    {
        public static int? DefaultValue(this int? i)
        {
            if (i == 0)
                return null;
            return i;
        }
        public static decimal? DefaultValue(this decimal? i)
        {
            if (i == 0)
                return null;
            return i;
        }
    }
}
