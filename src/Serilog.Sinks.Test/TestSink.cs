namespace Serilog.Sinks.Test
{
    using System;
    using System.Collections.Concurrent;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Serilog.Core;
    using Serilog.Events;
    using Serilog.Formatting.Compact;

    public sealed class TestSink : ILogEventSink, IDisposable
    {
        private readonly ConcurrentStack<LogEvent> logEvents = new ConcurrentStack<LogEvent>();
        private readonly object formatter = new RenderedCompactJsonFormatter();
        private readonly IWebHost host;

        public TestSink()
        {
            this.host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://localhost:5002/")
                .Configure(this.Configure)
                .Build();

            this.host.Start();
        }

        public void Emit(LogEvent logEvent)
        {
            this.logEvents.Push(logEvent);
        }

        public void Dispose()
        {
            Task.Run(
                async () =>
                {
                    await Task.Delay(500).ConfigureAwait(false);
                    this.host.Dispose();
                });
        }

        private void Configure(IApplicationBuilder app)
        {
            app.Run(
                async ctx =>
                {
                    if (ctx.Request.Method == "GET")
                    {
                        ctx.Response.StatusCode = 200;
                        ctx.Response.ContentType = "application/vnd.serilog.clef";

                        while (this.logEvents.TryPop(out var logEvent))
                        {
                            CompactJsonFormatter.FormatEvent(logEvent, ctx.Response.st)
                        }
                        await ctx.Response.WriteAsync(.).ConfigureAwait(false);



                        ctx.Response.Body.Flush();
                    }
                    else
                    {
                        ctx.Response.StatusCode = 404;
                    }
                });
        }
    }
}
