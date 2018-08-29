// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.Tests.Sdk
{
    using Xunit;

    // LINK (Cameron): https://xunit.github.io/docs/shared-context.html
    [CollectionDefinition("LogR")]
    public class LogRCollection : ICollectionFixture<LogRFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
