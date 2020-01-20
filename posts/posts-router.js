const router = require("express").Router()
const Posts = require("../data/db")
const { validatePost, validatePostChanges, validateComment }  = require("./validate")

/************************/
/******** CREATE ********/
/************************/

/* HOME */

router.post("/", (req, res) => {

    const validation = validatePost(req.body)

    if (validation.success) {
        Posts.insert(req.body)

            .then(({id}) => {
                Posts.findById(id)

                    .then(posts => {
                        const post = posts[0]
                        res.status(201)
                        .json(post)})
                    .catch(error => {
                        res.status(500)
                        .json({ error: "Error while getting the created post." })
                    })})
            .catch(error => {
                res.status(500)
                .json({ error: "Error while creating the post." })
            })    
    } else {
        res.status(400)
        .json({ error: validation.error })
    }
})

/* HOME ID COMMENTS */

router.post("/:id/comments", (req, res) => {

    const validation = validateComment(req.body)

    if (validation.success) {
        Posts.findById(req.params.id)
            .then(([post]) => {

                if (post) {
                    Posts.insertComment({ ...req.body, post_id: req.params.id })

                        .then(({ id }) => {
                            Posts.findCommentById(id)
                                .then(([comment]) => {
                                    res.status(201)
                                    .json(comment)})
                                })
                        .catch(error => {
                            res.status(500)
                            .json({ error: "Error while getting the created comment." })
                        })
                } else {
                    res.status(404)
                    .json({ message: "Post id not found." })
                }})
            .catch(error => {
                res.status(500)
                .json({ error: "Error while saving the comment to the database" })
            })
    } else {
        res.status(400).json({ error: validation.error })
    }
})



/**********************/
/******** READ ********/
/**********************/

/* HOME */

router.get("/", (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200)
            .json(posts)})
        .catch(error => {
            res.status(500)
            .json({ error: "Error getting the posts." })
        })
})

/* HOME ID */

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(posts => {
            const post = posts[0]

            if (post) {
                res.status(200)
                .json(post)

            } else {
                res.status(404)
                .json({ message: "Post id not found." })
            }})
        .catch(error => {
            res.status(500)
            .json({ error: "Error getting the post." })
        })
})

/* HOME ID COMMENTS */

router.get("/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            res.status(200)
            .json(comments)})
        .catch(error => {
            res.status(500)
            .json({ error: "Error getting the post." })
        })
})



/************************/
/******** UPDATE ********/
/************************/

router.put("/:id", (req, res) => {

    const validation = validatePostChanges(req.body)

    if (validation.success) {
        Posts.update(req.params.id, req.body)
            .then(count => {

                if (count > 0) {
                    res.status(200)
                    .json({ message: "Post update was successful." })

                } else {
                    res.status(404)
                    .json({ message: "Post id not found." })
                }})
            .catch(error => {
                res.status(500)
                .json({ error: "Error updating the post." })
            })
    } else {
        res.status(400)
        .json({ error: validation.error })
    }
})



/************************/
/******** DELETE ********/
/************************/

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {

            if (count > 0) {
                res.status(200)
                .json({ message: "Post delete was successful." })

            } else {
                res.status(404)
                .json({ message: "The Post with the specified id was not found." })
            }})
        .catch(error => {
            res.status(500)
            .json({ error: "We ran into an error removing the Post." })
        })
})