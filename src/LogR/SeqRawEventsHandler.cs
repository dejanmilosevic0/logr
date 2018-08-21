namespace CustomLogger
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Serilog.Events;

    internal class SeqRawEventsHandler
    {
        private readonly JsonSerializer _rawSerializer = JsonSerializer.Create(new JsonSerializerSettings { DateParseHandling = DateParseHandling.None });

        public bool TryParseClefBody(Stream stream, out IEnumerable<LogEvent> logEvents, out string errorMessage)
        {
            logEvents = null;

            var list = new List<LogEvent>();

            var streamReader = new StreamReader(stream);
            string text = streamReader.ReadLine();
            int num = 1;
            while (text != null)
            {
                if (!string.IsNullOrWhiteSpace(text))
                {
                    var json = default(JObject);
                    try
                    {
                        json = _rawSerializer.Deserialize<JObject>(new JsonTextReader(new StringReader(text)));
                    }
                    catch (JsonSerializationException)
                    {
                        errorMessage = $"Invalid raw event JSON, item on line {num} could not be parsed.";
                        return false;
                    }

                    if (!StorageEventNormalizer.FromClefFormat(num, json, out LogEvent logEvent, out errorMessage))
                    {
                        return false;
                    }

                    list.Add(logEvent);
                }
                text = streamReader.ReadLine();
                num++;
            }

            logEvents = list.ToArray();
            errorMessage = default;
            return true;
        }

        public bool TryParseRawFormatBody(Stream stream, out IEnumerable<LogEvent> logEvents, out string errorMessage)
        {
            logEvents = null;

            var list = new List<LogEvent>();

            var json = default(JObject);
            try
            {
                json = _rawSerializer.Deserialize<JObject>(new JsonTextReader(new StreamReader(stream)));
            }
            catch (JsonSerializationException)
            {
                errorMessage = "Invalid raw event JSON, body could not be parsed.";
                return false;
            }

            if (json == null || (!json.TryGetValue("events", StringComparison.Ordinal, out JToken jsonToken) && !json.TryGetValue("Events", StringComparison.Ordinal, out jsonToken)))
            {
                errorMessage = "Invalid raw event JSON, body must contain an 'Events' array.";
                return false;
            }

            var jArray = jsonToken as JArray;
            if (jArray == null)
            {
                errorMessage = "Invalid raw event JSON, the 'Events' property must be an array.";
                return false;
            }

            foreach (dynamic item in jArray)
            {
                if (StorageEventNormalizer.FromRawFormat(item, out LogEvent logEvent, out errorMessage))
                {
                    list.Add(logEvent);
                }
                else
                {
                    return false;
                }
            }

            logEvents = list.ToArray();
            errorMessage = default;
            return true;
        }
    }
}