'use strict';
const { Docker } = require('node-docker-api');
const puppeteer = require('puppeteer');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const ora = require('ora');

var test_dotnet, test_nginx, browser;
//const spinner = ora().start();

function dump(m) {
    // spinner.info(m).start();
}

describe('e2e loging', () => {
    test('client logs to dotnet server correctly', async (done) => {

        await docker.container.create({
            Image: 'microsoft/dotnet:latest',
            name: 'test-dotnet',
            ExposedPorts: {
                "5001/tcp": {},
                "5002/tcp": {},

            },
            "NetworkingConfig": {
                "EndpointsConfig": {
                    "test": {}
                }
            },
            HostConfig: {
                "PortBindings": {
                    "5001/tcp": [{ "HostPort": "5001" }],
                    "5002/tcp": [{ "HostPort": "5002" }]
                },
                Mounts: [
                    {
                        "Target": "/app",
                        "Source": "test",
                        "Type": "volume",
                        "ReadOnly": false
                    }
                ],
            },
            WorkingDir: "/app/src/LogR",
            Cmd: ['dotnet', 'run'],

            /*Cmd: ['tail', '-f', '/dev/null']*/

        })
            .then(container => container.start({}))
            .then(container => {

                dump("dotnet container started");
                test_dotnet = container;

                return container.logs({
                    follow: true,
                    stdout: true,
                    stderr: true
                })
            })
            .then(stream => {
                stream.on('data', async info => {

                    if (info.toString('utf8').includes("Now listening on")) {

                        dump("dotnet application started listening");

                        browser = await puppeteer.launch({
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox'
                            ]
                        });
                        dump("start puppeteer");
                        const page = await browser.newPage();

                        await page.goto('http://localhost:5003/test/index.html');

                        dump("page from nginx container loaded");
                        dump("page loging against dotnet server");
                    }

                    if (info.toString('utf8').includes("teststring")) {
                        dump("log message matched")
                        dump("test succeded")

                        dump("end of test")
                        test_dotnet.delete({ force: true })

                        dump("dotnet container deleted");
                        test_nginx.delete({ force: true })

                        dump("nginx container deleted");
                        browser.close();
                        dump("browser closed");
                        //spinner.stop();
                        done();

                    }



                })
                stream.on('error', err => dump(err.toString('utf8')))
            })
            .catch(error => dump(error));

        await docker.container.create({
            Image: 'nginx:latest',
            name: 'test-nginx',
            ExposedPorts: {
                "80/tcp": {},


            },
            "NetworkingConfig": {
                "EndpointsConfig": {
                    "test": {}
                }
            },
            HostConfig: {
                "PortBindings": {
                    "80/tcp": [{ "HostPort": "5003" }],
                },
                Mounts: [
                    {
                        "Target": "/usr/share/nginx/html",
                        "Source": "test",
                        "Type": "volume",
                        "ReadOnly": false
                    }
                ],
            },
            /*Cmd: ['tail', '-f', '/dev/null']*/

        })
            .then(container => container.start({})).then(container => {

                dump("nginx container started");
                test_nginx = container;

            })

    }, 50000);

});