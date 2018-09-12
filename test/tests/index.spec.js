'use strict';
const { Docker } = require('node-docker-api');
const puppeteer = require('puppeteer');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const ora = require('ora');

var test_dotnet, test_nginx, browser;
const spinner = ora().start();

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

                spinner.info("dotnet container started").start();
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

                        spinner.info("dotnet application started listening").start();

                        browser = await puppeteer.launch({
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox'
                            ]
                        });
                        spinner.info("start puppeteer").start();
                        const page = await browser.newPage();

                        await page.goto('http://localhost:5003/test-html/index.html');

                        spinner.info("page from nginx container loaded").start();
                        spinner.info("page loging against dotnet server").start();
                    }

                    if (info.toString('utf8').includes("teststring")) {
                        spinner.info("log message matched").start()
                        spinner.info("test succeded").start()

                        spinner.info("end of test").start()
                        test_dotnet.delete({ force: true })

                        spinner.info("dotnet container deleted").start();
                        test_nginx.delete({ force: true })

                        spinner.info("nginx container deleted").start();
                        browser.close();
                        spinner.info("browser closed").start();
                        spinner.stop();
                        done();

                    }



                })
                stream.on('error', err => spinner.info(err.toString('utf8')).start())
            })
            .catch(error => spinner.info(error).start());

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

                spinner.info("nginx container started").start();
                test_nginx = container;

            })

    }, 50000);

});