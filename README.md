# http-mailer

An HTTP REST API for sending emails 

**Warning: Never directly expose this service! Either use internally only (firewall) or serve behind an https proxy**

## How it works

This is a very simple utility which just exposes the basics of `nodemailer` over HTTP. The transport configuration is loaded from a config file at startup time. The message contents are sent via HTTP POST to `/mail`. `Express` is used to take care of the HTTP work, because I was too lazy to work with node's default http lib.

This tool listens on port 8025.

## Example setup

This tool is designed to be used with docker. The only thing needed is to start a docker container with following env vars:

* MAILER_AUTH: set to true to enable HTTP authorization header checking (advised!)
* MAILER_USERNAME: username (only when auth is enabled)
* MAILER_PASSWORD: password (only when auth is enabled) 
* MAILER_SETTINGS_PATH: Path to json file with nodemailer format transport config. See examples/sample-config.json 

docker run -d -p 8025:8025 -e MAILER_AUTH=false -e MAILER_SETTINGS_PATH=config.json wimgoeman/http-mailer

## Example usage

### Cron

```
curl -H "Content-Type: application/json" -X POST --user urname:password -d '{"message":{"from" : "no-reply@wimgoeman.be", "to": "user@example.org", "subject" : "Example mail", "plain": "Hello world!"}}' http://localhost:8025/mail
```

