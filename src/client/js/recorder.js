import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const preview = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input:"recording.webm",
    output:"output.mp4",
    thumb:"thumbnail.jpg"
}
const downloadFile = (fileUrl, fimeName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fimeName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async() => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        corePath: "/convert/ffmpeg-core.js",
        log: true,
        });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run('-i', files.input, '-r', '60', files.output);

    await ffmpeg.run(
        "-f",
        "mp4",
        "-i",
        files.output,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb,
    );

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbnail = ffmpeg.FS("readFile", files.thumb);
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbBlob = new Blob([thumbnail.buffer], {type:"image/jpg"});
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");
   

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
    
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
    
}
const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);

    recorder = new MediaRecorder(stream, {MimeType:"video/webm"});
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        preview.srcObject = null;
        preview.src = videoFile;
        preview.loop = true;
        preview.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    }
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 4000);
}
const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        video: {width: 1024, height:576}, audio:true
    });
    preview.srcObject = stream;
    preview.play();
}

init();
actionBtn.addEventListener("click", handleStart);