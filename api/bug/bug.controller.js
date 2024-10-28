import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { userService } from "../user/user.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res){
    const { search, sortBy, pageIdx  } = req.query
    const filterBy = { search, sortBy, pageIdx: +pageIdx } //to cast to numbers if the filter is int
    try{
        const bugs = await bugService.query( filterBy )
        res.send(bugs)
        
    } catch (err ){
        return res.status(400).send(err)
    }
}
export async function updateBug (req, res) {
    var user = req.loggedinUser

    
    console.log('req.params:', req.body)
    const {_id, title, description, severity, createdAt , owner } = req.body
    let bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        createdAt : +createdAt,
        owner
    }

    try {
        const savedBug = await bugService.save( bugToSave , user)


        res.send(savedBug)
    } catch (err) {
        return res.status(400).send(err)
    }
   

}

export async function addBug  (req, res)  {
    var user = req.loggedinUser
    const {_id, title, description, severity, createdAt } = req.body
    let bugToSave = {
        title,
        description,
        severity: +severity,
        createdAt : +createdAt,
        owner : user
    }

    try {
        const savedBug = await bugService.save( bugToSave , user)


        res.send(savedBug)
    } catch (err) {
        return res.status(400).send(err)
    }
   

}

export async function getBug  (req, res) {
    const {bugId} = req.params
    let { visitBug = [] } = req.cookies
    if (!visitBug.includes(bugId)){
        res.cookie('visitBug', visitBug = visitBug.concat([bugId]) , {maxAge: 7 * 1000 })
    }
    if (visitBug.length > 1)
        return res.status(401).send('Wait for a bit')
       

    try{
        console.log('visitBug:', visitBug)
        const bug = await bugService.getById ( bugId )
        res.send(bug )

    } catch (err ){
        res.status(400).send(err)
    }
    
}



export async function removeBug  (req, res)  {
    var user = req.loggedinUser

    const {bugId} = req.params
    try{
        // const bugs = bugs.filter(bug => bug._id !== bugId)
        //  res.send(bugs)
        const bugs = await bugService.remove( bugId , user )
        res.send('OK')
    } catch (err ){
        loggerService.error(`removeBug failed: ${err}`)
        res.status(400).send(err)

    }


}
