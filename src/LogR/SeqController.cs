namespace CustomLogger
{
    using System.Collections.Generic;
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Serilog;
    using Serilog.Events;

    public class SeqController : Controller
    {
        [HttpPost]
        [Route("api/events/raw")]
        public IActionResult LogEvent([FromQuery] bool clef)
        {
            var handler = new SeqRawEventsHandler();

            var success = this.Request.ContentType?.StartsWith("application/vnd.serilog.clef") == true || clef
                ? handler.TryParseClefBody(this.Request.Body, out IEnumerable<LogEvent> logEvents, out string errorMessage)
                : handler.TryParseRawFormatBody(this.Request.Body, out logEvents, out errorMessage);

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
    }
}
