// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.WebApi
{
    using System;
    using System.IO;
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Serilog;
    using Serilog.Formatting.Compact.Reader;

    public class LogEventsController : Controller
    {
        public const string ClefMediaType = "application/vnd.serilog.clef";

        [HttpPost]
        [Route("api/events/raw")]
        public IActionResult LogEvent([FromQuery] bool clef)
        {
            var isValidMediaType = clef || this.Request.ContentType?.StartsWith(ClefMediaType, StringComparison.OrdinalIgnoreCase) == true;
            if (!isValidMediaType)
            {
                return this.StatusCode((int)HttpStatusCode.UnsupportedMediaType);
            }

            using (var streamReader = new StreamReader(this.Request.Body))
            using (var logEventReader = new LogEventReader(streamReader))
            {
                try
                {
                    while (logEventReader.TryRead(out var logEvent))
                    {
                        Log.Write(logEvent);
                    }
                }
                catch (Exception ex)
                {
                    return this.BadRequest(ex.Message);
                }
            }

            return this.StatusCode((int)HttpStatusCode.Created);
        }
    }
}
