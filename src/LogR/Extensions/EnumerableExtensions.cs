// Seq.Server.Util.EnumerableExtensions
using System;
using System.Collections.Generic;

internal static class EnumerableExtensions
{
    public static Dictionary<TKey, TValue> ToDictionaryDistinct<T, TKey, TValue>(this IEnumerable<T> enumerable, Func<T, TKey> keySelector, Func<T, TValue> valueSelector)
    {
        Dictionary<TKey, TValue> dictionary = new Dictionary<TKey, TValue>();
        foreach (T item in enumerable)
        {
            dictionary[keySelector(item)] = valueSelector(item);
        }
        return dictionary;
    }
}