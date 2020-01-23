module.exports = {
    validatePost,
    validatePostChanges,
    validateComment
}

function validatePost(post) {
    const { title, contents } = post
    let success = true
    let error = ""
  
    if (!title || !contents) {
        success = false
        error = "Missing title and contents for the post."
    }
  
    return {
        success,
        error
    }
}

function validatePostChanges(changes) {
    const { title, contents } = changes
    let success = true
    let error = ""

    if (!title && !contents) {
        success = false
        error = "Missing title or contents for the post."
    }

    return {
        success,
        error
    }
}

function validateComment(comment) {
    const { text } = comment
    let success = true
    let error = ""

    if (!text) {
        success = false
        error = "Missing text for the comment."
    }

    return {
        success,
        error
    }
}