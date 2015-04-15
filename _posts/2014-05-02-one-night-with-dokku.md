---
layout: post
title: "One Night with Dokku"
date: 2014-05-02 19:58:19
tags: dokku
---

[Dokku](https://github.com/progrium/dokku) is Docker powered mini-Heroku. The smallest
[PaaS](http://en.wikipedia.org/wiki/Platform_as_a_service) implementation you've ever seen,
but without the web interface (command line all the way).
Dokku requires Ubuntu 14.04 with 64 bit architecture.

# Install

Installing dokku is very simple, just run the following command:

    server$ wget -qO- https://raw.github.com/progrium/dokku/v0.2.3/bootstrap.sh | sudo DOKKU_TAG=v0.2.3 bash

The script will bootstrap the installation. Add your public key to the server.

    server$ cat ~/.ssh/id_rsa.pub | ssh root@123.456.789.012 "sudo sshcommand acl-add dokku my-computer"

# Domain Setup

Point your domain and a wildcard domain to dokku IP address with alias record.

```shell
apps.example.com.   300	  IN	A  123.456.789.012
*.apps.example.com. 300	  IN	A  123.456.789.012
```

After deployed your app will be accessible in `appname.apps.example.com`.

# PostgreSQL Plugin

To enabling database support in dokku, we must install database plugin. There are several
postgresql plugin for dokku, but most of them are obsolete. So I fork from one of them, and rebuild
to be a working plugin.

    server$ cd /var/lib/dokku/plugins/
    server$ git clone https://github.com/rezajatnika/dokku-pg-plugin
    server$ dokku plugins-install

After installing this plugin, we can create postgresql container.

    server$ dokku postgresql:create appname
    # From local machine
    $ ssh -t dokku@app.example.com postgresql:create appname

# Deploying Rails Application

On your Rails app directory.

    $ git remote add dokku dokku@app.rakarsa.com:appname
    $ git push dokku master
    $ ssh -t dokku@app.example.com postgresql:create appname
    $ ssh -t dokku@app.example.com postgresql:restore appname
    $ ssh -t dokku@app.example.com postgresql:link appname appname

And that's it, your app will deployed after pushing with git.

# ASCII Cinema

This is a demo showing example Rails app deployment using dokku.

<script type="text/javascript" src="https://asciinema.org/a/9270.js" id="asciicast-9270" async data-speed="2" data-size="small"></script>
