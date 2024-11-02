import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"

export const bugService = {
    query,
    getById, 
    remove, 
    save,
}

const bugs = utilService.readJsonFile( './data/bug.json' )
const PAGE_SIZE = 2

async function query( filterBy = {}){
    const filteredBugs = [ ...bugs ]
    
    try{
        if (filterBy.search) {  
            const {search} = filterBy
            const regExp= new RegExp(search, 'i');
           
            filteredBugs = filteredBugs.filter(bug => { regExp.test(bug?.title) })               
        }

        if (filterBy.sortBy) {
            const {sortBy} = filterBy
            switch (sortBy){         
                case 'severity':
                    filteredBugs = filteredBugs.sort((bug1,bug2) => bug1.severity - bug2.severity ) 
                case 'createdAt&sortDir=-1':
                    filteredBugs = filteredBugs.sort((bug1,bug2) => bug2.createdAt - bug1.createdAt ) 
                case 'title':
                default:
                    filteredBugs.sort((bug1,bug2) =>  bug1.title.localeCompare(bug2.title, undefined, { sensitivity: 'accent' }) )                      
            }
            
        }

        if ( filterBy.pageIdx !== undefined ){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice( startIdx , startIdx + PAGE_SIZE)
        }
        return filteredBugs
    } catch (err){
        loggerService.error("Cannot get bugs", err)
        throw new Error ('Could not get bugs')
    }
    

}

async function getById( bugId ){
    try{
        const bug = bugs.find(bug => bug._id === bugId)
        if( ! bug) throw new Error ( 'could not find bug')
        return bug
    } catch (err ){
        loggerService.error("could not find bug", err)
        throw new Error ('could not find bug')
    }
} 

async function remove( bugId, user  ){
    try{
        const bugIndex = bugs.findIndex(bug => bug._id === bugId)
        if ( bugIndex === -1 ) throw  new Error ("bad bug id, could not find bug to remove")
        if( !user.isAdmin){
            if ( bugs[index].owner._id !== user._id)  throw "Not Your Car"
        }
        bugs.splice(bugIndex, 1)

        _saveBugs()
    } catch (err ){
        throw err
    }

    

} 

async function save( bugToSave, user ){
    try {
        
        if(bugToSave._id){
            const index = bugs.findIndex(bug => bug._id === bugToSave._id)
            bugs.splice(index, 1 , bugToSave)
            if( !user.isAdmin){
                if ( bugs[index].owner._id !== user._id)  throw  new Error ("Not Your Car")
            }
        } else{        
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave)
        }
        _saveBugs()
    } catch (err) {
        loggerService.error("could not save bug", err)
        throw  new Error ("could not save bug")
    }
    return bugToSave
}

async function _saveBugs ( ){
    try{
        utilService.writeJsonFile( './data/bug.json' , bugs )
    }catch (err ){
        loggerService.error("could not write bugs to json file", err)
    }
}