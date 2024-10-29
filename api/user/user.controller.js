import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { userService } from "./user.service.js"

export async function getUsers (req, res){
    const { search, sortBy, pageIdx  } = req.query
    const filterBy = { search, sortBy, pageIdx: +pageIdx } //to cast to numbers if the filter is int
    try{
        const users = await userService.query( filterBy )
        res.send(users)
        
    } catch (err ){
        return res.status(400).send(err)
    }
}
export async function updateUser (req, res) {

    console.log('req.params:', req.body)
    const {_id, username, fullname, password, score, img, createdAt , isAdmin } = req.body
    let userToSave = {
        _id,
        username,
        fullname,
        password: +password,
        score : +score,
        img,
        createdAt,
        isAdmin,
    }

    try {
        const savedUser = await userService.save( userToSave )


        res.send(savedUser)
    } catch (error) {
        return res.status(400).send(err)
    }
   

}

export async function addUser  (req, res)  {



   
    try {
        const { username, password, fullname  } = req.body //, score , img, createdAt , isAdmin
        const account = await authService.signup( username, password , fullname)
        console.log('account:', account)
        loggerService.debug(`user.route (controller) - new account:` + JSON.stringify(account)  )


        res.send(account)
    } catch (err) {
        return res.status(400).send(err)
    }
   

}

export async function getUser  (req, res) {
    const {userId} = req.params
    let { visitUser = [] } = req.cookies
    if (!visitUser.includes(userId)){
        res.cookie('visitUser', visitUser = visitUser.concat([userId]) , {maxAge: 7 * 1000 })
    }
    if (visitUser.length > 3)
        return res.status(401).send('Wait for a bit')
       

    try{
        console.log('visitUser:', visitUser)
        const user = await userService.getById ( userId )
        res.send(user )

    } catch (err ){
        res.status(400).send(err)
    }
    
}



export async function removeUser  (req, res)  {
    const {userId} = req.params
    try{
        // const users = users.filter(user => user._id !== userId)
        //  res.send(users)
        const users = await userService.remove( userId )
        res.send('OK')
    } catch (err ){
        res.status(400).send(err)

    }


}
