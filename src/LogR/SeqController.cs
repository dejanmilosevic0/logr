namespace CustomLogger
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Serilog;
    using Serilog.Events;
    using Serilog.Formatting.Compact.Reader;

    public class SeqController : Controller
    {
        public const string ClefMediaType = "application/vnd.serilog.clef";

        [HttpPost]
        [Route("api/events/raw")]
        public IActionResult LogEvent([FromQuery] bool clef)
        {
            var success = clef || this.Request.ContentType?.StartsWith(ClefMediaType) == true
                ? TryParseClefBody(this.Request.Body, out IEnumerable<LogEvent> logEvents, out string errorMessage)
                : RawFormatLogEventReader.TryParseRawFormatBody(this.Request.Body, out logEvents, out errorMessage);

            if (!success)
            {
                return this.BadRequest(errorMessage);
            }

            foreach (var logEvent in logEvents)
            {
                Log.Write(logEvent);
            }

            return this.StatusCode((int)HttpStatusCode.Created);
        }

        private static bool TryParseClefBody(Stream stream, out IEnumerable<LogEvent> logEvents, out string errorMessage)
        {
            var list = new List<LogEvent>();

            using (var streamReader = new StreamReader(stream))
            using (var logEventReader = new LogEventReader(streamReader))
            {
                try
                {
                    while (logEventReader.TryRead(out var logEvent))
                    {
                        list.Add(logEvent);
                    }
                }
                catch (Exception ex)
                {
                    logEvents = null;
                    errorMessage = ex.Message;
                    return false;
                }
            }

            logEvents = list.ToArray();
            errorMessage = default;
            return true;
        }
    }
}
