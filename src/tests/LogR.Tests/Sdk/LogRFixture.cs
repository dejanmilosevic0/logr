// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.Tests.Sdk
{
    using System;
    using System.Diagnostics;
    using System.Globalization;
    using System.IO;
    using System.Net.Http;
    using System.Threading;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Serialization;

    public sealed class LogRFixture : IDisposable
    {
        private static readonly string DockerContainerId = Guid.NewGuid().ToString("N", CultureInfo.InvariantCulture).Substring(12);

        private readonly Process process;

        public LogRFixture()
        {
            var configFile = Path.Combine(Path.GetDirectoryName(typeof(LogRFixture).Assembly.Location), "testsettings.json");
            var config = new ConfigurationBuilder().AddJsonFile(configFile).Build();

            this.ServerUri = config.GetValue<string>("serverUri");

            this.process = this.StartProcessFromSource(this.ServerUri);
        }

#pragma warning disable CA1056
        public string ServerUri { get; }

        public void Dispose()
        {
            try
            {
                this.process.Kill();
            }
            catch (InvalidOperationException)
            {
            }

            this.process.Dispose();
        }

        private static JsonSerializerSettings GetJsonSerializerSettings()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new SnakeCaseNamingStrategy() },
                NullValueHandling = NullValueHandling.Ignore,
            };

            settings.Converters.Add(new StringEnumConverter());

            return settings;
        }

        [DebuggerStepThrough]
        private Process StartProcessFromSource(string serverUri)
        {
            var path = string.Format(
                CultureInfo.InvariantCulture,
                "..{0}..{0}..{0}..{0}..{0}LogR{0}LogR.csproj",
                Path.DirectorySeparatorChar);

            Process.Start(
                new ProcessStartInfo("dotnet", $"run -p {path}")
                {
                    UseShellExecute = true,
                });

            var processId = default(int);
            using (var client = new HttpClient())
            {
                var attempt = 0;
                while (true)
                {
                    Thread.Sleep(500);
                    try
                    {
                        using (var response = client.GetAsync(new Uri(serverUri + "/api")).GetAwaiter().GetResult())
                        {
                            var api = JsonConvert.DeserializeObject<Api>(response.Content.ReadAsStringAsync().GetAwaiter().GetResult(), GetJsonSerializerSettings());
                            processId = int.Parse(api.ProcessId, CultureInfo.InvariantCulture);
                        }

                        break;
                    }
                    catch (HttpRequestException)
                    {
                        if (++attempt >= 20)
                        {
                            throw;
                        }
                    }
                }
            }

            return Process.GetProcessById(processId);
        }

#pragma warning disable CA1812
        private class Api
        {
            public string ProcessId { get; set; }
        }
    }
}