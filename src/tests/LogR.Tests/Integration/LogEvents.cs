// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.Tests
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using FluentAssertions;
    using LogR.Tests.Sdk;
    using Xunit;

    public class LogEvents : IntegrationTest
    {
        public LogEvents(LogRFixture fixture)
            : base(fixture)
        {
        }

        [Fact]
        public async Task CanLogEventsUsingApi()
        {
            var logEvent = @"{""@t"":""2018-08-29T13:04:03.045Z"",""@l"":""Information"",""@mt"":""Hi, {user}!"",""name"":""myapp"",""user"":""Alice""}";

            using (var client = new HttpClient())
            using (var content = new StringContent(logEvent, Encoding.UTF8, "application/vnd.serilog.clef"))
            {
                // act
                using (var response = await client.PostAsync(new Uri(this.ServerUri + "/api/events/raw"), content).ConfigureAwait(false))
                {
                    // assert
                    response.StatusCode.Should().Be(HttpStatusCode.Created);
                }
            }
        }
    }
}
