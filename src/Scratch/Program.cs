namespace Scratch
{
    using System;
    using Serilog;
    using Serilog.Events;
    using Serilog.Parsing;

    class Program
    {
        static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Seq("http://localhost:5001")
                .CreateLogger();

            var timestamp = DateTime.Now;
            var level = LogEventLevel.Information;
            var exception = new Exception("Boom!");
            var messageTemplate = new MessageTemplateParser().Parse("Hello {username}, this is a formatted number {number:#,##0.00}!");
            var properties = new[] 
            {
                new LogEventProperty("username", new ScalarValue("Cameron")),
                new LogEventProperty("number", new ScalarValue(1234.5)),
            };

            var logEvent = new LogEvent(timestamp, level, exception, messageTemplate, properties);

            Log.Write(logEvent);

            Log.CloseAndFlush();
        }
    }
}
