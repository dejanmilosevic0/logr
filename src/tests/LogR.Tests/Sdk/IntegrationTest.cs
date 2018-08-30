// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.Tests.Sdk
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Xunit;

    [Collection("LogR")]
    public class IntegrationTest
    {
        private readonly LogRFixture fixture;

        public IntegrationTest(LogRFixture fixture)
        {
            this.fixture = fixture;
            this.ClearServerLogEvents().GetAwaiter().GetResult();
        }

#pragma warning disable CA1056
        protected string ServerUri => this.fixture.ServerUri;

        protected async Task ClearServerLogEvents()
        {
            using (var client = new HttpClient())
            using (var response = await client.DeleteAsync(new Uri("http://localhost:5002/")).ConfigureAwait(false))
            {
                var data = response.Content.ReadAsStringAsync();
            }
        }

        protected async Task<IEnumerable<string>> GetServerLogEvents()
        {
            // NOTE (Cameron) The log sink on the server side is async. Let's giv it some time.
            await Task.Delay(500).ConfigureAwait(false);

            using (var client = new HttpClient())
            using (var response = await client.GetAsync(new Uri("http://localhost:5002/")).ConfigureAwait(false))
            {
                var data = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                return data.Split("\r\n", StringSplitOptions.RemoveEmptyEntries);
            }
        }
    }
}
