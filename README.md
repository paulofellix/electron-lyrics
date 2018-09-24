Electron Lyrics
---

A simple application to display song lyrics

API Key
---
It can be obtained at https://auth.vagalume.com.br/settings/api/

It is necessary to register, after that, get your credential and put into apikey.js.example

Then copy apikey.js.example to apikey.js

Developing
---
First, be sure to install dependencies:

    npm install

Then start a dev server:

    npm start
    
Building
---
There is two methods to build:

1. *Package* - Package the application into a specific folder. It's not for distribution, only local execution

        npm run package

2. *Make* - Makes platform specific distributables of application

    Targets: [linux, darwin, win32] available
    
    For linux: it's necessary change package.json, on *linux* leave just what your system support.
    
    deb = Debian, Ubuntu, Dream Linux, Linux Mint, etc. 
    rpm = RedHat, Fedora, CentOS, Mandriva, OpenSuse, etc. 

        npm run make --targets="linux" //Choose your correct target
        
Enjoy
---