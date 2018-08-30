namespace Serilog
{
    using System;
    using Serilog.Configuration;
    using Serilog.Sinks.Test;

    public static class TestLoggerConfigurationExtensions
    {
        public static LoggerConfiguration Test(this LoggerSinkConfiguration sinkConfiguration)
        {
            if (sinkConfiguration == null)
            {
                throw new ArgumentNullException(nameof(sinkConfiguration));
            }

            return sinkConfiguration.Sink(new TestSink());
        }
    }
}