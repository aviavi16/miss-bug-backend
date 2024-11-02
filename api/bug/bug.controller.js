import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res){
    const { search, sortBy, pageIdx } = req.query
    const filterBy = { search, sortBy, pageIdx: +pageIdx || undefined } //to cast to numbers if the filter is int
    try{
        const bugs = await bugService.query( filterBy )
        res.send(bugs)
        
    } catch (err ){
        return res.status(400).send("Could not get bugs")
    }
}

export async function updateBug (req, res) {
    const {loggedinUser} = req
    const { title, description, severity } = req.body
    const bugToSave = {
        title,
        description,
        severity: +severity
    }

    try {
        const savedBug = await bugService.save( bugToSave , loggedinUser)
        res.send(savedBug)
    } catch (err) {
        return res.status(400).send("Could not update bug")
    }
}

export async function addBug  (req, res)  {
    const {loggedinUser} = req
    const { title, description, severity, createdAt } = req.body
    const bugToSave = {
        title,
        description,
        severity: +severity,
        createdAt : +createdAt,
        owner : loggedinUser
    }

    try {
        const savedBug = await bugService.save( bugToSave , loggedinUser)
        res.send(savedBug)
    } catch (err) {
        return res.status(400).send("Could not add bug")
    }
}

export async function getBug  (req, res) {
    const {bugId} = req.params
    const { visitedBugIds = [] } = req.cookies
    if (!visitedBugIds.includes(bugId)){
        res.cookie('visitBug', [...visitedBugIds, bugId], {maxAge: 7 * 1000 })
    }
    if (visitBug.length > 1) return res.status(401).send('Wait for a bit')
       
    try{
        console.log('visitBug:', visitBug)
        const bug = await bugService.getById ( bugId )
        res.send(bug )

    } catch (err ){
        loggerService.error('Cannot get bug', err)
        res.status(400).send("Cannot get bug")
    }
   
}

export async function removeBug  (req, res)  {
    const {loggedinUser} = req

    const {bugId} = req.params
    try{
        await bugService.remove( bugId , loggedinUser )
        res.send('OK')
    } catch (err ){
        loggerService.error(`removeBug failed: ${err}`)
        res.status(400).send("Cannot remove bug")

    }


}
