const form = document.getElementById("commentForm");
const videoContainer = document.querySelector(".video_video");
const deleteBtn = document.querySelectorAll(".video_comments__comment__delete");

const deleteComment = (li) => {
    const commentList = document.querySelector(".video_comments ul");
    commentList.removeChild(li);


}
const addComment = (text, newCommentId, avatarUrl) => {
    const videoComments = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    const span = document.createElement("span");
    const i = document.createElement("i");
    const img = document.createElement("img");
    i.addEventListener("click", handleDelete);
    span.innerText = text;
    i.className = "far fa-trash-alt fa-lg video_comments__comment__delete";
    img.src = avatarUrl;

    newComment.className = "video_comments__comment";
    newComment.dataset.commentid = newCommentId;
    newComment.appendChild(img);
    newComment.appendChild(span);
    newComment.appendChild(i);
    videoComments.prepend(newComment);

}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const {videoid} = videoContainer.dataset;
    if(text === "")
        return;
    const response = await fetch(`/api/videos/${videoid}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        })
    });
    textarea.value = "";
    
    if(response.status === 201) {
        const {newCommentId, avatarUrl} = await response.json();
        addComment(text, newCommentId, avatarUrl);
    }
}

const handleDelete = async(event) => {
    const li = event.target.parentNode;
    const {commentid} = li.dataset;
    const response = await fetch(`/api/videos/comments/${commentid}/delete`, {
        method: "DELETE",
    });
    
    if(response.status === 200) {
        deleteComment(li);
    }
}

if(form) {
    form.addEventListener("submit", handleSubmit);
}
if(deleteBtn) {
    deleteBtn.forEach(function(currentBtn) {
        currentBtn.addEventListener("click", handleDelete);
    })
}