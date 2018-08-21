namespace CustomLogger
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Newtonsoft.Json.Linq;
    using Serilog.Events;
    using Serilog.Parsing;

    internal class StorageEventNormalizer
    {
        public const string ClefMediaType = "application/vnd.serilog.clef";

        private static readonly MessageTemplateParser MessageTemplateParser = new MessageTemplateParser();
        private static readonly HashSet<string> ClefReifiedProperties = new HashSet<string>
        {
            "@t",
            "@m",
            "@mt",
            "@l",
            "@x",
            "@i",
            "@r"
        };

        public static bool FromClefFormat(int lineNumber, JObject jObject, out LogEvent logEvent, out string error)
        {
            if (jObject == null)
            {
                throw new ArgumentNullException(nameof(jObject));
            }

            logEvent = default;

            var timestamp = default(DateTime);
            var level = LogEventLevel.Information;
            var exception = default(Exception);
            var messageTemplate = default(MessageTemplate);
            var properties = new List<LogEventProperty>();

            // timestamp
            var timestampToken = jObject["@t"];
            if (timestampToken == null)
            {
                error = $"The event on line {lineNumber} does not carry an `@t` timestamp property.";
                return false;
            }
            else if (timestampToken.Type != JTokenType.String)
            {
                error = $"The event on line {lineNumber} has an invalid `@t` timestamp property; the value must be a JSON string.";
                return false;
            }
            else if (!DateTimeOffset.TryParse(timestampToken.Value<string>(), CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var dateTimeOffset))
            {
                error = $"The timestamp value '{timestampToken}' on line {lineNumber} could not be parsed.";
                return false;
            }
            else
            {
                timestamp = dateTimeOffset.ToUniversalTime().DateTime;
            }

            // exception
            var exceptionToken = jObject["@x"];
            if (exceptionToken == null)
            {
            }
            else if (exceptionToken.Type != JTokenType.String)
            {
                error = $"The event on line {lineNumber} has a non-string `@x` exception property.";
                return false;
            }
            else
            {
                // TODO (Cameron): Some magic.
                exception = new FakeException(exceptionToken.Value<string>());
            }

            // level
            var levelToken = jObject["@l"];
            if (levelToken == null)
            {
            }
            else if (levelToken.Type != JTokenType.String)
            {
                error = $"The event on line {lineNumber} has a non-string `@l` level property.";
                return false;
            }
            else if (!Enum.TryParse(levelToken.Value<string>(), out level))
            {
                error = $"The level value '{levelToken}' on line {lineNumber} could not be parsed.";
                return false;
            }

            // message
            var messageToken = jObject["@m"];
            if (messageToken == null)
            {
            }
            else if (messageToken.Type != JTokenType.String)
            {
                error = $"The event on line {lineNumber} has a non-string `@m` message property.";
                return false;
            }
            else
            {
                messageTemplate = MessageTemplateParser.Parse(messageToken.Value<string>());
            }

            // message template
            var messageTemplateToken = jObject["@mt"];
            if (messageTemplateToken == null)
            {
            }
            else if (messageTemplateToken.Type != JTokenType.String)
            {
                error = $"The event on line {lineNumber} has a non-string `@mt` message template property.";
                return false;
            }
            else
            {
                messageTemplate = MessageTemplateParser.Parse(messageTemplateToken.Value<string>());
            }

            // properties
            var propertyTokens = new Dictionary<string, JToken>();
            foreach (var property in jObject.Properties())
            {
                if (property.Name.StartsWith("@@"))
                {
                    propertyTokens.Add(property.Name.Substring(1), property.Value);
                }
                else if (!ClefReifiedProperties.Contains(property.Name))
                {
                    propertyTokens.Add(property.Name, property.Value);
                }
            }

            var renderingsByProperty = default(Dictionary<string, Dictionary<string, string>>);

            // renderings
            var renderingsToken = jObject["@r"];
            if (renderingsToken != null)
            {
                var tokens = messageTemplate.Tokens.OfType<PropertyToken>().Where(propertyToken => propertyToken.Format != null);
                if (tokens.Any())
                {
                    renderingsByProperty =
                        tokens.Zip(
                            renderingsToken,
                            (PropertyToken p, JToken j) => 
                            new
                            {
                                p.PropertyName,
                                p.Format,
                                Rendering = j.Value<string>()
                            })
                            .GroupBy(g => g.PropertyName)
                            .ToDictionary(g => g.Key, g => g.ToDictionaryDistinct(p => p.Format, p => p.Rendering));

                    foreach (KeyValuePair<string, Dictionary<string, string>> renderingByProperty in renderingsByProperty)
                    {
                        //JArray jArray = new JArray();

                        //new LogEventProperty()

                        //    jObject4.Add(renderingByProperty.Key, jArray);
                        //foreach (KeyValuePair<string, string> item3 in renderingByProperty.Value)
                        //{
                        //    JObject jObject5 = new JObject();
                        //    jObject5.Add("Format", item3.Key);
                        //    jObject5.Add("Rendering", item3.Value);
                        //    jArray.Add(jObject5);
                        //}
                    }
                }
            }

            //propertyTokens.Values.Select(v => CreateProperty(v.Nam))

            //IEnumerable<LogEventProperty> source = from jp in jObjectProperties.Properties()
            //                                       select CreateProperty(jp.Name, jp.Value, renderingsByProperty);

            //jObject2.Add("RenderedMessage", messageTemplate.Render((IReadOnlyDictionary<string, LogEventPropertyValue>)source.ToDictionary((LogEventProperty p) => p.Name, (LogEventProperty p) => p.Value), (IFormatProvider)null));

            //if (text != null)
            //{
            //    jObject2.Add("RenderedMessage", text);
            //}
            //else if (text2 != null)
            //{
            //}
            //if (text2 == null)
            //{
            //    text2 = (text ?? "No template provided");
            //}
            //jObject2.Add("MessageTemplate", text2);

            // event id
            var eventIdToken = jObject["@i"];
            if (eventIdToken == null)
            {
            }
            else if (eventIdToken.Type == JTokenType.Integer)
            {
                properties.Add(new LogEventProperty("EventId", new ScalarValue(eventIdToken.Value<long>())));
            }
            else if (eventIdToken.Type != JTokenType.String)
            {
                error = $"The `@i` event type value on line {lineNumber} is not in a string or numeric format.";
                return false;
            }
            else
            {
                properties.Add(new LogEventProperty("EventId", new ScalarValue(eventIdToken.Value<string>())));
            }

            logEvent = new LogEvent(timestamp, level, exception, messageTemplate, properties);

            error = default;
            return true;
        }

        public static bool FromRawFormat(JObject logObject, out LogEvent logEvent, out string error)
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
            var properties = default(IEnumerable<LogEventProperty>);

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
                // TODO (Cameron): Some magic.
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

            properties = propertiesObject == null
                ? Enumerable.Empty<LogEventProperty>()
                : propertiesObject.Properties().Select(jp => CreateProperty(jp.Name, jp.Value, renderingsByProperty));

            logEvent = new LogEvent(timestamp, level, exception, messageTemplate, properties);

            error = default;
            return true;
        }

        private static LogEventProperty CreateProperty(string name, JToken value, Dictionary<string, Dictionary<string, string>> renderings = null)
        {
            if (renderings == null || !renderings.TryGetValue(name, out Dictionary<string, string> value2))
            {
                value2 = new Dictionary<string, string>();
            }

            var val = ReadValue(value);
            return new LogEventProperty(name, new ScalarValue(val)); // new LogEventPropertyObjectValue(val, value2));
        }

        private static void CleanseNumerics(JToken token)
        {
            switch (token.Type)
            {
                case JTokenType.Array:
                    {
                        JArray jArray = (JArray)token;
                        for (int i = 0; i < jArray.Count; i++)
                        {
                            JToken token2 = jArray[i];
                            if (TryCleanseNumeric(token2, out JToken cleansed2))
                            {
                                jArray[i] = cleansed2;
                            }
                            else
                            {
                                CleanseNumerics(token2);
                            }
                        }
                        break;
                    }
                case JTokenType.Object:
                    foreach (JProperty item in ((JObject)token).Properties())
                    {
                        if (TryCleanseNumeric(item.Value, out JToken cleansed))
                        {
                            item.Value = cleansed;
                        }
                        else
                        {
                            CleanseNumerics(item.Value);
                        }
                    }
                    break;
            }
        }

        private static bool TryCleanseNumeric(JToken token, out JToken cleansed)
        {
            if (token.Type == JTokenType.Float)
            {
                double num = token.Value<double>();
                if (double.IsNaN(num))
                {
                    cleansed = new JValue("NaN");
                    return true;
                }
                if (double.IsInfinity(num))
                {
                    cleansed = new JValue("Infinity");
                    return true;
                }
                if (num > 7.9228162514264338E+28)
                {
                    cleansed = new JValue(num.ToString("R"));
                    return true;
                }
                if (num < -7.9228162514264338E+28)
                {
                    cleansed = new JValue(num.ToString("R"));
                    return true;
                }
            }
            cleansed = null;
            return false;
        }

        private static IReadOnlyDictionary<string, object> ReadObject(JObject jObject)
        {
            var dictionary = new Dictionary<string, object>();
            foreach (var jProperty in jObject.Properties())
            {
                dictionary.Add(jProperty.Name, ReadValue(jProperty.Value));
            }

            return dictionary;
        }

        private static object[] ReadArray(JArray jArray)
        {
            var list = new List<object>();
            foreach (var jToken in jArray)
            {
                list.Add(ReadValue(jToken));
            }

            return list.ToArray();
        }

        private static object ReadValue(JToken jToken)
        {
            switch (jToken.Type)
            {
                case JTokenType.Integer:
                        return jToken.Value<long>();
                case JTokenType.String:
                        return jToken.Value<string>();
                case JTokenType.Float:
                    return jToken.Value<float>();
                case JTokenType.Boolean:
                    return jToken.Value<bool>();
                case JTokenType.Null:
                    return null;
                case JTokenType.Array:
                    return ReadArray(jToken as JArray);
                case JTokenType.Object:
                    return ReadObject(jToken as JObject);
                default:
                    throw new NotSupportedException($"Token type {jToken.Type} not supported.");
            }
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
    }
}