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

            // LINK (Cameron): https://github.com/serilog/serilog-sinks-seq/blob/9fe533663448c5ca799c4bb3d3e57c9ca6ed302b/src/Serilog.Sinks.Seq/Sinks/Seq/SeqApi.cs#L37
            return new ContentResult
            {
                Content = @"{""MinimumLevelAccepted"":null}",
                ContentType = "application/json",
                StatusCode = (int)HttpStatusCode.Created,
            };
        }
    }
}
