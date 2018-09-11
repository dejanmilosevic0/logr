if [[ "$(docker images -q microsoft/dotnet:latest  2> /dev/null)" == "" ]]; then
  docker pull microsoft/dotnet:latest 
fi
if [[ "$(docker images -q nginx:latest  2> /dev/null)" == "" ]]; then
  docker pull nginx:latest
fi
docker volume create --name test --opt type=none --opt device=$(pwd) --opt o=bind
docker run --user root -it --rm --net=host -w /app/test -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/app alekzonder/puppeteer:latest npm run test
