var dbus = require("dbus-native");
var bus = dbus.sessionBus();

exports.getPlaybackStatus = (fn) => {
    bus.invoke({
        destination: "org.mpris.MediaPlayer2.spotify",
        path: "/org/mpris/MediaPlayer2",
        interface: "org.freedesktop.DBus.Properties",
        member: "Get",
        signature: "ss",
        body: ["org.mpris.MediaPlayer2.Player", "PlaybackStatus"]
    }, fn)
}

exports.getMetadata = (fn) => {
    bus.invoke({
        destination: "org.mpris.MediaPlayer2.spotify",
        path: "/org/mpris/MediaPlayer2",
        interface: "org.freedesktop.DBus.Properties",
        member: "Get",
        signature: "ss",
        body: ["org.mpris.MediaPlayer2.Player", "Metadata"]
    }, fn)
}

exports.next = (fn) => {
    bus.invoke({
        destination: "org.mpris.MediaPlayer2.spotify",
        path: "/org/mpris/MediaPlayer2",
        interface: "org.mpris.MediaPlayer2.Player",
        member: "Next",
        // signature: "ss",
        // body: ["org.mpris.MediaPlayer2.Player", "Metadata"]
    }, fn)
}

exports.prev = (fn) => {
    bus.invoke({
        destination: "org.mpris.MediaPlayer2.spotify",
        path: "/org/mpris/MediaPlayer2",
        interface: "org.mpris.MediaPlayer2.Player",
        member: "Previous",
    }, fn)
}

exports.playPause = (fn) => {
    bus.invoke({
        destination: "org.mpris.MediaPlayer2.spotify",
        path: "/org/mpris/MediaPlayer2",
        interface: "org.mpris.MediaPlayer2.Player",
        member: "PlayPause",
    }, fn)
}