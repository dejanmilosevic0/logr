// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace Serilog.Sinks.Test
{
    using System;
    using System.Collections.Concurrent;
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
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

        public void Emit(LogEvent logEvent) => this.logEvents.Push(logEvent);

        public void Dispose() =>
            Task.Run(
                async () =>
                {
                    await Task.Delay(500).ConfigureAwait(false);
                    this.host.Dispose();
                });

        private void Configure(IApplicationBuilder app)
        {
            var formatter = new CompactJsonFormatter();

            app.Run(
                ctx =>
                {
                    if (ctx.Request.Method == "GET")
                    {
                        ctx.Response.StatusCode = 200;
                        ctx.Response.ContentType = "application/vnd.serilog.clef";

                        using (var writer = new StreamWriter(ctx.Response.Body, System.Text.Encoding.UTF8))
                        {
                            while (this.logEvents.TryPop(out var logEvent))
                            {
                                formatter.Format(logEvent, writer);
                            }
                        }

                        ctx.Response.Body.Flush();
                    }
                    else if (ctx.Request.Method == "DELETE")
                    {
                        this.logEvents.Clear();
                    }
                    else
                    {
                        ctx.Response.StatusCode = (int)HttpStatusCode.NotImplemented;
                    }

                    return Task.CompletedTask;
                });
        }
    }
}
