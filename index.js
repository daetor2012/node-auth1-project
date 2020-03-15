const express = require("express")
const server = express()
const port = 4000;
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const dbConfig = require("./config")
server.use(express.json())
server.use(session({
	name: "token",
	resave: false,
	saveUninitialized: false,
	secret: "keep it safe",
	store: new KnexSessionStore({
		knex: dbConfig,
		createtable: true,
	}),
}))
server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
    res.json({ message: "Welcome to the server!" })
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})