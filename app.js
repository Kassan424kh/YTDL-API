const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const contentDisposition = require("content-disposition");

const app = express();
app.use(cors());
app.listen(4000, () => {
    console.log("Server Works !!! At port 4000");
});

app.get("/video-name", async (req, res) => {
    var URL = req.headers.url;

    let videoName = Date.now();
    const videoInfos = await ytdl.getInfo(URL);
    if (videoInfos) videoName = videoInfos.videoDetails.title;

    res.send(videoName);
});

const getVideoName = async (URL) => {
    let videoName = Date.now();
    const videoInfos = await ytdl.getInfo(URL);
    if (videoInfos) videoName = videoInfos.videoDetails.title;
    return videoName;
};

app.get("/download/audio", async (req, res) => {
    var URL = req.headers.url;
    const videoName = await getVideoName(URL);
    res.attachment(`[${videoName}].flac`);

    ytdl(URL, {
        filter: "audioonly",
        format: "flac"
    }).pipe(res);
});

app.get("/download/video", async (req, res) => {
    var URL = req.headers.url;
    const videoName = await getVideoName(URL);
    res.attachment(videoName + ".mp4");

    ytdl(URL, {
        format: "mp4"
    }).pipe(res);
});
