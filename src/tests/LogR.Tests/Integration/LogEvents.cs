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
        public async Task CanLogEventsUsingApiWithValidMediaType()
        {
            var logEvent = @"{""@t"":""2018-01-01T12:00:00.000Z"",""@l"":""Information"",""@mt"":""Hi, {user}!"",""name"":""myapp"",""user"":""Alice""}";

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

        [Fact]
        public async Task CanLogEventsUsingApiWithValidQueryStringParameter()
        {
            var logEvent = @"{""@t"":""2018-01-01T12:00:00.000Z"",""@l"":""Information"",""@mt"":""Hi, {user}!"",""name"":""myapp"",""user"":""Alice""}";

            using (var client = new HttpClient())
            using (var content = new StringContent(logEvent, Encoding.UTF8))
            {
                // act
                using (var response = await client.PostAsync(new Uri(this.ServerUri + "/api/events/raw?clef=true"), content).ConfigureAwait(false))
                {
                    // assert
                    response.StatusCode.Should().Be(HttpStatusCode.Created);
                }
            }
        }

        // CanLogEventsUsingSerilog
        // CannotLogEventsWithInvalidMediaType
    }
}
