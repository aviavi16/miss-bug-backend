import { loggerService } from "../../services/logger.service.js"
import { utilService } from "../../services/util.service.js"

export const userService = {
    query,
    getById, 
    getByUsername,
    remove, 
    save,
    getEmptyUser,
}

const users = utilService.readJsonFile( './data/user.json' )
const PAGE_SIZE = 2

async function query( filterBy = {}){
    var filteredUsers = [ ...users ]
    try{
        if (filterBy.search) {
        
            let {search} = filterBy
           
            filteredUsers = filteredUsers.filter(user => 
                (user.username ? user.username : ' ').toLowerCase().includes(search.toLowerCase())) 
        }

        if (filterBy.sortBy) {
            let {sortBy} = filterBy
            switch (sortBy){         
                case 'password':
                    filteredUsers = filteredUsers.sort((a,b) => 
                        (a.password - b.password )) 
                case 'score&sortDir=-1':
                    filteredUsers = filteredUsers.sort((a,b) => 
                        (b.score - a.score )) 
                case 'username':
                default:
                    filteredUsers.sort((a,b) =>  a.username.localeCompare(b.username, undefined, { sensitivity: 'accent' }) )                      
            }
            
        }

        if ( filterBy.pageIdx !== undefined  && !isNaN(filterBy.pageIdx) ){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredUsers = filteredUsers.slice( startIdx , startIdx + PAGE_SIZE)
        }
        return filteredUsers
    } catch (err){
        loggerService.error(err)
        throw 'Could not get users...'
    }
    

}

async function getById( userId ){
    try{
        const user = users.find(user => user._id === userId)
        if( ! user) throw `User not found by userId : ${userId}`
        return user
    } catch (err ){
        loggerService.error('userService(getById): ',err)
        throw err
    }
} 

async function getByUsername ( username ){
    try{
        const user = users.find(user => user.username === username)
        return user
    } catch (err ){
        loggerService.error('userService(getByUsername): ',err)
        throw err
    }
} 

async function remove( userId ){
    try{
        const userIndex = users.findIndex(user => user._id === userId)
        if ( userIndex === -1 ) throw `bad user id, could not find user to remove ${userId}`
        users.splice(userIndex, 1)

        await _saveUsers()
    } catch (err ){
        loggerService.error('userService(remove): ',err)
        throw err
    }

    

} 

async function save( userToSave ){
    try {
        
        if(userToSave._id){
            const index = users.findIndex(user => user._id === userToSave._id)
            users.splice(index, 1 , userToSave)
    
        } else{
            const { username, password, fullname, img, score } = userToSave
            console.log('1 userToSave:', userToSave)
            userToSave = userService.getEmptyUser()
            console.log('test:', username, password, fullname)
            userToSave.username = username
            userToSave.password = password
            userToSave.fullname = fullname
            userToSave.createdAt = Date.now()
            userToSave.img = img || 'https://static8.depositphotos.com/1007989/894/i/450/depositphotos_8943042-stock-photo-okay-smiley.jpg'
            userToSave.score = score || 10000
            console.log('2 userToSave:', userToSave)

            users.push(userToSave)
        }
        await _saveUsers()
    } catch (error) {
        loggerService.error('userService(save): ',err)
        throw err

    }

    return userToSave
}

async function _saveUsers ( ){
    try{
        utilService.writeJsonFile( './data/user.json' , users )
    }catch (err ){
        loggerService.error(err)
    }
}

function getEmptyUser(){
    try {
        console.log('test:')
        const  emptyUser = {
            _id : utilService.makeId(),
            username: '',
            fullname: '',
            password: '',
            score : 10000,
            img: '',
            createdAt: 0,
            isAdmin: false,
        }
        console.log('test2:')
        return emptyUser
    } catch (error) {
        loggerService.error(err)
    }
    
}