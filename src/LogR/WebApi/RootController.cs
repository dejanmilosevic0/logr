﻿// Copyright (c) Lykke Corp.
// See the LICENSE file in the project root for more information.

namespace LogR.WebApi
{
    using System.Diagnostics;
    using System.Reflection;
    using Microsoft.AspNetCore.Mvc;

    [Route("api")]
    public class RootController : Controller
    {
        private static readonly object Version =
            new
            {
                Title = typeof(Program).Assembly.Attribute<AssemblyTitleAttribute>(attribute => attribute.Title),
                Version = typeof(Program).Assembly.Attribute<AssemblyInformationalVersionAttribute>(attribute => attribute.InformationalVersion),
                OS = System.Runtime.InteropServices.RuntimeInformation.OSDescription.TrimEnd(),
                ProcessId = Process.GetCurrentProcess().Id,
            };

        [HttpGet]
        public IActionResult Get() => this.Ok(Version);
    }
}
