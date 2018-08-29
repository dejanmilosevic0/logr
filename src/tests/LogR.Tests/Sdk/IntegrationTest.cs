// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.Tests.Sdk
{
    using Xunit;

    [Collection("LogR")]
    public class IntegrationTest
    {
        private readonly LogRFixture fixture;

        public IntegrationTest(LogRFixture fixture)
        {
            this.fixture = fixture;
        }

#pragma warning disable CA1056
        protected string ServerUri => this.fixture.ServerUri;
    }
}
