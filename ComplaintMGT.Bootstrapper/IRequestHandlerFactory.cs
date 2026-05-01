using ComplaintMGT.Abstractions.Views;
using System;
using System.Collections.Generic;

namespace ComplaintMGT.Bootstrapper
{
    public interface IRequestHandlerFactory
    {
        IRequestHandler CreateNew(string name);
    }

    public class RequestHandlerFactory : Dictionary<string, Func<IRequestHandler>>, IRequestHandlerFactory
    {
        public IRequestHandler CreateNew(string name)
        {
            if (this.ContainsKey(name))
                return this[name]();
            else
                return null;
        }
    }
}
