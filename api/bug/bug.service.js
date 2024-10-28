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
    var filteredBugs = [ ...bugs ]
    try{
        if (filterBy.search) {
        
            let {search} = filterBy
           
            filteredBugs = filteredBugs.filter(bug => 
                (bug.title ? bug.title : ' ').toLowerCase().includes(search.toLowerCase())) 
        }

        if (filterBy.sortBy) {
            let {sortBy} = filterBy
            switch (sortBy){         
                case 'severity':
                    filteredBugs = filteredBugs.sort((a,b) => 
                        (a.severity - b.severity )) 
                case 'createdAt&sortDir=-1':
                    filteredBugs = filteredBugs.sort((a,b) => 
                        (b.createdAt - a.createdAt )) 
                case 'title':
                default:
                    filteredBugs.sort((a,b) =>  a.title.localeCompare(b.title, undefined, { sensitivity: 'accent' }) )                      
            }
            
        }

        if ( filterBy.pageIdx !== undefined  && !isNaN(filterBy.pageIdx) ){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice( startIdx , startIdx + PAGE_SIZE)
        }
        return filteredBugs
    } catch (err){
        loggerService.error(err)
        throw 'Could not get bugs...'
    }
    

}

async function getById( bugId ){
    try{
        const bug = bugs.find(bug => bug._id === bugId)
        if( ! bug) throw 'could not find bug'
        return bug
    } catch (err ){
        loggerService.error(err)
        throw 'could not find bug'
    }
} 

async function remove( bugId, user  ){
    try{
        const bugIndex = bugs.findIndex(bug => bug._id === bugId)
        if ( bugIndex === -1 ) throw "bad bug id, could not find bug to remove"
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
                if ( bugs[index].owner._id !== user._id)  throw "Not Your Car"
            }
        } else{
            
            console.log('1 bugToSave:', bugToSave)
            bugToSave._id = utilService.makeId()
            console.log('2 bugToSave:', bugToSave)
            bugs.push(bugToSave)
            console.log('bugs:', bugs)
        }
        _saveBugs()
    } catch (error) {
        throw "could not save bug"

    }

    return bugToSave
}

async function _saveBugs ( ){
    try{
        utilService.writeJsonFile( './data/bug.json' , bugs )
    }catch (err ){
        loggerService.error(err)
    }
}