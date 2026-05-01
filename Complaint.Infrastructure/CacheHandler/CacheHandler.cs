using System;
//using System.Runtime.Caching;

namespace ComplaintMGT.Infrastructure.CacheHandler
{
    public class CacheHandler //: ComplaintMGT.Abstractions.ICacheHandler
    {
        //private static readonly ObjectCache cache;
        //static CacheHandler()
        //{
        //    cache = MemoryCache.Default;
        //}

        //public object GetItem(string key)
        //{
        //    var cachedObject = cache[key];
        //    return cachedObject;
        //}

        //public void RemoveItem(string key)
        //{
        //    if (cache.Contains(key))
        //        cache.Remove(key);
        //}

        //public void AddOrUpdateWithSlidingExpiration(string key, object dataToCache)
        //{
            
        //}

        //public void AddOrUpdateWithAbslouteExpiration(string key, object dataToCache, int minutesToCache)
        //{
        //    this.RemoveItem(key);
        //    if (dataToCache != null)
        //    {
        //        CacheItemPolicy policy = new CacheItemPolicy();
        //        policy.AbsoluteExpiration = DateTimeOffset.UtcNow.AddMinutes(minutesToCache);
        //        cache.Set(key, dataToCache, policy);
        //    }
        //}

        //public void AddOrUpdateWithAbslouteExpiration(string key, object dataToCache)
        //{
        //    AddOrUpdateWithAbslouteExpiration( key,  dataToCache, 240);
        //}
    }
}
