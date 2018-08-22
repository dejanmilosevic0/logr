namespace CustomLogger
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Serilog.Events;
    using Serilog.Parsing;

    internal class RawFormatLogEventReader
    {
        private const string TypeTagPropertyName = "$type";

        private static readonly JsonSerializer Serializer = JsonSerializer.Create(new JsonSerializerSettings { DateParseHandling = DateParseHandling.None });
        private static readonly MessageTemplateParser MessageTemplateParser = new MessageTemplateParser();

        public static bool TryParseRawFormatBody(Stream stream, out IEnumerable<LogEvent> logEvents, out string errorMessage)
        {
            logEvents = null;

            var list = new List<LogEvent>();

            var json = default(JObject);
            try
            {
                json = Serializer.Deserialize<JObject>(new JsonTextReader(new StreamReader(stream)));
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
                if (TryRead(item, out LogEvent logEvent, out errorMessage))
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

        private static bool TryRead(JObject logObject, out LogEvent logEvent, out string error)
        {
            if (logObject == null)
            {
                throw new ArgumentNullException(nameof(logObject));
            }

            logEvent = default;

            var timestamp = default(DateTime);
            var level = LogEventLevel.Information;
            var exception = default(Exception);
            var messageTemplate = default(MessageTemplate);
            var properties = new List<LogEventProperty>();

            // timestamp
            var timestampToken = logObject["Timestamp"];
            if (timestampToken == null)
            {
                error = "Events must carry a `Timestamp` property.";
                return false;
            }
            else if (timestampToken.Type != JTokenType.String)
            {
                error = $"The `Timestamp` property must be a (JSON) string.";
                return false;
            }
            else if (!DateTimeOffset.TryParse(timestampToken.Value<string>(), CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var dateTimeOffset))
            {
                error = $"The timestamp value '{timestampToken}' could not be parsed.";
                return false;
            }
            else
            {
                timestamp = dateTimeOffset.ToUniversalTime().DateTime;
            }

            // exception
            var exceptionToken = logObject["Exception"];
            if (exceptionToken == null)
            {
            }
            else if (exceptionToken.Type != JTokenType.String)
            {
                error = $"The `Exception` property must be a (JSON) string.";
                return false;
            }
            else
            {
                exception = new FakeException(exceptionToken.Value<string>());
            }

            // level
            var levelToken = logObject["Level"];
            if (levelToken == null)
            {
            }
            else if (levelToken.Type != JTokenType.String)
            {
                error = $"The `Level` property must be a (JSON) string.";
                return false;
            }
            else if (!Enum.TryParse(levelToken.Value<string>(), out level))
            {
                error = $"The level value '{levelToken}' could not be parsed.";
                return false;
            }

            // message template
            var messageTemplateToken = logObject["MessageTemplate"];
            if (messageTemplateToken == null)
            {
                error = "Events must contain a `MessageTemplate` property.";
                return false;
            }
            else if (messageTemplateToken.Type != JTokenType.String)
            {
                error = $"The `MessageTemplate` property must be a (JSON) string.";
                return false;
            }
            else
            {
                messageTemplate = MessageTemplateParser.Parse(messageTemplateToken.Value<string>());
            }

            // properties
            var propertiesObject = logObject["Properties"] as JObject;
            if (propertiesObject == null && logObject["Properties"] != null)
            {
                error = "The `Properties` property must be a (JSON) object.";
                return false;
            }

            var renderingsObject = logObject["Renderings"] as JObject;
            if (renderingsObject == null && logObject["Renderings"] != null)
            {
                error = "The `Renderings` property must be a (JSON) object.";
                return false;
            }

            var renderingsByProperty = renderingsObject == null
                ? new Dictionary<string, Dictionary<string, string>>()
                : renderingsObject
                    .Properties()
                    .ToDictionary(
                        (JProperty rp) => rp.Name,
                        (JProperty rp) => rp.Value.Cast<object>().ToDictionaryDistinct((dynamic r) => (string)r.Format, (dynamic r) => (string)r.Rendering));

            foreach (var jProperty in propertiesObject?.Properties())
            {
                renderingsByProperty.TryGetValue(jProperty.Name, out var renderings);
                properties.Add(new LogEventProperty(jProperty.Name, CreatePropertyValue(jProperty.Value, renderings)));
            }

            logEvent = new LogEvent(timestamp, level, exception, messageTemplate, properties);

            error = default;
            return true;
        }

        private static LogEventPropertyValue CreatePropertyValue(JToken jToken, Dictionary<string, string> renderings = null)
        {
            if (jToken.Type == JTokenType.Null)
                return new ScalarValue(null);

            if (jToken is JObject jObject)
            {
                jObject.TryGetValue(TypeTagPropertyName, out JToken tt);

                return new StructureValue(
                    jObject.Properties().Where(kvp => kvp.Name != TypeTagPropertyName).Select(kvp => new LogEventProperty(kvp.Name, CreatePropertyValue(kvp.Value, null))),
                    tt?.Value<string>());
            }

            if (jToken is JArray jArray)
            {
                return new SequenceValue(jArray.Select(v => CreatePropertyValue(v, null)));
            }

            var raw = jToken.Value<JValue>().Value;

            return renderings?.Any() == true ? new RenderableScalarValue(raw, renderings) : new ScalarValue(raw);
        }

        private class FakeException : Exception
        {
            private readonly string exceptionString;

            public FakeException(string exceptionString)
            {
                this.exceptionString = exceptionString;
            }

            public override string ToString() => this.exceptionString;
        }

        private class RenderableScalarValue : ScalarValue
        {
            readonly Dictionary<string, string> renderings;

            public RenderableScalarValue(object value, Dictionary<string, string> renderings)
                : base(value)
            {
                this.renderings = renderings;
            }

            public override void Render(TextWriter output, string format = null, IFormatProvider formatProvider = null)
            {
                if (format != null && renderings.TryGetValue(format, out var rendering))
                {
                    output.Write(rendering);
                }
                else
                {
                    base.Render(output, format, formatProvider);
                }
            }
        }
    }
}