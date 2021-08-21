const form = document.getElementById("commentForm");
const videoContainer = document.querySelector(".video_video");
const deleteBtn = document.querySelectorAll(".video_comments__comment__delete");

const deleteComment = (li) => {
    const commentList = document.querySelector(".video_comments ul");
    commentList.removeChild(li);


}
const addComment = (text, newCommentId) => {
    const videoComments = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    const span = document.createElement("span");
    const delBtn = document.createElement("button");
    delBtn.addEventListener("click", handleDelete);
    span.innerText = text;
    delBtn.className = "video_comments__comment__delete";
    delBtn.innerText = "Delete";

    newComment.className = "video_comments__comment";
    newComment.dataset.commentid = newCommentId;
    newComment.appendChild(span);
    newComment.appendChild(delBtn);
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
        const {newCommentId} = await response.json(); 
        addComment(text, newCommentId);
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